'use client'
import { Button, SxProps } from "@mui/material";
import { buttonStyles } from "./button.style";
import { FC } from "react";

type Props = {
  variant?: "primary" | "secondary" | "text";
  title?: any;
  onClick: (params?: any) => void;
  type?: "submit" | "button" | "reset";
  sx?: SxProps;
  icon?: any;
  iconRight?: any;
  disabled?: boolean;
};

export const MainButton: FC<Props> = ({
  variant = "primary",
  title,
  onClick,
  type,
  sx,
  icon,
  iconRight,
  disabled = false
}) => {
  const variantStyles = buttonStyles[variant];

  return (
    <Button
      type={type}
      disabled={disabled}
      sx={
        {
          ...variantStyles,
          textTransform: "capitalize",
          color: "#fff",
          borderRadius: "1px",
          ...sx,
        } as SxProps
      }
      onClick={onClick}
    >
      {icon}
      {title}
      {iconRight}
    </Button>
  );
};
