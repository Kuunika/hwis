import { Button, SxProps } from "@mui/material";
import { buttonStyles } from "./button.style";
import { FC,ReactNode } from "react";

type Props = {
  variant?: "primary" | "secondary" | "text";
  title: string;
  onClick: (params?: any) => void;
  type?: "submit" | "button" | "reset";
  sx?: SxProps;
  startIcon:ReactNode;
};

export const MainButton: FC<Props> = ({
  variant = "primary",
  title,
  onClick,
  type,
  sx,
  startIcon,
}) => {
  const variantStyles = buttonStyles[variant];

  return (
    <Button
      type={type}
      sx={{ ...variantStyles, ...sx } as SxProps}
      onClick={onClick}
      startIcon={startIcon}
    >
      {title}
    </Button>
  );
};
