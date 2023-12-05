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
};

export const MainButton: FC<Props> = ({
  variant = "primary",
  title,
  onClick,
  type,
  sx,
  icon,
}) => {
  const variantStyles = buttonStyles[variant];

  return (
    <Button
      type={type}
      sx={
        {
          ...variantStyles,
          textTransform: "capitalize",
          color: "#fff",
          ...sx,
        } as SxProps
      }
      onClick={onClick}
    >
      {icon}
      {title}
    </Button>
  );
};
