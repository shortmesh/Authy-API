package versions

import (
	"authy-api/internal/database/models"

	"gorm.io/gorm"
)

type Migration20260224_000002 struct{}

func (m Migration20260224_000002) Version() string {
	return "20260224_000002"
}

func (m Migration20260224_000002) Name() string {
	return "create_otps_table"
}

func (m Migration20260224_000002) Up(db *gorm.DB) error {
	return db.AutoMigrate(&models.OTP{})
}

func (m Migration20260224_000002) Down(db *gorm.DB) error {
	return db.Migrator().DropTable(&models.OTP{})
}
