"use client";
import { Button, SxProps } from "@mui/material";
import { buttonStyles } from "./button.style";
import { FC } from "react";
import { useNavigation } from "@/hooks";

type Props = {
  variant?: "primary" | "secondary" | "text";
  title?: any;
  type?: "submit" | "button" | "reset";
  sx?: SxProps;
  icon?: any;
  iconRight?: any;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  url?: any;
};

export const NextButton: FC<Props> = ({
  variant = "primary",
  title,
  type,
  sx,
  icon,
  iconRight,
  disabled = false,
  size,
  url,
}) => {
  const variantStyles = buttonStyles[variant];
  const { navigateTo } = useNavigation();
  const redirect = () => {
    if (url) {
      navigateTo(url);
    }
  };

  return (
    <Button
      size={size}
      type={type}
      disabled={disabled}
      sx={
        {
          ...variantStyles,
          textTransform: "capitalize",
          color: "#fff",
          ...sx,
        } as SxProps
      }
      onClick={redirect}
    >
      {icon}
      {title}
      {iconRight}
    </Button>
  );
};
