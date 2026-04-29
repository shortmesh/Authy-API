import { useEffect, useState } from "react";
import { Box, Chip, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { REPOS } from "../data/repos";

function OTPPreview({ mono }) {
  const digits = ["3", "7", "2", "9", "1", "4"];
  const CYCLE = "5.5s";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: 3,
      }}
    >
      {/* "via Signal" badge */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.5,
          py: 0.5,
          borderRadius: 99,
          bgcolor: alpha(mono, 0.06),
          border: `1px solid ${alpha(mono, 0.16)}`,
          "@keyframes otpBadge": {
            "0%, 4%": { opacity: 0, transform: "translateY(-5px)" },
            "14%, 78%": { opacity: 1, transform: "translateY(0)" },
            "90%, 100%": { opacity: 0, transform: "translateY(-5px)" },
          },
          animation: `otpBadge ${CYCLE} ease infinite`,
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "text.primary",
            "@keyframes liveDot": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.2 },
            },
            animation: "liveDot 1.4s ease infinite",
          }}
        />
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "text.primary",
            letterSpacing: 0.5,
          }}
        >
          via Signal
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 0.75 }}>
        {digits.map((d, i) => (
          <Box
            key={i}
            sx={{
              width: 32,
              height: 40,
              borderRadius: "7px",
              border: `1.5px solid ${alpha(mono, 0.2)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: 700,
              fontFamily: "monospace",
              color: "text.primary",
              bgcolor: alpha(mono, 0.04),
              "@keyframes digitUp": {
                "0%": { opacity: 0, transform: "translateY(8px) scale(0.82)" },
                "12%": { opacity: 1, transform: "translateY(0) scale(1)" },
                "74%": { opacity: 1, transform: "translateY(0) scale(1)" },
                "84%": {
                  opacity: 0,
                  transform: "translateY(-6px) scale(0.88)",
                },
                "100%": {
                  opacity: 0,
                  transform: "translateY(-6px) scale(0.88)",
                },
              },
              animation: `digitUp ${CYCLE} cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1 + 0.3}s infinite`,
            }}
          >
            {d}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.5,
          py: 0.4,
          borderRadius: 99,
          bgcolor: alpha(mono, 0.06),
          border: `1px solid ${alpha(mono, 0.16)}`,
          "@keyframes verifiedPop": {
            "0%, 62%": { opacity: 0, transform: "scale(0.8)" },
            "72%": { opacity: 1, transform: "scale(1.06)" },
            "80%, 88%": { opacity: 1, transform: "scale(1)" },
            "97%, 100%": { opacity: 0, transform: "scale(0.9)" },
          },
          animation: `verifiedPop ${CYCLE} ease infinite`,
        }}
      >
        <Typography sx={{ fontSize: 14, color: "text.primary", lineHeight: 1 }}>
          ✓
        </Typography>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: "text.primary",
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          Verified
        </Typography>
      </Box>
    </Box>
  );
}

const ROUTE_PLATFORMS = ["Signal", "WhatsApp", "Telegram"];

function RouterPreview({ mono }) {
  return (
    <Box
      sx={{
        py: 3,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {/* Core API node */}
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: "12px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${alpha(mono, 0.2)}`,
          bgcolor: alpha(mono, 0.05),
          "@keyframes coreGlow": {
            "0%, 100%": { boxShadow: `0 0 0 0 ${alpha(mono, 0)}` },
            "50%": { boxShadow: `0 0 0 8px ${alpha(mono, 0.08)}` },
          },
          animation: "coreGlow 2.6s ease infinite",
        }}
      >
        <Typography sx={{ fontSize: 20 }}>⚡</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
        {ROUTE_PLATFORMS.map((p, i) => (
          <Box
            key={p}
            sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
          >
            <Box
              sx={{
                position: "relative",
                width: 40,
                height: 2,
                borderRadius: 1,
                bgcolor: alpha(mono, 0.08),
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent 0%, ${mono} 50%, transparent 100%)`,
                  backgroundSize: "200% 100%",
                  "@keyframes signalFlow": {
                    "0%": { backgroundPosition: "-100% 0%" },
                    "100%": { backgroundPosition: "200% 0%" },
                  },
                  animation: `signalFlow 1.6s linear ${i * 0.55}s infinite`,
                }}
              />
            </Box>

            <Box
              sx={{
                px: 1,
                py: 0.35,
                borderRadius: "5px",
                border: `1px solid ${alpha(mono, 0.18)}`,
                bgcolor: alpha(mono, 0.04),
                "@keyframes platformPing": {
                  "0%": { opacity: 0.3 },
                  "50%": { opacity: 0.9 },
                  "100%": { opacity: 0.3 },
                },
                animation: `platformPing 2.6s ease ${i * 0.85}s infinite`,
              }}
            >
              <Typography
                sx={{ fontSize: 11, fontWeight: 600, color: "text.primary" }}
              >
                {p}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

const PICKER_PLATFORMS = ["Signal", "WhatsApp", "Telegram"];

function WidgetPreview({ mono }) {
  const theme = useTheme();
  const [sel, setSel] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setSel((s) => (s + 1) % PICKER_PLATFORMS.length),
      1800,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{ py: 2.5, px: 2, display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 200,
          borderRadius: "12px",
          border: `1px solid ${alpha(mono, 0.15)}`,
          bgcolor: alpha(mono, 0.03),
          overflow: "hidden",
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 8px 32px rgba(0,0,0,0.45)`
              : `0 8px 32px rgba(0,0,0,0.07)`,
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderBottom: `1px solid ${alpha(mono, 0.1)}`,
            bgcolor: alpha(mono, 0.04),
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Select Platform
          </Typography>
        </Box>

        {PICKER_PLATFORMS.map((p, i) => (
          <Box
            key={p}
            sx={{
              px: 1.5,
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: sel === i ? alpha(mono, 0.07) : "transparent",
              borderLeft: `2.5px solid ${sel === i ? mono : "transparent"}`,
              transition: "all 0.35s ease",
              borderBottom:
                i < PICKER_PLATFORMS.length - 1
                  ? `1px solid ${alpha(mono, 0.08)}`
                  : "none",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: sel === i ? 600 : 400,
                color: sel === i ? "text.primary" : "text.secondary",
                transition: "all 0.35s",
              }}
            >
              {p}
            </Typography>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: `1.5px solid ${sel === i ? mono : alpha(mono, 0.2)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: sel === i ? mono : "transparent",
                transition: "all 0.35s",
              }}
            >
              {sel === i && (
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    bgcolor: theme.palette.mode === "dark" ? "#000" : "#fff",
                  }}
                />
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

const PREVIEWS = {
  otp: OTPPreview,
  router: RouterPreview,
  widget: WidgetPreview,
};

function HorizFadeLine() {
  const theme = useTheme();
  const mid =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.09)";
  return (
    <Box
      aria-hidden
      sx={{
        height: "1px",
        background: `linear-gradient(90deg, transparent 0%, ${mid} 20%, ${mid} 80%, transparent 100%)`,
      }}
    />
  );
}

function VertFadeLine() {
  const theme = useTheme();
  const mid =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.09)";
  return (
    <Box
      aria-hidden
      sx={{
        width: "1px",
        alignSelf: "stretch",
        flexShrink: 0,
        background: `linear-gradient(180deg, transparent 0%, ${mid} 20%, ${mid} 80%, transparent 100%)`,
      }}
    />
  );
}

function RepoCell({ repo }) {
  const theme = useTheme();
  const [hov, setHov] = useState(false);
  const Preview = PREVIEWS[repo.preview];
  const mono = theme.palette.mode === "dark" ? "#ffffff" : "#000000";

  return (
    <Box
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      sx={{
        flex: 1,
        py: { xs: 5, md: 7 },
        px: { xs: 1, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
        transition: "opacity 0.25s",
        opacity: hov ? 1 : 0.55,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Preview mono={mono} />
      </Box>

      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: 17, md: 19 },
              color: "text.primary",
              letterSpacing: "-0.4px",
            }}
          >
            {repo.name}
          </Typography>
          {repo.lang && (
            <Chip
              label={repo.lang}
              size="small"
              sx={{
                fontSize: 10,
                fontWeight: 700,
                height: 20,
                bgcolor: alpha(mono, 0.07),
                color: "text.secondary",
                border: `1px solid ${alpha(mono, 0.14)}`,
              }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.75,
            mb: 2.5,
          }}
        >
          {repo.detail}
        </Typography>

        {repo.href && (
          <Box
            component="a"
            href={repo.href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 12,
              fontWeight: 600,
              color: "text.secondary",
              textDecoration: "none",
              opacity: hov ? 0.9 : 0.35,
              transition: "opacity 0.25s",
            }}
          >
            View on GitHub ↗
          </Box>
        )}

        {repo.links && (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {repo.links.map((l) => (
              <Box
                key={l.label}
                component="a"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "text.secondary",
                  textDecoration: "none",
                  opacity: hov ? 0.9 : 0.35,
                  transition: "opacity 0.25s",
                }}
              >
                {l.label} ↗
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function Repos() {
  const theme = useTheme();

  const rows = [];
  for (let i = 0; i < REPOS.length; i += 2) {
    rows.push(REPOS.slice(i, i + 2));
  }

  return (
    <Box
      component="section"
      id="repos"
      sx={{
        py: { xs: 8, md: 20 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${theme.palette.divider} 20%, ${theme.palette.divider} 80%, transparent 100%)`,
        },
      }}
    >
      <Box sx={{ mb: { xs: 6, md: 10 }, maxWidth: 520 }}>
        <Typography
          sx={{
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: 12,
            fontWeight: 700,
            color: "text.secondary",
            mb: 1.5,
          }}
        >
          Open Source
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 28, md: 40 },
            fontWeight: 600,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          Open source auth tool.
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 15, md: 17 },
            color: "text.secondary",
            lineHeight: 1.75,
          }}
        >
          Every component is open source and self-hostable
        </Typography>
      </Box>

      <Box>
        {rows.map((row, ri) => (
          <Box key={ri}>
            {ri > 0 && <HorizFadeLine />}
            <Box
              sx={{
                display: "flex",
                alignItems: "stretch",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              {row.length === 1 ? (
                <>
                  <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }} />
                  <RepoCell repo={row[0]} />
                  <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }} />
                </>
              ) : (
                row.map((repo, ci) => (
                  <Box key={repo.name} sx={{ display: "contents" }}>
                    {ci > 0 && (
                      <>
                        <Box sx={{ display: { xs: "block", md: "none" } }}>
                          <HorizFadeLine />
                        </Box>
                        <Box
                          sx={{
                            display: { xs: "none", md: "flex" },
                            alignSelf: "stretch",
                          }}
                        >
                          <VertFadeLine />
                        </Box>
                      </>
                    )}
                    <RepoCell repo={repo} />
                  </Box>
                ))
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
