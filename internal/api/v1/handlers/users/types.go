package users

import "authy-api/internal/database"

// CreateUserRequest represents the request body for creating a user
type CreateUserRequest struct {
	Email    string `json:"email" example:"user@example.com" validate:"required,email"`
	Password string `json:"password" example:"Validpassword123@!" validate:"required,min=8,max=64"`
}

// LoginRequest represents the request body for user login
type LoginRequest struct {
	Email    string `json:"email" example:"user@example.com" validate:"required,email"`
	Password string `json:"password" example:"Validpassword123@!" validate:"required"`
}

// UserResponse represents the response after user operations
type UserResponse struct {
	Message      string `json:"message,omitempty" example:"User created successfully"`
	ClientID     string `json:"client_id" example:"1234567890abcdef"`
	ClientSecret string `json:"client_secret" example:"abcdef12345678901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error" example:"message"`
}

type UserHandler struct {
	db database.Service
}

func NewUserHandler(db database.Service) *UserHandler {
	return &UserHandler{db: db}
}
