import { Box, Button, useTheme } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export function PrimaryButton({ children, sx: sxProp, ...props }) {
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      size="large"
      endIcon={
        <Box
          sx={{
            width: 35,
            height: 35,
            borderRadius: "50%",
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ml: 0.5,
            flexShrink: 0,
          }}
        >
          <ChevronRightIcon sx={{ fontSize: 18, color: "primary.main" }} />
        </Box>
      }
      sx={[
        {
          borderRadius: "15px",
          textTransform: "none",
          px: 3.5,
          py: 1.5,
          fontSize: 15,
          fontWeight: 600,
          "& .MuiButton-endIcon": { ml: 1 },
        },
        ...(Array.isArray(sxProp) ? sxProp : sxProp ? [sxProp] : []),
      ]}
      {...props}
    >
      {children}
    </Button>
  );
}

export function PlainButton({ children, sx: sxProp, ...props }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Button
      variant="contained"
      disableElevation
      size="large"
      sx={[
        {
          borderRadius: "15px",
          textTransform: "none",
          px: 3.5,
          py: 1.5,
          fontSize: 15,
          fontWeight: 600,
          backgroundColor: isDark ? "#fff" : theme.palette.primary.main,
          color: isDark ? "#000" : "#fff",
          "&:hover": {
            backgroundColor: isDark ? "#e0e0e0" : theme.palette.primary.dark,
          },
        },
        ...(Array.isArray(sxProp) ? sxProp : sxProp ? [sxProp] : []),
      ]}
      {...props}
    >
      {children}
    </Button>
  );
}
