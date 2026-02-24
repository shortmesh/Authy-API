package middleware

import (
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
		methods = []AuthMethod{AuthMethodSession}
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
			_ = parts[1]

			if scheme != "bearer" {
				logger.Log.Errorf("Unsupported authorization scheme: %s", scheme)
				return echo.NewHTTPError(http.StatusUnauthorized, "unsupported authorization scheme")
			}

			var user *models.User
			var err error

			if err != nil {
				if err == gorm.ErrRecordNotFound {
					logger.Log.Error("Invalid or expired token")
					return echo.NewHTTPError(http.StatusUnauthorized, "invalid or expired token")
				}
				logger.Log.Errorf("Failed to authenticate:\n%v\n\n%s", err, debug.Stack())
				return echo.NewHTTPError(http.StatusInternalServerError, "authentication failed")
			}

			c.Set("user", user)

			return next(c)
		}
	}
}

func isMethodAllowed(allowedMethods []AuthMethod, method AuthMethod) bool {
	return slices.Contains(allowedMethods, method)
}
