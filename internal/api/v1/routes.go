package v1

import (
	"authy-api/internal/api/v1/handlers/users"
	"authy-api/internal/database"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(g *echo.Group, db database.Service) {
	userHandler := users.NewUserHandler(db)

	// Auth routes
	g.POST("/auth/register", userHandler.Create)
	g.POST("/auth/login", userHandler.Login)
}
