package versions

import (
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
	return db.Exec(`
		CREATE TABLE IF NOT EXISTS otps (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			code_hash BLOB NOT NULL,
			phone_number TEXT NOT NULL,
			platform TEXT NOT NULL,
			device_id TEXT NOT NULL,
			expires_at DATETIME NOT NULL,
			attempt_count INTEGER DEFAULT 0 NOT NULL,
			created_at DATETIME NOT NULL,
			UNIQUE(phone_number, platform, device_id)
		);
		CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at);
	`).Error
}

func (m Migration20260224_000002) Down(db *gorm.DB) error {
	return db.Exec("DROP TABLE IF EXISTS otps").Error
}
