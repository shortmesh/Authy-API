package platforms

import (
	"authy-api/internal/database"
)

// ListPlatformsResponse represents the response for listing platforms
type ListPlatformsResponse []string

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
