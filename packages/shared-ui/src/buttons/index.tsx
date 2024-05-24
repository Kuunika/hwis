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



  if (disabled) {
    return <Button
      type={type}
      sx={
        {
          color: 'gray', // Custom color for text
          backgroundColor: 'lightgrey', // Custom background color
          cursor: 'not-allowed',
          textTransform: "capitalize",
          borderRadius: "1px",
        } as SxProps
      }
    >
      {icon}
      {title}
      {iconRight}
    </Button>
  }

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
