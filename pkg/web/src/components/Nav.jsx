import {
  AppBar,
  Box,
  Container,
  Link,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { PlainButton } from "./buttons";

export function Nav() {
  const theme = useTheme();
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: "text.primary",
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Toolbar
          sx={{
            px: { xs: 2, md: 3 },
            minHeight: "70px !important",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            component={Link}
            href="/demo"
            spacing={1}
            sx={{ flexGrow: 1 }}
          >
            <Typography
              component="span"
              color="primary"
              fontSize={18}
              lineHeight={1}
            >
              ◈
            </Typography>
            <Typography
              fontWeight={600}
              lineHeight={1}
              sx={{
                color: "text.primary",
                textDecoration: "none",

                fontSize: 19,
              }}
            >
              Authy
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Link
              href="#foss"
              underline="none"
              color="text.secondary"
              fontSize={14}
              lineHeight={1}
              sx={{
                display: "flex",
                alignItems: "center",
                "&:hover": { color: "text.primary" },
              }}
            >
              FOSS Projects
            </Link>
            <Link
              href="#how"
              underline="none"
              color="text.secondary"
              fontSize={14}
              lineHeight={1}
              sx={{
                display: "flex",
                alignItems: "center",
                "&:hover": { color: "text.primary" },
              }}
            >
              How it works
            </Link>
            <PlainButton
              href="https://github.com/shortmesh/Authy-API"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<GitHubIcon fontSize="small" />}
              sx={{ textTransform: "none", fontSize: 14, py: 0.6, px: 2 }}
            >
              GitHub
            </PlainButton>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
