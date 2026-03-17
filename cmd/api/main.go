package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"authy-api/internal/server"
	"authy-api/pkg/cleanup"
	"authy-api/pkg/logger"

	"github.com/joho/godotenv"
)

//	@title			Authy API
//	@version		1.0
//	@description	API for Authy service

func gracefulShutdown(apiServer *http.Server, cw *cleanup.CleanupWorker, done chan bool) {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	<-ctx.Done()

	logger.Info("Shutting down gracefully, press Ctrl+C again to force")
	stop()

	if cw != nil {
		cw.Stop()
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := apiServer.Shutdown(ctx); err != nil {
		logger.Error(fmt.Sprintf("Server shutdown error: %v", err))
	}

	logger.Info("Server exiting")

	done <- true
}

func main() {
	if os.Getenv("APP_MODE") != "production" {
		godotenv.Load("default.env", ".env")
	}

	var cw *cleanup.CleanupWorker
	if cleanup.IsEnabled() {
		cw = cleanup.New()
		cw.Start()
	} else {
		logger.Info("Cleanup worker disabled via CLEANUP_ENABLED=false")
	}

	srv := server.NewServer()

	logger.Info(fmt.Sprintf("Starting server on %s", srv.Addr))

	done := make(chan bool, 1)

	go gracefulShutdown(srv, cw, done)

	err := srv.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		logger.Error(fmt.Sprintf("Server startup failed: %v", err))
		os.Exit(1)
	}

	<-done
	logger.Info("Graceful shutdown complete")
}
