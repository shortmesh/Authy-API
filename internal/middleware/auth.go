package middleware

import (
	"encoding/base64"
	"net/http"
	"runtime/debug"
	"slices"
	"strings"

	"authy-api/internal/database/models"
	"authy-api/pkg/logger"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func (a *AuthMiddleware) Authenticate(methods ...AuthMethod) echo.MiddlewareFunc {
	if len(methods) == 0 {
		methods = []AuthMethod{AuthMethodBasicAuth}
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				logger.Log.Error("Missing authorization header")
				return echo.NewHTTPError(http.StatusUnauthorized, "missing authorization header")
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 {
				logger.Log.Errorf("Invalid authorization header format: %s", authHeader)
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid authorization header format")
			}

			scheme := strings.ToLower(parts[0])
			credentials := parts[1]

			var user *models.User
			var err error

			if scheme == "basic" && isMethodAllowed(methods, AuthMethodBasicAuth) {
				user, err = a.authenticateBasicAuth(credentials)
			} else {
				logger.Log.Errorf("Unsupported or disallowed authorization scheme: %s", scheme)
				return echo.NewHTTPError(http.StatusUnauthorized, "unsupported authorization scheme")
			}

			if err != nil {
				return err
			}

			c.Set("user", user)

			return next(c)
		}
	}
}

func (a *AuthMiddleware) authenticateBasicAuth(credentials string) (*models.User, error) {
	decoded, err := base64.StdEncoding.DecodeString(credentials)
	if err != nil {
		logger.Log.Error("Invalid base64 encoding in credentials")
		return nil, echo.NewHTTPError(http.StatusUnauthorized, "invalid credentials format")
	}

	credParts := strings.SplitN(string(decoded), ":", 2)
	if len(credParts) != 2 {
		logger.Log.Error("Invalid credentials format")
		return nil, echo.NewHTTPError(http.StatusUnauthorized, "invalid credentials format")
	}

	clientID := credParts[0]
	clientSecret := credParts[1]

	var user models.User
	err = a.db.DB().Where("client_id = ?", clientID).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			logger.Log.Error("Invalid credentials")
			return nil, echo.NewHTTPError(http.StatusUnauthorized, "invalid credentials")
		}
		logger.Log.Errorf("Failed to authenticate:\n%v\n\n%s", err, debug.Stack())
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "authentication failed")
	}

	if err = user.CompareClientSecret(clientSecret); err != nil {
		logger.Log.Error("Invalid credentials")
		return nil, echo.NewHTTPError(http.StatusUnauthorized, "invalid credentials")
	}

	return &user, nil
}

func isMethodAllowed(allowedMethods []AuthMethod, method AuthMethod) bool {
	return slices.Contains(allowedMethods, method)
}
