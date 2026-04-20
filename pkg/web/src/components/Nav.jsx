import { useState } from "react";
import {
  AppBar,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import { PlainButton } from "./buttons";

const NAV_LINKS = [
  { label: "FOSS Projects", href: "#foss" },
  { label: "How it works", href: "#how" },
];

export function Nav() {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState(null);

  return (
    <>
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

            {/* Desktop links */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={3}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
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
                  {l.label}
                </Link>
              ))}
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

            {/* Mobile hamburger */}
            <IconButton
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{
                display: { xs: "flex", sm: "none" },
                color: "text.primary",
              }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile popup menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            },
          },
        }}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        {NAV_LINKS.map((l) => (
          <MenuItem
            key={l.label}
            component="a"
            href={l.href}
            onClick={() => setMenuAnchor(null)}
            sx={{ fontSize: 14, color: "text.secondary", py: 1.2 }}
          >
            {l.label}
          </MenuItem>
        ))}
        <MenuItem sx={{ pt: 0.5, pb: 1, px: 1.5 }}>
          <PlainButton
            href="https://github.com/shortmesh/Authy-API"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<GitHubIcon fontSize="small" />}
            fullWidth
            sx={{
              textTransform: "none",
              fontSize: 14,
              justifyContent: "flex-start",
            }}
          >
            GitHub
          </PlainButton>
        </MenuItem>
      </Menu>
    </>
  );
}
