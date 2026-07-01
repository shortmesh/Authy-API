package platforms

import (
	"authy-api/internal/database"
)

// PlatformInfo represents detailed information about a platform
type PlatformInfo struct {
	DisplayName string `json:"display_name" example:"WhatsApp"`
	Name        string `json:"name" example:"wa"`
	IconURL     string `json:"icon_url" example:"http://localhost:8080/demo/Whatsapp.svg"`
}

// ListPlatformsResponse represents the response for listing platforms
type ListPlatformsResponse []PlatformInfo

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error" example:"message"`
}

type PlatformHandler struct {
	db database.Service
}

func NewPlatformHandler(db database.Service) *PlatformHandler {
	return &PlatformHandler{db: db}
}
