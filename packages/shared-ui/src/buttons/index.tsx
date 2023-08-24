import { Button, SxProps } from "@mui/material";
import { buttonStyles } from "./button.style";
import { FC } from "react";

type Props = {
  variant: "primary" | "secondary";
  title: string;
  onClick: () => void;
  sx: SxProps;
};

export const MainButton: FC<Props> = ({ variant, title, onClick, sx }) => {
  const variantStyles = buttonStyles[variant];

  return (
    <Button sx={{ ...variantStyles, ...sx }} onClick={onClick}>
      {title}
    </Button>
  );
};
