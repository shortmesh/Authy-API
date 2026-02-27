package otp

import (
	"fmt"
	"net/http"
	"strings"

	"authy-api/internal/database/models"
	"authy-api/pkg/logger"

	"github.com/labstack/echo/v4"
)

// Verify godoc
//
//	@Summary		Verify OTP
//	@Description	Verify an OTP code for the authenticated user
//	@Tags			otp
//	@Accept			json
//	@Produce		json
//	@Security		BasicAuth
//	@Param			request	body		VerifyOTPRequest	true	"OTP verification request"
//	@Success		200		{object}	VerifyOTPResponse	"OTP verified successfully"
//	@Failure		400		{object}	ErrorResponse		"Invalid request body or validation error"
//	@Failure		401		{object}	ErrorResponse		"Unauthorized"
//	@Failure		429		{object}	ErrorResponse		"TooManyRequests"
//	@Failure		500		{object}	ErrorResponse		"Internal server error"
//	@Router			/api/v1/otp/verify [post]
func (h *OTPHandler) Verify(c echo.Context) error {
	user, ok := c.Get("user").(*models.User)
	if !ok {
		logger.Error("User not found in context")
		return echo.ErrUnauthorized
	}

	var req VerifyOTPRequest
	if err := c.Bind(&req); err != nil {
		logger.Info(fmt.Sprintf("OTP verification failed: invalid request body - %v", err))
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Invalid request body. Must be a JSON object.",
		})
	}

	if strings.TrimSpace(req.Identifier) == "" {
		logger.Info("OTP verification failed: missing identifier")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: identifier",
		})
	}

	if strings.TrimSpace(req.Platform) == "" {
		logger.Info("OTP verification failed: missing platform")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: platform",
		})
	}

	if strings.TrimSpace(req.Sender) == "" {
		logger.Info("OTP verification failed: missing sender")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: sender",
		})
	}

	if strings.TrimSpace(req.Code) == "" {
		logger.Info("OTP verification failed: missing code")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: code",
		})
	}

	err := models.VerifyOTP(
		h.db.DB(), user.ID, req.Identifier, req.Platform, req.Sender, req.Code,
	)
	if err != nil {
		switch err {
		case models.ErrOTPNotFound:
			logger.Error(fmt.Sprintf("OTP verification failed: %s", models.ErrOTPNotFound))
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Invalid or expired OTP",
			})
		case models.ErrOTPExpired:
			logger.Error(fmt.Sprintf("OTP verification failed: %s", models.ErrOTPExpired))
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Invalid or expired OTP",
			})
		case models.ErrOTPInvalidCode:
			logger.Error(fmt.Sprintf("OTP verification failed: %s", models.ErrOTPInvalidCode))
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Invalid or expired OTP",
			})
		case models.ErrOTPTooManyAttempts:
			logger.Error(fmt.Sprintf("OTP verification failed: %s", models.ErrOTPTooManyAttempts))
			return c.JSON(http.StatusTooManyRequests, ErrorResponse{
				Error: "Too many attempts, please request a new code",
			})
		case models.ErrOTPInvalidated:
			logger.Error(fmt.Sprintf("OTP verification failed: %s", models.ErrOTPInvalidated))
			return c.JSON(http.StatusUnauthorized, ErrorResponse{
				Error: "Invalid or expired OTP",
			})
		default:
			logger.Error(fmt.Sprintf("OTP verification failed: %v", err))
			return echo.ErrInternalServerError
		}
	}

	logger.Info("OTP verified successfully")
	return c.JSON(http.StatusOK, VerifyOTPResponse{
		Message: "OTP verified successfully",
	})
}
