import { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { PrimaryButton } from "./buttons";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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

const SCRIPT = [
  {
    kind: "prompt",
    text: "git clone https://github.com/shortmesh/Authy-API",
    delay: 400,
  },
  { kind: "out", text: "Cloning into 'Authy-API'..." },
  { kind: "out", text: "remote: Enumerating objects: 312, done." },
  { kind: "out", text: "remote: Counting objects: 100% (312/312), done." },
  {
    kind: "out",
    text: "Receiving objects: 100% (312/312), 148.7 KiB | 4.2 MiB/s, done.",
  },
  { kind: "out", text: "Resolving deltas: 100% (201/201), done." },
  { kind: "blank" },
  { kind: "prompt", text: "make setup && make migrate-up", delay: 350 },
  { kind: "out", text: "▶  Copying default.env → .env" },
  { kind: "out", text: "▶  Downloading dependencies..." },
  { kind: "success", text: "✓  Setup complete" },
  { kind: "out", text: "▶  Running migrations..." },
  { kind: "success", text: "✓  All migrations up to date" },
  { kind: "blank" },
  { kind: "prompt", text: "make run", delay: 300 },
  { kind: "out", text: "Database migrations completed successfully" },
  { kind: "out", text: "▶  Starting server..." },
  { kind: "blank" },
  { kind: "success", text: "⇨  http server started on [::]:8080" },
];

function TerminalPanel() {
  const [rendered, setRendered] = useState([]);
  const [typing, setTyping] = useState(null);
  const [cursorOn, setCursorOn] = useState(true);
  const timerRef = useRef(null);
  const bodyRef = useRef(null);

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [rendered, typing]);

  useEffect(() => {
    let cancelled = false;

    function run(lineIdx, charIdx) {
      if (cancelled) return;

      if (lineIdx >= SCRIPT.length) {
        timerRef.current = setTimeout(() => {
          if (!cancelled) {
            setRendered([]);
            setTyping(null);
            run(0, 0);
          }
        }, 2800);
        return;
      }

      const line = SCRIPT[lineIdx];

      if (line.kind === "prompt") {
        if (charIdx < line.text.length) {
          setTyping({ text: line.text.slice(0, charIdx) });
          timerRef.current = setTimeout(() => run(lineIdx, charIdx + 1), 38);
        } else {
          setRendered((prev) => [...prev, { kind: "prompt", text: line.text }]);
          setTyping(null);
          timerRef.current = setTimeout(
            () => run(lineIdx + 1, 0),
            line.delay ?? 250,
          );
        }
      } else if (line.kind === "blank") {
        setRendered((prev) => [...prev, { kind: "blank" }]);
        timerRef.current = setTimeout(() => run(lineIdx + 1, 0), 200);
      } else {
        setRendered((prev) => [...prev, line]);
        timerRef.current = setTimeout(() => run(lineIdx + 1, 0), 75);
      }
    }

    run(0, 0);
    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, []);

  const fg = "#e2e8f0";
  const dimFg = "rgba(226,232,240,0.5)";

  const Cursor = () => (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: "0.55em",
        height: "0.9em",
        bgcolor: cursorOn ? fg : "transparent",
        verticalAlign: "text-bottom",
        ml: "1px",
      }}
    />
  );

  function renderLine(line, i) {
    if (line.kind === "blank") return <Box key={i} sx={{ height: "0.65em" }} />;
    if (line.kind === "prompt")
      return (
        <Box
          key={i}
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
            mb: "1px",
          }}
        >
          <Box
            component="span"
            sx={{ color: "#5af78e", userSelect: "none", flexShrink: 0 }}
          >
            →
          </Box>
          <Box
            component="span"
            sx={{ color: "#57c7ff", userSelect: "none", flexShrink: 0 }}
          >
            ~
          </Box>
          <Box component="span" sx={{ color: fg }}>
            {line.text}
          </Box>
        </Box>
      );
    if (line.kind === "success")
      return (
        <Box key={i} sx={{ color: "#5af78e", pl: "28px" }}>
          {line.text}
        </Box>
      );
    return (
      <Box key={i} sx={{ color: dimFg, pl: "28px" }}>
        {line.text}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
        fontSize: 12.5,
        lineHeight: 1.65,
        bgcolor: "#131415",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.75,
          py: 1.25,
          bgcolor: "#1c1e21",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "#ff5f57",
          }}
        />
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "#febc2e",
          }}
        />
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "#28c840",
          }}
        />
        <Typography
          sx={{
            ml: "auto",
            mr: "auto",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.03em",
          }}
        >
          zsh — authy-api
        </Typography>
      </Box>

      <Box
        ref={bodyRef}
        sx={{
          p: "16px 20px",
          height: 450,
          overflowY: "auto",
          overflowX: "auto",
          color: fg,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {rendered.map(renderLine)}

        {typing !== null && (
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              mb: "1px",
            }}
          >
            <Box
              component="span"
              sx={{ color: "#5af78e", userSelect: "none", flexShrink: 0 }}
            >
              →
            </Box>
            <Box
              component="span"
              sx={{ color: "#57c7ff", userSelect: "none", flexShrink: 0 }}
            >
              ~
            </Box>
            <Box component="span" sx={{ color: fg }}>
              {typing.text}
            </Box>
            <Cursor />
          </Box>
        )}

        {typing === null && rendered.length === 0 && (
          <Box sx={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <Box
              component="span"
              sx={{ color: "#5af78e", userSelect: "none", flexShrink: 0 }}
            >
              →
            </Box>
            <Box
              component="span"
              sx={{ color: "#57c7ff", userSelect: "none", flexShrink: 0 }}
            >
              ~
            </Box>
            <Cursor />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function HowItWorks() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const FORM =
    import.meta.env.VITE_APP_FOSS_FORM_URL ||
    "https://forms.gle/jDZbSPaRqhEhExWZ9";

  return (
    <Box
      component="section"
      id="use-authy"
      sx={{
        py: { xs: 7, md: 20 },
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

      {tab === 0 && (
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ my: "auto", justifyContent: "center", alignItems: "center" }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 28, md: 40 },
                fontWeight: 600,
                letterSpacing: "-1.5px",
                mb: 2,
              }}
            >
              Use Hosted Authy{" "}
            </Typography>
            <Typography
              fontSize={15}
              lineHeight={1.75}
              sx={{ color: "text.secondary", mb: 4 }}
            >
              Are you an open source project? Please fill our application form
              to get started with our hosted instance of Authy. You will be able
              to manage your own devices while we handle the server instances.
            </Typography>

            <Stack spacing={1.5} mb={4}>
              {[
                "No hosting or infrastructure required",
                "Automatic updates as we ship them",
                "Simple integration and device management",
              ].map((benefit) => (
                <Box
                  key={benefit}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <CheckCircleIcon
                    sx={{ fontSize: 18, color: "primary.main", flexShrink: 0 }}
                  />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <PrimaryButton
              href={FORM}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: "none", mt: 6 }}
            >
              Apply
            </PrimaryButton>
          </Grid>

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
                width: "80%",
                maxWidth: 400,
                borderRadius: 2,
                boxShadow: 6,
              }}
            />
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 28, md: 40 },
                fontWeight: 600,
                letterSpacing: "-1.5px",
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
                      variant="body2"
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

          <Grid size={{ xs: 12, md: 6 }}>
            <TerminalPanel />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
