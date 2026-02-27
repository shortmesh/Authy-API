package database

import (
	"fmt"

	"authy-api/internal/database/models"
	"authy-api/migrations"
	"authy-api/pkg/logger"
	"authy-api/pkg/migrator"
)

func (s *service) CreateTables() error {
	logger.Info("Creating database tables")

	err := s.db.AutoMigrate(
		&models.User{}, &models.OTP{},
	)
	if err != nil {
		logger.Error(fmt.Sprintf("Table creation failed: %v", err))
		return err
	}

	logger.Info("Database tables created successfully")
	return nil
}

func (s *service) RunMigrations() error {
	logger.Info("Running database migrations")

	scripts := migrations.GetAllMigrations()
	manager := migrator.NewManager(s.db, scripts)

	if err := manager.Up(); err != nil {
		logger.Error(fmt.Sprintf("Migration execution failed: %v", err))
		return err
	}

	logger.Info("Database migrations completed successfully")
	return nil
}

func (s *service) AutoMigrate(createTables bool) error {
	if createTables {
		if err := s.CreateTables(); err != nil {
			return err
		}
	}

	return s.RunMigrations()
}
