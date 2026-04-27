# API Usage Guide

## Prerequisites

```bash
make setup && make migrate-up && make run
```

Server: `http://localhost:8080`

> [!NOTE]
> Requires Interface API instance and Matrix token (`mt_xxxxx`). See [Interface API docs](https://github.com/shortmesh/Interface-API) for setup.

## Configuration

Configure Interface API in `.env`:

```bash
INTERFACE_API_URL=http://localhost:8080
INTERFACE_API_TOKEN=mt_xxxxx
```

See [SECURITY.md](./SECURITY.md) for production configuration.

## Authentication

The API supports optional Bearer token authentication using Matrix tokens. When a valid Matrix token is provided:

- The token is used to authenticate with the Interface API
- The `sender` field can be specified to control which device sends the OTP

Without authentication:

- The default Interface API token from environment variables is used
- The first available device for the platform is used as sender

## API Endpoints

### Generate OTP

**Basic Usage (No Authentication):**

```bash
curl -X POST http://localhost:8080/api/v1/otp/generate \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+237123456780",
    "platform": "wa"
  }'
```

**With Matrix Token Authentication:**

```bash
curl -X POST http://localhost:8080/api/v1/otp/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mt_xxxxx" \
  -d '{
    "phone_number": "+237123456780",
    "platform": "wa",
    "sender": "+237123456789"
  }'
```

**Request Fields:**

- `phone_number` (required): International phone number (E.164 format)
- `platform` (required): Platform identifier (e.g., "wa" for WhatsApp)
- `sender` (optional): Specific device/number to send from (only used when authenticated)

**Response:**

```json
{
  "message": "OTP sent successfully",
  "expires_at": "2026-03-17T11:35:00Z"
}
```

### Verify OTP

```bash
curl -X POST http://localhost:8080/api/v1/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+237123456780",
    "platform": "wa",
    "code": "123456"
  }'
```

**Response:**

```json
{
  "message": "OTP verified successfully"
}
```

### List Platforms

**Basic Usage (No Authentication):**

```bash
curl -X GET http://localhost:8080/api/v1/platforms
```

**With Matrix Token Authentication:**

```bash
curl -X GET http://localhost:8080/api/v1/platforms \
  -H "Authorization: Bearer mt_xxxxx"
```

**Response:**

```json
[
  {
    "platform": "wa",
    "device_id": "+237123456789"
  }
]
```

## Error Responses

**400 - Bad Request:**

```json
{
  "error": "Missing required field: phone_number"
}
```

**401 - Unauthorized:**

```json
{
  "error": "Invalid or expired OTP"
}
```

**401 - Unauthorized (Invalid Token):**

```json
{
  "error": "invalid authorization header format"
}
```

**403 - Forbidden:**

```json
{
  "error": "invalid or expired token"
}
```

**429 - Too Many Requests:**

```json
{
  "error": "Too many attempts, please request a new code"
}
```

## API Reference

Swagger UI: **<http://localhost:8080/docs/index.html>**
