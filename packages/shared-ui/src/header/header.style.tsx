// header.style.ts

import { SxProps } from "@mui/material";
import { defaultTheme } from "../theme/colors"; // Path might change based on your directory structure

export const headerStyles: { [key: string]: SxProps } = {
  h1: {
    fontSize: "2rem",
    color: defaultTheme.primaryFontColor,
    fontWeight: "bold",
  },
  h2: {
    fontSize: "1.5rem",
    color: defaultTheme.secondaryFontColor,
  },
};
