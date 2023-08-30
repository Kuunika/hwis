import { Button, SxProps } from "@mui/material";
import { buttonStyles } from "./button.style";
import { FC } from "react";

type Props = {
  variant?: "primary" | "secondary";
  title: string;
  onClick: () => void;
  type?: "submit" | "button" | "reset";
  sx?: SxProps;
};

export const MainButton: FC<Props> = ({
  variant = "primary",
  title,
  onClick,
  type,
  sx,
}) => {
  const variantStyles = buttonStyles[variant];

  return (
    <Button
      type={type}
      sx={{ ...variantStyles, ...sx } as SxProps}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};
