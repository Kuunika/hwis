import { Button } from "@mui/material";
import { buttonStyles } from "./button.style";
import { FC } from "react";

type Props = {
  variant: "primary" | "secondary";
  title: string;
  onClick: () => void;
  type?: "submit" | "button" | "reset";
};

export const MainButton: FC<Props> = ({ variant, title, onClick, type }) => {
  const variantStyles = buttonStyles[variant];

  return (
    <Button type={type} sx={{ ...variantStyles }} onClick={onClick}>
      {title}
    </Button>
  );
};
