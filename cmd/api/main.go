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
	"authy-api/pkg/logger"

	"github.com/joho/godotenv"
)

//	@title			Shortmesh - Authy API
//	@version		1.0
//	@description	API for ShortMesh Authy service

//	@securityDefinitions.basic	BasicAuth
//	@in							header
//	@name						Authorization

func gracefulShutdown(apiServer *http.Server, done chan bool) {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	<-ctx.Done()

	logger.Info("Shutting down gracefully, press Ctrl+C again to force")
	stop()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := apiServer.Shutdown(ctx); err != nil {
		logger.Error(fmt.Sprintf("Server shutdown error: %v", err))
	}

	logger.Info("Server exiting")

	done <- true
}

func main() {
	godotenv.Load(".env.default", ".env")
	srv := server.NewServer()

	logger.Info(fmt.Sprintf("Starting server on %s", srv.Addr))

	done := make(chan bool, 1)

	go gracefulShutdown(srv, done)

	err := srv.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		logger.Error(fmt.Sprintf("Server startup failed: %v", err))
		os.Exit(1)
	}

	<-done
	logger.Info("Graceful shutdown complete")
}
