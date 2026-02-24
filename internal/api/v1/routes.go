package v1

import (
	"authy-api/internal/api/v1/handlers/otp"
	"authy-api/internal/api/v1/handlers/users"
	"authy-api/internal/database"
	"authy-api/internal/middleware"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(g *echo.Group, db database.Service) {
	userHandler := users.NewUserHandler(db)
	otpHandler := otp.NewOTPHandler(db)
	auth := middleware.NewAuth(db)

	// Auth routes
	g.POST("/auth/register", userHandler.Create)
	g.POST("/auth/login", userHandler.Login)

	// OTP routes
	g.POST("/otp/generate", otpHandler.Generate, auth.Authenticate())
}
