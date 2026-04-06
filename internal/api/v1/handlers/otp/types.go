package otp

import (
	"authy-api/internal/database"
)

// GenerateOTPRequest represents the request body for generating an OTP
type GenerateOTPRequest struct {
	PhoneNumber string `json:"phone_number" example:"+237123456780" validate:"required"`
	Platform    string `json:"platform" example:"wa" validate:"required"`
}

// GenerateOTPResponse represents the response after generating an OTP
type GenerateOTPResponse struct {
	Message   string `json:"message" example:"OTP sent successfully"`
	ExpiresAt string `json:"expires_at" example:"2026-02-19T20:30:00Z"`
}

// VerifyOTPRequest represents the request body for verifying an OTP
type VerifyOTPRequest struct {
	PhoneNumber string `json:"phone_number" example:"+237123456780" validate:"required"`
	Platform    string `json:"platform" example:"wa" validate:"required"`
	Code        string `json:"code" example:"123456" validate:"required"`
}

// VerifyOTPResponse represents the response after verifying an OTP
type VerifyOTPResponse struct {
	Message string `json:"message" example:"OTP verified successfully"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error" example:"message"`
}

type OTPHandler struct {
	db database.Service
}

func NewOTPHandler(db database.Service) *OTPHandler {
	return &OTPHandler{db: db}
}
