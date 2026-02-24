package middleware

import "authy-api/internal/database"

type AuthMethod string

const (
	AuthMethodBasicAuth AuthMethod = "basicauth"
)

type AuthMiddleware struct {
	db database.Service
}

func NewAuth(db database.Service) *AuthMiddleware {
	return &AuthMiddleware{db: db}
}
