import { FC, ReactNode } from "react";
import { Box } from "@mui/material";

type Prop = {
  direction: "column" | "row";
  children: ReactNode;
};

export const FormFieldContainer: FC<Prop> = ({ direction, children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: direction }}>{children}</Box>
  );
};
