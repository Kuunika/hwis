import { SxProps } from "@mui/material";
import { defaultTheme } from "../theme/colors";

export const buttonStyles: { [key: string]: SxProps } = {
  primary: {
    backgroundColor: defaultTheme.primary,
    color: defaultTheme.primaryFontColor,
    "&:hover": {
      backgroundColor: defaultTheme.primary,
    },
  },
  secondary: {
    backgroundColor: defaultTheme.secondary,
    color: defaultTheme.secondaryFontColor,
    "&:hover": {
      backgroundColor: defaultTheme.secondary,
    },
  },
};
