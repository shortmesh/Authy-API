import { Box, Link, Typography, useTheme } from "@mui/material";

export function Contact() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        py: { xs: 8, md: 12 },
        textAlign: "center",
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
