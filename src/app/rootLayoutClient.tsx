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
    // Log FAPI ASCII art and info on client mount
    const port = window.location.port || "3000";

    console.log(
      `%c  ______   _____   ______  ______
 |  ____| |  _  | |  ___ | |_  _|
 | |__    | |_| | | |__| |   ||
 |  __|   |  _  | |  ____/   ||
 | |      | | | | | |        ||
 |_|      |_| |_| |_|       |__| `,
      "color: #3b82f6; font-weight: bold;"
    );
    console.log(
      "%cCreate & simulate Fake APIs (FAPIs) in seconds.",
      "color: #9ca3af;",
    );
    console.log("");
    console.log(
      `%cFAPI Version:           %cv${packageJson.version}`,
      "color: #9ca3af;",
      "color: #22c55e; font-weight: bold;"
    );
    console.log(
      `%cFAPI running on PORT:   %c${port}`,
      "color: #9ca3af;",
      "color: #22c55e; font-weight: bold;"
    );
    console.log(
      `%cFAPIs are available at: %chttp://localhost:${port}/api/fapi/%c{your-endpoint}`,
      "color: #9ca3af;",
      "color: #eab308;",
      "color: #6b7280;"
    );
  }, []);

  return (
    <html
      lang="en"
      className={`${googleSansFlex.variable} ${googleSansCode.variable}`}
    >
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
