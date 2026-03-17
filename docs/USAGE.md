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

## API Endpoints

### Generate OTP

```bash
curl -X POST http://localhost:8080/api/v1/otp/generate \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+237123456780",
    "platform": "wa",
    "device_id": "+237123456789"
  }'
```

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
    "device_id": "+237123456789",
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

```bash
curl -X GET http://localhost:8080/api/v1/platforms
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

**429 - Too Many Requests:**

```json
{
  "error": "Too many attempts, please request a new code"
}
```

## API Reference

Swagger UI: **<http://localhost:8080/docs/index.html>**
