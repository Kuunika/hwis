import { SxProps } from "@mui/material";
import { defaultTheme } from "shared-ui/src";

export const welcomeStyles: { [key: string]: SxProps } = {
  baseButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    p: "1ch",
    borderRadius: "1ch",
    cursor: "pointer",
    borderColor: defaultTheme.secondary,
    color: defaultTheme.primaryDark,
    "&:hover": {
      backgroundColor: defaultTheme.primaryDark,
      color: defaultTheme.primaryFontColor,
    },
  },
  menu: {
    display: "grid",
    gridTemplateColumns: { md: "1fr 1fr", xs: "1fr", sm: "1fr 1fr" },
    gridGap: "5ch",
  },
};
