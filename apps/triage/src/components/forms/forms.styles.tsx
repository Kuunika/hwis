import { SxProps } from "@mui/material";

export const formStyles: { [key: string]: SxProps } = {
  responsiveness: {
    display: "grid",
    gridTemplateColumns: { md: "1fr 1fr", xs: "1fr", sm: "1fr 1fr" },
    gridGap: "2ch",
  },
};
