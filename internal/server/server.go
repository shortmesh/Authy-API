package server

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"authy-api/internal/database"
	"authy-api/internal/database/models"
	"authy-api/pkg/logger"
)

type Server struct {
	port int
	host string
	db   database.Service
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	host := os.Getenv("HOST")
	if host == "" {
		host = "127.0.0.1"
	}

	NewServer := &Server{
		port: port,
		host: host,
		db:   database.New(),
	}

	cleanupInterval := 1 * time.Hour
	if intervalStr := os.Getenv("OTP_CLEANUP_INTERVAL"); intervalStr != "" {
		if interval, err := time.ParseDuration(intervalStr); err == nil && interval > 0 {
			cleanupInterval = interval
		}
	}

	go func() {
		ticker := time.NewTicker(cleanupInterval)
		defer ticker.Stop()

		logger.Info(fmt.Sprintf("Started OTP cleanup routine with interval: %s", cleanupInterval))
		for range ticker.C {
			if err := models.CleanupExpiredOTPs(NewServer.db.DB()); err != nil {
				logger.Error(fmt.Sprintf("Failed to cleanup expired OTPs: %v", err))
			} else {
				logger.Info("Expired OTPs cleaned up successfully")
			}
		}
	}()

	server := &http.Server{
		Addr:              fmt.Sprintf("%s:%d", NewServer.host, NewServer.port),
		Handler:           NewServer.RegisterRoutes(),
		IdleTimeout:       time.Minute,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      30 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
		MaxHeaderBytes:    1 << 20, // 1 MB
	}

	return server
}
