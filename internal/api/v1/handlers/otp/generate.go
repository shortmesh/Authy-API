package otp

import (
	"errors"
	"fmt"
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
//	@Description	Generate a secure OTP code and send it to the specified phone number via the interface API
//	@Tags			otp
//	@Accept			json
//	@Produce		json
//	@Param			request	body		GenerateOTPRequest	true	"OTP generation request"
//	@Success		200		{object}	GenerateOTPResponse	"OTP sent successfully"
//	@Failure		400		{object}	ErrorResponse		"Invalid request body or validation error"
//	@Failure		500		{object}	ErrorResponse		"Internal server error"
//	@Router			/api/v1/otp/generate [post]
func (h *OTPHandler) Generate(c echo.Context) error {
	var req GenerateOTPRequest
	if err := c.Bind(&req); err != nil {
		logger.Info(fmt.Sprintf("OTP generation failed: invalid request body - %v", err))
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Invalid request body. Must be a JSON object.",
		})
	}

	if strings.TrimSpace(req.PhoneNumber) == "" {
		logger.Info("OTP generation failed: missing phone_number")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: phone_number",
		})
	}

	if strings.TrimSpace(req.Platform) == "" {
		logger.Info("OTP generation failed: missing platform")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: platform",
		})
	}

	if strings.TrimSpace(req.DeviceID) == "" {
		logger.Info("OTP generation failed: missing device_id")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: device_id",
		})
	}

	var otpCode string
	var expiresAt time.Time

	txErr := h.db.DB().Transaction(func(tx *gorm.DB) error {
		var err error
		var expiryStr string

		otpCode, expiresAt, err = models.CreateOTP(
			tx, req.PhoneNumber, req.Platform, req.DeviceID,
		)
		if err != nil {
			if err == models.ErrInvalidPhoneNumber {
				logger.Info(fmt.Sprintf("OTP generation failed: invalid phone_number format - %v", err))
				return &handlers.TxError{
					StatusCode: http.StatusBadRequest,
					Message:    "phone_number must be a valid international phone number (e.g., +237123456780 or 237123456780)",
				}
			}
			logger.Error(fmt.Sprintf("Failed to create OTP: %v\n%s", err, debug.Stack()))
			return err
		}

		expiryStr = expiresAt.Format("Mon, at 15:04 MST")

		interfaceClient, err := interfaceclient.New()
		if err != nil {
			logger.Error(fmt.Sprintf("Failed to initialize interface client: %v\n%s", err, debug.Stack()))
			return err
		}

		messageText := messagetemplate.FormatOTPMessage(otpCode, expiryStr)

		sendReq := &interfaceclient.SendMessageRequest{
			DeviceID: req.DeviceID,
			Contact:  req.PhoneNumber,
			Platform: req.Platform,
			Text:     messageText,
		}

		_, err = interfaceClient.SendMessage(sendReq)
		if err != nil {
			logger.Error(fmt.Sprintf("Failed to send OTP message: %v\n%s", err, debug.Stack()))
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

	logger.Info("OTP sent successfully")
	return c.JSON(http.StatusOK, GenerateOTPResponse{
		Message:   "OTP sent successfully",
		ExpiresAt: expiresAt.Format(time.RFC3339),
	})
}
