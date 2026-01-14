"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { googleSansFlex, googleSansCode } from "./fonts";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import "./globals.css";
import { useEffect } from "react";
import packageJson from "../../package.json";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Log FAPI version on client mount
    console.log(`FAPI Version - v${packageJson.version}`);
  }, []);

  return (
    <html lang="en" className={`${googleSansFlex.variable} ${googleSansCode.variable}`}>
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
