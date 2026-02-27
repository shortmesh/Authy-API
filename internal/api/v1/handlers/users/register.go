package users

import (
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"runtime/debug"
	"strings"
	"time"

	"authy-api/internal/api/v1/handlers"
	"authy-api/internal/database/models"
	"authy-api/pkg/crypto"
	"authy-api/pkg/logger"
	"authy-api/pkg/password"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// Create godoc
//
//	@Summary		Create a new user
//	@Description	Create a new user account.
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		CreateUserRequest	true	"User creation request"
//	@Success		201		{object}	UserResponse		"User created successfully"
//	@Failure		400		{object}	ErrorResponse		"Invalid request body or validation error"
//	@Failure		409		{object}	ErrorResponse		"User with email already exists"
//	@Failure		500		{object}	ErrorResponse		"Internal server error"
//	@Router			/api/v1/auth/register [post]
func (h *UserHandler) Create(c echo.Context) error {
	var req CreateUserRequest
	if err := c.Bind(&req); err != nil {
		logger.Info(fmt.Sprintf("Registration failed: invalid request body - %v", err))
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Invalid request body. Must be a JSON object.",
		})
	}

	if strings.TrimSpace(req.Email) == "" {
		logger.Info("Registration failed: missing email")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: email",
		})
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		logger.Info("Registration failed: invalid email format")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Invalid email format",
		})
	}

	if strings.TrimSpace(req.Password) == "" {
		logger.Info("Registration failed: missing password")
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: "Missing required field: password",
		})
	}

	if err := password.ValidatePassword(req.Password); err != nil {
		logger.Info(fmt.Sprintf("Registration failed: password validation - %v", err))
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error: fmt.Sprintf("Invalid password: %v", err),
		})
	}

	_, err := models.FindUserByEmail(h.db.DB(), req.Email)
	if err == nil {
		logger.Info("Registration failed: email already exists")
		return c.JSON(http.StatusConflict, ErrorResponse{
			Error: "User with this email already exists",
		})
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		logger.Error(fmt.Sprintf("Email uniqueness check error: %v", err))
		return echo.ErrInternalServerError
	}

	var clientID string
	var clientSecret string
	txErr := h.db.DB().Transaction(func(tx *gorm.DB) error {
		clientID, err = crypto.GenerateSecureToken(16)
		if err != nil {
			logger.Error(fmt.Sprintf("Failed to generate client ID:\n%v\n\n%s", err, debug.Stack()))
			return err
		}

		clientSecret, err = crypto.GenerateSecureToken(32)
		if err != nil {
			logger.Error(fmt.Sprintf("Failed to generate client secret:\n%v\n\n%s", err, debug.Stack()))
			return err
		}

		user := &models.User{
			ClientID:  clientID,
			CreatedAt: time.Now().UTC(),
			UpdatedAt: time.Now().UTC(),
		}

		if err := user.SetEmail(req.Email); err != nil {
			logger.Error(fmt.Sprintf("Failed to set email:\n%v\n\n%s", err, debug.Stack()))
			return err
		}

		if err := user.SetPassword(req.Password); err != nil {
			logger.Error(fmt.Sprintf("Failed to set password:\n%v\n\n%s", err, debug.Stack()))
			return err
		}

		if err := user.SetClientSecret(clientSecret); err != nil {
			logger.Error(fmt.Sprintf("Failed to set client secret:\n%v\n\n%s", err, debug.Stack()))
			return err
		}

		if err := tx.Create(user).Error; err != nil {
			logger.Error(fmt.Sprintf("Failed to create user: %v", err))
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

	logger.Info("User created successfully")
	return c.JSON(http.StatusCreated, UserResponse{
		Message:      "User created successfully",
		ClientID:     clientID,
		ClientSecret: clientSecret,
	})
}
