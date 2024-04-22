import { Typography } from "@mui/material";
import { headerStyles } from "./header.style";
import { FC } from "react";

type Props = {
  variant: "h1" | "h2";
  title: string;
};

export const Header: FC<Props> = ({ variant = "h1", title }) => {
  const variantStyles = headerStyles[variant];
  return <Typography sx={{ ...variantStyles }}>{title}</Typography>;
};
