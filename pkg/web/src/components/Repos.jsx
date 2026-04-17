import { Box, Chip, Grid, Paper, Stack, Typography, useTheme } from "@mui/material";
import { REPOS } from "../data/repos";

export function Repos() {
  const theme = useTheme();
  return (
    <Box
      component="section"
      id="repos"
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
        Open Source
      </Typography>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: 24, md: 32 },
          fontWeight: 500,
          letterSpacing: "-0.5px",
          mb: 5,
        }}
      >
        Everything you need, in the open
      </Typography>

      <Grid container spacing={2}>
        {REPOS.map((r) => (
          <Grid key={r.name} size={{ xs: 6, md: 3 }}>
            <Paper
              component="a"
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 3,
                gap: 1.5,
                minHeight: 180,
                borderRadius: 1.5,
                textDecoration: "none",
                bgcolor: "background.paper",
                transition: "border-color 0.15s, box-shadow 0.15s",
                "&:hover": {
                  borderColor: `${theme.palette.primary.main}80`,
                  boxShadow: 3,
                },
              }}
            >
              <Typography
                sx={{ fontWeight: 600 }}
                fontSize={14}
                color="text.primary"
              >
                {r.name}
              </Typography>
              <Typography
                fontSize={13}
                lineHeight={1.5}
                sx={{ color: "text.secondary" }}
                flex={1}
              >
                {r.desc}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  fontSize={12}
                  color="primary.main"
                  fontWeight={500}
                  sx={{ textDecoration: "underline" }}
                >
                  GitHub Repo ↗
                </Typography>
                <Chip
                  label={r.lang}
                  size="small"
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: `${theme.palette.primary.main}1a`,
                    color: "text.secondary",
                  }}
                />
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
