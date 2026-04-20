import {
  Box,
  Container,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { REPOS } from "../data/repos";

export function Footer() {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        py: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={{ xs: 2, sm: 0 }}
          sx={{ width: "100%" }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexGrow: 1 }}
          >
            <Typography component="span" color="primary" fontSize={16}>
              ◈
            </Typography>
            <Typography fontWeight={600} fontSize={14} color="text.primary">
              Authy
            </Typography>
          </Stack>

          {/* Mobile: 2-column grid */}
          <Box
            sx={{
              display: { xs: "grid", sm: "none" },
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              width: "100%",
            }}
          >
            {REPOS.map((r) => (
              <Link
                key={r.name}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                fontSize={13}
                color="text.secondary"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                {r.name}
              </Link>
            ))}
          </Box>

          {/* Desktop: horizontal row */}
          <Stack
            direction="row"
            spacing={2.5}
            alignItems="center"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {REPOS.map((r) => (
              <Link
                key={r.name}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                fontSize={13}
                color="text.secondary"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                {r.name}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
