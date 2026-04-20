import { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { PrimaryButton, PlainButton } from "./buttons";
import WidgetImage from "../asset/widget.png";

const SETUP_STEPS = [
  {
    n: "01",
    title: "Host Your Authy Instance",
    body: "Clone the open-source Authy API, run setup and migrations, then start the server.",
  },
  {
    n: "02",
    title: "Link a Messaging Account",
    body: "Register a WhatsApp, Telegram, or Signal device as the sender account. Users will receive OTPs from this number.",
  },
  {
    n: "03",
    title: "Embed the Widget",
    body: "Drop one script tag into your page pointing to your own API domain.",
  },
  {
    n: "04",
    title: "Send & Verify OTPs",
    body: "Call two endpoints — generate sends the code, verify confirms it. Phone number ownership proved, job done.",
  },
];

// Hardcoded constant — safe to use dangerouslySetInnerHTML
const SETUP_SNIPPET = `# 1. Clone & start your Authy instance
git clone https://github.com/shortmesh/Authy-API
make setup && make migrate-up
make run

# 2. Link a messaging device (e.g. WhatsApp)
POST http://localhost:8000/api/v1/devices
{ "platform": "wa", "phone_number": "+1234567890" }

# 3. Drop the widget into your page (List platforms)
# widget.js is served directly from your Authy instance
<script src="http://localhost:8000/widget.js"></script>
ShortMeshWidget.open({
  endpoints: { platforms: "http://localhost:8000/api/platforms" },
  onSelect: (platform) => sendOTP(phone, platform),
})

# 4. Generate & verify the OTP
POST http://localhost:8000/api/v1/otp/generate   { phone_number, platform, device_id }
POST http://localhost:8000/api/v1/otp/verify     { phone_number, platform, code, device_id }`;

function highlightSetup(raw) {
  let s = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const comments = [];
  s = s.replace(/#[^\n]*/g, (m) => {
    comments.push(m);
    return "\x01";
  });
  s = s.replace(/"([^"]*)"/g, "\x02$1\x03");
  s = s.replace(
    /\b(POST|GET|PUT|DELETE|PATCH)\b/g,
    '<span class="hl-kw">$1</span>',
  );
  s = s.replace(/(\/api\/v1[^\s,}]*)/g, '<span class="hl-path">$1</span>');
  s = s.replace(/^(git|make)\b/gm, '<span class="hl-kw">$1</span>');
  s = s.replace(
    /\b(clone|setup|migrate-up|run)\b/g,
    '<span class="hl-fn">$1</span>',
  );
  s = s.replace(
    /\b(ShortMeshWidget|sendOTP)\b/g,
    '<span class="hl-fn">$1</span>',
  );
  s = s.replace(
    /\b(endpoints|platforms|onSelect|phone_number|platform|code|device_id)(?=:)/g,
    '<span class="hl-key">$1</span>',
  );
  s = s.replace(/&lt;(\/?script)/gi, '&lt;<span class="hl-tag">$1</span>');
  s = s.replace(/\x02([^\x03]*)\x03/g, '<span class="hl-str">"$1"</span>');
  s = s.replace(
    /\x01/g,
    () => `<span class="hl-comment">${comments.shift()}</span>`,
  );
  return s;
}

export function HowItWorks() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const FORM =
    process.env.VITE_APP_FOSS_FORM_URL || "https://forms.gle/jDZbSPaRqhEhExWZ9";

  return (
    <Box
      component="section"
      id="how"
      sx={{
        py: { xs: 7, md: 20 },
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        sx={{
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: 16,
          fontWeight: 600,
          color: "text.secondary",
          mb: 1.5,
        }}
      >
        How it works
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 5,
          "& .MuiTabs-indicator": { height: 2 },
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: 15,
            fontWeight: 500,
            minWidth: 0,
            px: 0,
            mr: 4,
            color: "text.secondary",
            "&.Mui-selected": { color: "text.primary", fontWeight: 600 },
          },
        }}
      >
        <Tab label="FOSS Projects" />
        <Tab label="Developers" />
      </Tabs>

      {/* ── FOSS Projects tab ── */}
      {tab === 0 && (
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Text column */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ my: "auto", justifyContent: "center", alignItems: "center" }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 24, md: 32 },
                fontWeight: 500,
                letterSpacing: "-0.5px",
                mb: 2,
              }}
            >
              Use Hosted Authy{" "}
            </Typography>
            <Typography
              fontSize={15}
              lineHeight={1.75}
              mb={4}
              sx={{ color: "text.secondary" }}
            >
              Are you an open source project? Please fill our application form
              to get started with our hosted instance of Authy. You will be able
              to manage your own devices while we handle the server instances.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 6 }}>
              <PlainButton
                variant="contained"
                href={FORM}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textTransform: "none", mt: 6 }}
              >
                Apply
              </PlainButton>
              <PrimaryButton href="#foss" sx={{ textTransform: "none", mt: 6 }}>
                Read More
              </PrimaryButton>
            </Stack>
          </Grid>

          {/* Widget image */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={WidgetImage}
              alt="Authy widget"
              sx={{
                width: "100%",
                maxWidth: 480,
                borderRadius: 2,
                boxShadow: 6,
              }}
            />
          </Grid>
        </Grid>
      )}

      {/* ── Developers tab ── */}
      {tab === 1 && (
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
          {/* Steps column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 24, md: 32 },
                fontWeight: 500,
                letterSpacing: "-0.5px",
                mb: 4,
              }}
            >
              Straightforward Authy Setup
            </Typography>

            <Stack spacing={4} mb={4}>
              {SETUP_STEPS.map((s) => (
                <Stack
                  direction="row"
                  spacing={2.5}
                  alignItems="flex-start"
                  key={s.n}
                >
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "text.secondary",
                      letterSpacing: "0.05em",
                      mt: "2px",
                      flexShrink: 0,
                    }}
                  >
                    {s.n}
                  </Typography>
                  <Box>
                    <Typography
                      fontWeight={600}
                      fontSize={17}
                      color="text.primary"
                      mb={0.5}
                    >
                      {s.title}
                    </Typography>
                    <Typography
                      fontSize={14}
                      lineHeight={1.6}
                      sx={{ color: "text.secondary", mt: 2 }}
                    >
                      {s.body}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>

            <PrimaryButton
              variant="contained"
              href="https://github.com/shortmesh/Authy-API"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: "none", mt: 6 }}
            >
              Full setup guide on GitHub
            </PrimaryButton>
          </Grid>

          {/* Code panel */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={4}
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                bgcolor: (t) =>
                  t.palette.mode === "dark" ? "#020306" : "#F2F2F2",
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  fontFamily: "monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                authy-setup
              </Box>
              <Box
                component="pre"
                className="setup-pre"
                sx={{
                  m: 0,
                  p: "20px 24px",
                  fontFamily: "monospace",
                  fontSize: 13,
                  lineHeight: 1.75,
                  color: "text.primary",
                  overflowX: "auto",
                  whiteSpace: "pre",
                  bgcolor: "transparent",
                }}
                dangerouslySetInnerHTML={{
                  __html: highlightSetup(SETUP_SNIPPET),
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
