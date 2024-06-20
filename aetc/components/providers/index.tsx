"use client";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#006401",
    },
  },
});

export const ProviderTheme = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
