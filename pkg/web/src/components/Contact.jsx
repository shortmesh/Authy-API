import { Box, Link, Typography, useTheme } from "@mui/material";

export function Contact() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        textAlign: "center",
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
      <Typography
        variant="body1"
        fontSize={{ xs: 15, md: 16 }}
        color="text.secondary"
      >
        Need help integrating? Write us at:{" "}
        <Link
          href="mailto:developers@shortmesh.com"
          underline="hover"
          color="primary"
          fontWeight={500}
        >
          developers@shortmesh.com
        </Link>
      </Typography>
    </Box>
  );
}
