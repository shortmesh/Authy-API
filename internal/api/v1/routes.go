package v1

import (
	"authy-api/internal/api/v1/handlers/otp"
	"authy-api/internal/api/v1/handlers/platforms"
	"authy-api/internal/database"
	"authy-api/internal/middleware"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(g *echo.Group, db database.Service) {
	otpHandler := otp.NewOTPHandler(db)
	platformHandler := platforms.NewPlatformHandler(db)
	bearerAuth := middleware.NewBearerAuth()

	// OTP routes
	g.POST("/otp/generate", otpHandler.Generate, bearerAuth.OptionalAuthenticate())
	g.POST("/otp/verify", otpHandler.Verify)

	// Platform routes
	g.GET("/platforms", platformHandler.List, bearerAuth.OptionalAuthenticate())
}
