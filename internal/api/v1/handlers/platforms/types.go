package platforms

import (
	"authy-api/internal/database"
)

// Platform represents a platform with its sender
type Platform struct {
	Platform string `json:"platform" example:"wa"`
	Sender   string `json:"sender" example:"237123456789"`
}

// ListPlatformsResponse represents the response for listing platforms
type ListPlatformsResponse []Platform

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
