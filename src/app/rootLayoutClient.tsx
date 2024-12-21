"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { outfit } from "./fonts";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "./globals.css";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
