'use client'
import { Card, SxProps } from "@mui/material";
import { FC, ReactNode } from "react";
import { cardStyles } from "./card.styles";

type Prop = {
  children: ReactNode;
  sx?: SxProps;
  elevation?: number;
  border?: string;
  background?: string;
};
export const MainCard: FC<Prop> = ({ children, elevation = 0, sx }) => {
  return (
    <Card sx={{ ...cardStyles.main, ...sx } as SxProps} elevation={elevation}>
      {children}
    </Card>
  );
};
