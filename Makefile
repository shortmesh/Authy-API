all: build test

setup:
	@echo "Setting up development environment..."
	@if [ ! -f .env ]; then \
		echo "Creating .env from example.env..."; \
		cp example.env .env; \
	fi
	@if ! grep -q "^HASH_KEY=[A-Za-z0-9+/=]\{40,\}" .env 2>/dev/null; then \
		echo "Generating HASH_KEY..."; \
		HASH_KEY=$$(openssl rand -base64 32); \
		sed -i.bak "s|^HASH_KEY=.*|HASH_KEY=$$HASH_KEY|" .env && rm -f .env.bak; \
	else \
		echo "HASH_KEY already set"; \
	fi
	@if ! grep -q "^DB_ENCRYPTION_KEY=[A-Fa-f0-9]\{64,\}" .env 2>/dev/null; then \
		echo "Generating DB_ENCRYPTION_KEY..."; \
		DB_ENCRYPTION_KEY=$$(openssl rand -hex 32); \
		sed -i.bak "s|^DB_ENCRYPTION_KEY=.*|DB_ENCRYPTION_KEY=$$DB_ENCRYPTION_KEY|" .env && rm -f .env.bak; \
	else \
		echo "DB_ENCRYPTION_KEY already set"; \
	fi
	@echo "Setup complete! Run 'make migrate-up && make run' to start."

build: docs
	@echo "Building binaries..."
	@if [ "$$(grep -E '^DISABLE_DB_ENCRYPTION=(false|False|FALSE)' .env 2>/dev/null)" ]; then \
		echo "  - With SQLCipher encryption"; \
		CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -tags sqlcipher -o bin/api cmd/api/main.go; \
		CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -tags sqlcipher -o bin/migrate cmd/migrate/main.go; \
	else \
		echo "  - With standard SQLite (unencrypted)"; \
		CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o bin/api cmd/api/main.go; \
		CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o bin/migrate cmd/migrate/main.go; \
	fi

run:
	@if [ "$$(grep -E '^DISABLE_DB_ENCRYPTION=(false|False|FALSE)' .env 2>/dev/null)" ]; then \
		go run -tags sqlcipher cmd/api/main.go; \
	else \
		go run cmd/api/main.go; \
	fi

test:
	@echo "Testing..."
	@go test ./... -v

itest:
	@echo "Running integration tests..."

migrate-up:
	@echo "Running migrations..."
	@if [ "$$(grep -E '^DISABLE_DB_ENCRYPTION=(false|False|FALSE)' .env 2>/dev/null)" ]; then \
		go run -tags sqlcipher cmd/migrate/main.go -action=up; \
	else \
		go run cmd/migrate/main.go -action=up; \
	fi

migrate-down:
	@echo "Rolling back last migration..."
	@if [ "$$(grep -E '^DISABLE_DB_ENCRYPTION=(false|False|FALSE)' .env 2>/dev/null)" ]; then \
		go run -tags sqlcipher cmd/migrate/main.go -action=down -steps=1; \
	else \
		go run cmd/migrate/main.go -action=down -steps=1; \
	fi

migrate-status:
	@echo "Checking migration status..."
	@if [ "$$(grep -E '^DISABLE_DB_ENCRYPTION=(false|False|FALSE)' .env 2>/dev/null)" ]; then \
		go run -tags sqlcipher cmd/migrate/main.go -action=status; \
	else \
		go run cmd/migrate/main.go -action=status; \
	fi

docs:
	@echo "Generating Swagger documentation..."
	@which swag > /dev/null || test -f $(HOME)/go/bin/swag || (echo "Error: swag is not installed." && echo "Install it with: go install github.com/swaggo/swag/cmd/swag@latest" && exit 1)
	@if which swag > /dev/null 2>&1; then \
		swag fmt; \
		swag init -g cmd/api/main.go -o docs; \
	else \
		$(HOME)/go/bin/swag fmt; \
		$(HOME)/go/bin/swag init -g cmd/api/main.go -o docs; \
	fi

clean:
	@echo "Cleaning..."
	@rm -rf bin

setup-systemd:
	@echo "Setting up systemd service..."
	@if [ "$$(id -u)" -ne 0 ]; then \
		echo "Error: This target must be run as root (use sudo make setup-systemd)"; \
		exit 1; \
	fi
	@if ! id authy-api >/dev/null 2>&1; then \
		echo "Creating authy-api user..."; \
		useradd --system --no-create-home --shell /usr/sbin/nologin authy-api; \
	else \
		echo "User authy-api already exists"; \
	fi
	@echo "Creating application directory..."
	@mkdir -p /opt/authy-api
	@if [ ! -f /opt/authy-api/.env ]; then \
		echo "Creating .env file from example.env..."; \
		cp example.env /opt/authy-api/.env; \
		echo "Setting production values..."; \
		sed -i "s|^APP_MODE=.*|APP_MODE=production|" /opt/authy-api/.env; \
		sed -i "s|^ALLOW_INSECURE_SERVER=.*|ALLOW_INSECURE_SERVER=true|" /opt/authy-api/.env; \
		sed -i "s|^ALLOW_INSECURE_EXTERNAL=.*|ALLOW_INSECURE_EXTERNAL=true|" /opt/authy-api/.env; \
		sed -i "s|^SQLITE_DB_PATH=.*|SQLITE_DB_PATH=/opt/authy-api/data/authy.db|" /opt/authy-api/.env; \
		sed -i "s|^DISABLE_DB_ENCRYPTION=.*|DISABLE_DB_ENCRYPTION=false|" /opt/authy-api/.env; \
		sed -i "s|^AUTO_MIGRATE=.*|AUTO_MIGRATE=false|" /opt/authy-api/.env; \
		echo "Generating HASH_KEY..."; \
		HASH_KEY=$$(openssl rand -base64 32); \
		sed -i "s|^HASH_KEY=.*|HASH_KEY=$$HASH_KEY|" /opt/authy-api/.env; \
		echo "Generating DB_ENCRYPTION_KEY..."; \
		DB_ENCRYPTION_KEY=$$(openssl rand -hex 32); \
		sed -i "s|^DB_ENCRYPTION_KEY=.*|DB_ENCRYPTION_KEY=$$DB_ENCRYPTION_KEY|" /opt/authy-api/.env; \
		echo "WARNING: Review and update /opt/authy-api/.env with appropriate service URLs and credentials"; \
	else \
		echo ".env file already exists at /opt/authy-api/.env"; \
	fi
	@echo "Copying default.env..."
	@cp default.env /opt/authy-api/default.env
	@echo "Creating data directory..."
	@mkdir -p /opt/authy-api/data
	@echo "Creating cache directories..."
	@mkdir -p /opt/authy-api/.cache/go-build /opt/authy-api/.cache/go-mod
	@echo "Setting permissions..."
	@chown -R authy-api:authy-api /opt/authy-api
	@chmod 600 /opt/authy-api/.env
	@if [ -f authy-api.service ]; then \
		echo "Installing systemd service file..."; \
		cp authy-api.service /etc/systemd/system/; \
		systemctl daemon-reload; \
		echo "Enabling service..."; \
		systemctl enable authy-api; \
		echo "Setup complete! Use 'systemctl start authy-api' to start the service."; \
	else \
		echo "WARNING: authy-api.service file not found. Skipping systemd service installation."; \
		echo "Setup complete! Manually configure systemd service if needed."; \
	fi

.PHONY: all setup build run test clean itest migrate-up migrate-down migrate-status docs setup-systemd
