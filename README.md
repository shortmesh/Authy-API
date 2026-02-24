# Authy API

API for generating, sending, and verifying OTP codes.

## Table of Contents

- [Quick Start](#quick-start)
- [Requirements](#requirements)
- [Configuration](#configuration)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Resources](#resources)

## Quick Start

```bash
git clone https://github.com/shortmesh/Authy-API.git
cd Authy-API
make setup
make migrate-up
make run
```

Server: `http://localhost:8080`

## Requirements

- Go 1.25.0+
- SQLite (default) or MySQL

## Configuration

> [!NOTE]
> `.env.default` contains operational default values. Only modify if you know what you're doing.

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
# Or use: make setup (auto-generates keys)
```

See `.env.example` for all available options.

> [!WARNING]
> **Production:** Set `AUTO_MIGRATE=false` and `AUTO_CREATE_TABLES=false`, then run `make migrate-up`.

## Development

### Commands

```bash
make setup            # Setup .env with auto-generated keys
make run              # Start server
make build            # Build binaries 
make test             # Run tests
make docs             # Generate Swagger docs
```

### Migrations

```bash
make migrate-up       # Run pending
make migrate-down     # Rollback last
make migrate-status   # Show status
make migrate-fresh    # Drop & recreate
```

See [Migration Guide](docs/MIGRATIONS.md) for details.

## API Documentation

Swagger UI: `http://localhost:8080/docs/index.html`

Regenerate: `make docs`

## Resources

- [Migration Guide](docs/MIGRATIONS.md)
