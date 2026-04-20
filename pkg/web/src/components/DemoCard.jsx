import { useState, useEffect, useRef } from "react";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { PlainButton } from "./buttons";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

function useWidgetScript() {
  useEffect(() => {
    const existing = document.getElementById("shortmesh-widget-script");
    if (existing) existing.remove();
    const s = document.createElement("script");
    s.id = "shortmesh-widget-script";
    s.src = `${import.meta.env.BASE_URL}widget.js?v=${Date.now()}`;
    document.body.appendChild(s);
  }, []);
}

function OTPInputs({ value, onChange, disabled }) {
  const inputs = useRef([]);
  const theme = useTheme();

  function handleChange(i, e) {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const chars = value.padEnd(6, " ").split("");
    chars[i] = digit || " ";
    const next = chars.join("").trimEnd();
    onChange(next.slice(0, 6));
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace") {
      if (value[i]) {
        const chars = value.padEnd(6, " ").split("");
        chars[i] = " ";
        onChange(chars.join("").trimEnd());
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
      }
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  }

  return (
    <Stack direction="row" spacing={1} mb={2}>
      {Array.from({ length: 6 }, (_, i) => (
        <Box
          key={i}
          component="input"
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] && value[i] !== " " ? value[i] : ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          sx={{
            flex: 1,
            width: 0,
            minWidth: 0,
            height: 44,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            bgcolor: "background.paper",
            color: "text.primary",
            fontFamily: "monospace",
            fontSize: 18,
            fontWeight: 600,
            textAlign: "center",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            "&:focus": {
              borderColor: "primary.main",
              boxShadow: `0 0 0 3px ${theme.palette.primary.main}1a`,
              // bgcolor: "background.paper",
            },
            "&:disabled": { opacity: 0.5 },
          }}
        />
      ))}
    </Stack>
  );
}

export function DemoCard() {
  useWidgetScript();

  const [stage, setStage] = useState("idle");
  const [phone, setPhone] = useState("");
  const [platform, setPlatform] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setStage("idle");
    setPhone("");
    setPlatform("");
    setOtp("");
    setError("");
    setLoading(false);
  }

  async function sendOTP(chosenPlatform) {
    setLoading(true);
    setStage("sending");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/otp/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          platform: chosenPlatform,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const raw =
          data?.message ||
          data?.error ||
          data?.detail ||
          (typeof data === "string" ? data : null) ||
          `HTTP ${res.status}`;
        throw new Error(`Server response: ${raw}`);
      }
      setStage("verify");
    } catch (err) {
      setError(err.message);
      setStage("idle");
    } finally {
      setLoading(false);
    }
  }

  const platforms_url = `${API_BASE}/platforms`;

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Please select a country and enter your full phone number.");
      return;
    }
    setError("");
    if (!window.ShortMeshWidget) {
      setError("Widget not loaded yet, please try again in a moment.");
      return;
    }
    window.ShortMeshWidget.open({
      endpoints: { platforms: platforms_url },
      onSelect: (chosenPlatform) => {
        setPlatform(chosenPlatform);
        sendOTP(chosenPlatform);
      },
      onError: () => setError("Could not load platforms. Please try again."),
    });
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (otp.replace(/\s/g, "").length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: otp.replace(/\s/g, ""),
          phone_number: phone,
          platform,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const raw =
          data?.message ||
          data?.error ||
          data?.detail ||
          (typeof data === "string" ? data : null) ||
          `HTTP ${res.status}`;
        throw new Error(`Server response: ${raw}`);
      }
      setStage("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const platformLabel =
    platform === "wa"
      ? "WhatsApp"
      : platform
        ? platform.charAt(0).toUpperCase() + platform.slice(1)
        : "";

  return (
    <Paper
      elevation={4}
      variant="outlined"
      sx={{
        borderRadius: 2,
        p: { xs: "20px 16px", sm: "32px" },
        boxShadow: 3,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#020306" : "#F2F2F2",
      }}
    >
      {(stage === "idle" || stage === "sending") && (
        <Box component="form" onSubmit={handlePhoneSubmit}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Try Demo
          </Typography>
          <Typography variant="body1" sx={{ my: 2, color: "text.secondary" }}>
            Get hands-on experience with Authy. This is just a demo and the code
            sent does not have any use beyond this demo.
          </Typography>
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "stretch",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              mb: 1.25,
              transition: "border-color 0.15s, box-shadow 0.15s",
              "&:focus-within": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
              },
              "& .PhoneInput": {
                display: "flex",
                alignItems: "center",
                width: "100%",
              },
              "& .PhoneInputCountry": {
                display: "flex",
                alignItems: "center",
                px: 1.5,
                borderRight: `1px solid ${theme.palette.divider}`,
                gap: "6px",
                cursor: "pointer",
              },
              "& .PhoneInputInput": {
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                color: theme.palette.text.primary,
                fontSize: 16,
                padding: "11px 14px",
                fontFamily: "inherit",
                minWidth: 0,
              },
              "& .PhoneInputInput::placeholder": {
                color: theme.palette.text.disabled,
              },
              "& .PhoneInputInput:disabled": { opacity: 0.5 },
              "& .PhoneInputCountrySelectArrow": {
                color: theme.palette.text.secondary,
              },
            })}
          >
            <PhoneInput
              international
              withCountryCallingCode
              name="phone number"
              defaultCountry="CM"
              value={phone}
              onChange={(value) => {
                setPhone(value ?? "");
                setError("");
              }}
              disabled={loading}
              autoComplete="tel"
            />
          </Box>
          {error && (
            <Typography color="error" fontSize={13} mb={1.25}>
              {error}
            </Typography>
          )}
          <PlainButton
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ mt: 1.25, textTransform: "none" }}
          >
            {loading ? "Sending…" : "Continue"}
          </PlainButton>
        </Box>
      )}

      {stage === "verify" && (
        <Box component="form" onSubmit={handleVerify}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Enter your code
          </Typography>
          <Typography
            fontSize={15}
            lineHeight={1.6}
            mb={2.5}
            sx={{ color: "text.secondary", mb: 2.5 }}
          >
            A 6-digit code was sent to <strong>{phone}</strong>
            {platformLabel && (
              <>
                {" "}
                via <strong>{platformLabel}</strong>
              </>
            )}
            .
          </Typography>
          <OTPInputs value={otp} onChange={setOtp} disabled={loading} />
          {error && (
            <Typography fontSize={13} sx={{ mb: 1.25, color: "error.main" }}>
              {error}
            </Typography>
          )}
          <PlainButton
            type="submit"
            fullWidth
            disabled={loading || otp.replace(/\s/g, "").length !== 6}
            sx={{ textTransform: "none", py: 1.2, mt: 2.5 }}
          >
            {loading ? "Verifying…" : "Verify"}
          </PlainButton>
          <PlainButton
            size="small"
            onClick={reset}
            sx={{ mt: 1, textTransform: "none" }}
          >
            ← Start over
          </PlainButton>
        </Box>
      )}

      {stage === "success" && (
        <Box textAlign="center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2.5,
            }}
          >
            <CheckIcon />
          </Box>
          <Typography variant="h6" fontWeight={600} sx={{mb: 1.5, textAlign: "center"}}>
            Phone verified!
          </Typography>
          <Typography fontSize={15} color="text.secondary" sx={{mb: 3, textAlign: "center"}}>
            <strong>{phone}</strong> has been successfully verified via Authy.
          </Typography>
          <PlainButton fullWidth onClick={reset} sx={{ textTransform: "none" }}>
            Try again
          </PlainButton>
        </Box>
      )}
    </Paper>
  );
}
