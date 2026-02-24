package migrations

import (
	"authy-api/migrations/versions"
	"authy-api/pkg/migrator"
)

func GetAllMigrations() []migrator.Script {
	return []migrator.Script{
		versions.Migration20260224_000001{},
	}
}
