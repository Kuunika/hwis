import { Card, SxProps } from "@mui/material";
import { FC, ReactNode } from "react";
import { cardStyles } from "./card.styles";

type Prop = {
  children: ReactNode;
  elevation?: number;
  sx?: SxProps;
};
export const MainCard: FC<Prop> = ({ children, elevation = 0, sx }) => {
  return (
    <Card sx={{ ...cardStyles.main, ...sx }} elevation={elevation}>
      {children}
    </Card>
  );
};
