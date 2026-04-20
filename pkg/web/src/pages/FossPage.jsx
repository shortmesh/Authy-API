import {
  Box,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { PrimaryButton, PlainButton } from "../components/buttons";

const FORM = process.env.VITE_APP_FOSS_FORM_URL || "https://forms.gle/jDZbSPaRqhEhExWZ9";

const FOSS_BENEFITS = [
  {
    n: "01",
    title: "Fast Setup",
    body: "No servers. No configuration. Sign up, get your API key, and start authenticating users.",
  },
  {
    n: "02",
    title: "Built for Scale",
    body: "Whether you have 10 or a million users, Authy scales automatically with your product.",
  },
  {
    n: "03",
    title: "Reliable Delivery",
    body: "Authy ensures your messages reach users quickly and consistently, even in low-connectivity environments.",
  },
  {
    n: "04",
    title: "Always up to date",
    body: "Every improvement, improvement and security patch we ship is instantly live in your product.",
  },
];

export function FossPage() {
  const theme = useTheme();
  return (
    <>
      <Nav />
      {/* Hero */}
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: { xs: 10, md: 18 },
          textAlign: "center",
        }}
      >
        <Container
          maxWidth={false}
          sx={{ px: { xs: 2, md: 3 }, maxWidth: "800px" }}
        >
          <Chip
            label="Hosted Authy"
            size="small"
            sx={{
              mb: 3,
              bgcolor: `${theme.palette.primary.main}1a`,
              color: "primary.main",
              border: `1px solid ${theme.palette.primary.main}80`,
              fontWeight: 500,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 32, sm: 44, md: 56 },
              fontWeight: 600,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              mb: 3,
              color: "text.primary",
            }}
          >
            Authy for FOSS Projects
          </Typography>
          <Typography
            fontSize={{ xs: 16, md: 18 }}
            color="text.secondary"
            lineHeight={1.8}
            mb={5}
          >
            Are you building an open-source project? Apply for our hosted Authy
            instance — we handle the infrastructure while you manage your own
            messaging devices and users.
          </Typography>
          <PrimaryButton
            href={FORM}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 6 }}
          >
            Apply Now
          </PrimaryButton>
        </Container>
      </Box>

      {/* Benefits */}
      <Container
        maxWidth={false}
        sx={{ px: { xs: 2, md: 3 }, maxWidth: "1100px" }}
      >
        <Box sx={{ py: { xs: 8, md: 14 } }}>
          <Typography
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: 12,
              fontWeight: 600,
              color: "text.secondary",
              mb: 1.5,
              textAlign: "center",
            }}
          >
            Why hosted Authy
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 24, md: 36 },
              fontWeight: 500,
              letterSpacing: "-0.5px",
              mb: 8,
              textAlign: "center",
            }}
          >
            Everything you need, none of the overhead
          </Typography>

          <Grid container spacing={5}>
            {FOSS_BENEFITS.map((b) => (
              <Grid key={b.n} size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "primary.main",
                      letterSpacing: "0.08em",
                      mb: 1.5,
                    }}
                  >
                    {b.n}
                  </Typography>
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: 18,
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {b.title}
                  </Typography>
                  <Typography
                    fontSize={15}
                    color="text.secondary"
                    lineHeight={1.75}
                  >
                    {b.body}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
