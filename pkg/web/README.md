# authy-web

[Authy by ShortMesh](https://github.com/shortmesh/Authy-API) — Authy is an open-source OTP service that generates, delivers, and verifies one-time passwords over the messaging platforms your users already trust using the Shortmesh API

Built with **React 19 + Vite 8**.

---

## What this site does

- **Live demo** — lets any visitor enter their phone number, pick a messaging platform, receive a real OTP, and verify it against the ShortMesh hosted Authy API.

---

## How the demo was implemented

### Widget script loading (`useWidgetScript`)

The ShortMesh widget (`widget.js`) is a plain JS drop-in served from Authy. Instead of a static `<script>` tag in `index.html`, Load it dynamically at runtime so the latest version is always fetched:

```js
const s = document.createElement("script");
s.src = import.meta.env.DEV
  ? "/widget.js"           // Vite proxy → beta.shortmesh.com in dev
  : "https://beta.shortmesh.com/widget.js";
document.body.appendChild(s);
```

### Phone input (`react-international-phone`)

`react-international-phone` provides the country-flag selector and E.164 phone number formatting. The component enforces a valid `+<country><number>` pattern before the OTP flow can proceed.

### Platform picker (`ShortMeshWidget`)

When the user submits their phone number, we first fetch the `/platforms` endpoint to get a list of registered sender devices and cache them in a `ref`:

```js
const res = await fetch(`${API_BASE}/platforms`);
platformsRef.current = await res.json(); // [{ platform: "wa", device_id: "..." }, ...]
```

Open the widget modal:

```js
window.ShortMeshWidget.open({
  endpoints: { platforms: `${API_BASE}/platforms` },
  onSelect: (chosenPlatform) => {
    const match = platformsRef.current.find(p => p.platform === chosenPlatform);
    sendOTP(chosenPlatform, match?.device_id);
  },
});
```

The widget renders the platform picker UI; on selection the `onSelect` callback fires and we immediately call the generate endpoint.

### OTP flow (generate → verify)

The demo card cycles through four stages managed with a single `stage` state variable:

| Stage | What is shown |
|---|---|
| `idle` | Phone input form |
| `sending` | Loading state while `POST /otp/generate` is in flight |
| `verify` | 6-box OTP input |
| `success` | Confirmation message |

**Generate:**

```
POST {API_BASE}/otp/generate
{ device_id, phone_number, platform }
```

**Verify:**

```
POST {API_BASE}/otp/verify
{ code, device_id, phone_number, platform }
```

`API_BASE` is injected at build time via the `VITE_API_BASE_URL` environment variable.

### OTP input (`OTPInputs`)

A custom 6-box OTP input that:

- Auto-advances focus to the next box on digit entry
- Steps back on `Backspace`
- Handles paste of a full 6-digit code
- Uses `autocomplete="one-time-code"` on the first box for mobile autofill

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | (Optional) Base URL of your Authy API instance. Defaults to `/api/v1` (same server) |
| `VITE_PROXY_TARGET` | (Optional) Proxy target for dev server. Defaults to `http://localhost:8080` |

When served via the Go API at `/demo`, the UI automatically uses relative URLs to call the same server. For standalone development:

Create a `.env.local` file:

```
# API base URL (optional, defaults to /api/v1)
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Proxy target for dev server (optional, defaults to http://localhost:8080)
VITE_PROXY_TARGET=http://localhost:8080
```

If your Go server runs on a different host/port, update `VITE_PROXY_TARGET`:

```
# Example: Running Go server on port 3000
VITE_PROXY_TARGET=http://localhost:3000
```

---

## Running locally

```bash
# Install dependencies
yarn install

# Start the dev server (proxy to beta.shortmesh.com is active automatically)
yarn dev

# Production build
yarn build
```

---

## Related repositories

| Repo | Description | Language |
|---|---|---|
| [Authy-API](https://github.com/shortmesh/Authy-API) | OTP generation, delivery & verification service | Go |
| [Interface-API](https://github.com/shortmesh/Interface-API) | Primary interface service built on Matrix | Go |
| [Widgets](https://github.com/shortmesh/Widgets) | Drop-in platform-picker widget for web | JS |
| [Widget-android](https://github.com/shortmesh/Widget-android) | Native Android SDK for platform selection | Android |
