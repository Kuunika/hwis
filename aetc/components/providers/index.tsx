"use client";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { ReactNode } from "react";

const theme = createTheme({
  typography: {
    // fontFamily: [
    //   'Segoe UI',
    //   'Roboto',
    //   'Noto Sans',
    //   'Ubuntu',
    //   'Droid Sans',
    //   'Helvetica Neue',
    //   'sans-serif'
    // ].join(','),
  },
  palette: {
    primary: {
      main: "#006401",
    },
  },
});

export const ProviderTheme = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
