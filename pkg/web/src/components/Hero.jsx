import { Box, Chip, Grid, Typography, useTheme } from "@mui/material";
import { PrimaryButton } from "./buttons";
import { DemoCard } from "./DemoCard";

export function Hero() {
  const theme = useTheme();
  return (
    <Grid container spacing={{ xs: 4, md: 8 }} sx={{ my: { xs: 7, md: 24 } }}>
      {/* Left: copy */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Chip
          label="Phone Number Verification"
          size="small"
          sx={{
            mb: 4.5,
            bgcolor: `${theme.palette.primary.main}1a`,
            color: "primary.main",
            border: `1px solid ${theme.palette.primary.main}80`,
            fontWeight: 500,
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 32, sm: 40, md: 60 },
            letterSpacing: "-1.5px",
            lineHeight: 1.08,
            mb: 4.5,
            color: "text.primary",
            fontWeight: 600,
          }}
        >
          Authy - Shortmesh
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 2, lineHeight: 2, fontSize: 18, color: "text.secondary" }}
        >
          Authy enables receiving OTP code on other platforms other than SMS.
          This includes platforms such as Signal, WhatsApp, Telegram etc. This
          is useful for regions where receiving OTP via SMS is unavailable.
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4.5, lineHeight: 2, fontSize: 18, color: "text.secondary" }}
        >
          Authy is open source and powered by Shortmesh.
        </Typography>
        <PrimaryButton
          href="https://github.com/shortmesh/Authy-API"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ textTransform: "none" }}
        >
          Get the API
        </PrimaryButton>
      </Grid>

      {/* Right: demo */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <DemoCard />
      </Grid>
    </Grid>
  );
}
