package database

import (
	"authy-api/internal/database/models"
	"authy-api/migrations"
	"authy-api/pkg/logger"
	"authy-api/pkg/migrator"
)

func (s *service) CreateTables() error {
	logger.Log.Info("Creating database tables")

	err := s.db.AutoMigrate(
		&models.User{}, &models.OTP{},
	)
	if err != nil {
		logger.Log.Errorf("Table creation failed: %v", err)
		return err
	}

	logger.Log.Info("Database tables created successfully")
	return nil
}

func (s *service) RunMigrations() error {
	logger.Log.Info("Running database migrations")

	scripts := migrations.GetAllMigrations()
	manager := migrator.NewManager(s.db, scripts)

	if err := manager.Up(); err != nil {
		logger.Log.Errorf("Migration execution failed: %v", err)
		return err
	}

	logger.Log.Info("Database migrations completed successfully")
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
