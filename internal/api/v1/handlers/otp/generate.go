package otp

import (
	"errors"
	"net/http"
	"runtime/debug"
	"strings"
	"time"

	"authy-api/internal/api/v1/handlers"
	"authy-api/internal/database/models"
	"authy-api/pkg/interfaceclient"
	"authy-api/pkg/logger"
	"authy-api/pkg/messagetemplate"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Generate godoc
//
//	@Summary		Generate and send OTP
//	@Description	Generate a secure OTP code and send it to the specified identifier via the interface API
//	@Tags			otp
//	@Accept			json
//	@Produce		json
//	@Security		BasicAuth
//	@Param			request	body		GenerateOTPRequest	true	"OTP generation request"
//	@Success		200		{object}	GenerateOTPResponse	"OTP sent successfully"
//	@Failure		400		{object}	ErrorResponse		"Invalid request body or validation error"
//	@Failure		500		{object}	ErrorResponse		"Internal server error"
//	@Router			/api/v1/otp/generate [post]
func (h *OTPHandler) Generate(c echo.Context) error {
	user, ok := c.Get("user").(*models.User)
	if !ok {
		logger.Log.Error("User not found in context")
		return echo.ErrUnauthorized
	}

	var req GenerateOTPRequest
	if err := c.Bind(&req); err != nil {
		logger.Log.Infof("OTP generation failed: invalid request body - %v", err)
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Invalid request body. Must be a JSON object.",
		})
	}

	if strings.TrimSpace(req.Identifier) == "" {
		logger.Log.Info("OTP generation failed: missing identifier")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: identifier",
		})
	}

	if strings.TrimSpace(req.Platform) == "" {
		logger.Log.Info("OTP generation failed: missing platform")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: platform",
		})
	}

	if strings.TrimSpace(req.Sender) == "" {
		logger.Log.Info("OTP generation failed: missing sender")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: sender",
		})
	}

	var otpCode string
	var expiresAt time.Time

	txErr := h.db.DB().Transaction(func(tx *gorm.DB) error {
		var err error
		var expiryStr string

		otpCode, expiresAt, err = models.CreateOTP(
			tx, user.ID, req.Identifier, req.Platform, req.Sender,
		)
		if err != nil {
			logger.Log.Errorf("Failed to create OTP: %v\n%s", err, debug.Stack())
			return err
		}

		expiryStr = expiresAt.Format("Mon, at 15:04 MST")

		interfaceClient, err := interfaceclient.New()
		if err != nil {
			logger.Log.Errorf("Failed to initialize interface client: %v\n%s", err, debug.Stack())
			return err
		}

		messageText := messagetemplate.FormatOTPMessage(otpCode, expiryStr)

		sendReq := &interfaceclient.SendMessageRequest{
			DeviceID: req.Sender,
			Contact:  req.Identifier,
			Platform: req.Platform,
			Text:     messageText,
		}

		_, err = interfaceClient.SendMessage(sendReq)
		if err != nil {
			logger.Log.Errorf("Failed to send OTP message: %v\n%s", err, debug.Stack())
			return err
		}

		return nil
	})

	if txErr != nil {
		var tErr *handlers.TxError
		if errors.As(txErr, &tErr) {
			return c.JSON(tErr.StatusCode, ErrorResponse{
				Error: tErr.Message,
			})
		}
		return echo.ErrInternalServerError
	}

	logger.Log.Info("OTP sent successfully")
	return c.JSON(http.StatusOK, GenerateOTPResponse{
		Message:   "OTP sent successfully",
		ExpiresAt: expiresAt.Format(time.RFC3339),
	})
}
