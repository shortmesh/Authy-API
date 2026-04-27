package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"authy-api/pkg/logger"

	"github.com/labstack/echo/v4"
)

type BearerAuthMiddleware struct {
	matrixPrefix string
}

func NewBearerAuth() *BearerAuthMiddleware {
	matrixPrefix := os.Getenv("MATRIX_TOKEN_PREFIX")
	if matrixPrefix == "" {
		matrixPrefix = "mt_"
	}
	return &BearerAuthMiddleware{
		matrixPrefix: matrixPrefix,
	}
}

func (m *BearerAuthMiddleware) OptionalAuthenticate() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return next(c)
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 {
				logger.Error(fmt.Sprintf("Invalid authorization header format: %s", authHeader))
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid authorization header format")
			}

			scheme := strings.ToLower(parts[0])
			token := parts[1]

			if scheme != "bearer" {
				logger.Error(fmt.Sprintf("Unsupported authorization scheme: %s", scheme))
				return echo.NewHTTPError(http.StatusUnauthorized, "unsupported authorization scheme")
			}

			if !strings.HasPrefix(token, m.matrixPrefix) {
				logger.Error(fmt.Sprintf("Invalid token format: %s. Expected '%s...'", token, m.matrixPrefix))
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid token format")
			}

			c.Set("matrix_token", token)
			return next(c)
		}
	}
}
