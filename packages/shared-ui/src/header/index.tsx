import { SxProps, Typography } from "@mui/material";
import { headerStyles } from "./header.style";
import { FC } from "react";

type Props = {
  variant: "h1" | "h2";
  title: string;
  sx?: SxProps;
};

export const Header: FC<Props> = ({ variant = "h1", sx, title }) => {
  const variantStyles = headerStyles[variant];
  return (
    <Typography sx={(theme: any) => ({ ...variantStyles, ...sx })}>
      {title}
    </Typography>
  );
};
