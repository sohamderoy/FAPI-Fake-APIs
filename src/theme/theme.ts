import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2563EB",
      light: "#3B82F6",
      dark: "#1D4ED8",
    },
    secondary: {
      main: "#8B5CF6",
      light: "#A78BFA",
      dark: "#7C3AED",
    },
    background: {
      default: "#000000",
      paper: "#111111",
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#D1D5DB",
    },
  },
  typography: {
    fontFamily: "var(--font-outfit), Outfit, sans-serif",
    h1: {
      fontFamily: "var(--font-outfit), Outfit, sans-serif",
      fontSize: "3.5rem",
      fontWeight: 700,
      letterSpacing: "0.2em",
    },
    h2: {
      fontFamily: "var(--font-outfit), Outfit, sans-serif",
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "var(--font-outfit), Outfit, sans-serif",
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "var(--font-outfit), Outfit, sans-serif",
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    button: {
      fontFamily: "var(--font-outfit), Outfit, sans-serif",
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "var(--font-outfit), Outfit, sans-serif",
          backgroundColor: "#000000",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: "#111111",
        },
      },
    },
  },
});
