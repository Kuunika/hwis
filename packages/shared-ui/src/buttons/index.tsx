import { Button } from "@mui/material";
import { buttonStyles } from "./button.style";
import { FC } from "react";

type Props = {
  variant: "primary" | "secondary";
  title: string;
  onClick: () => void;
};

export const MainButton: FC<Props> = ({ variant, title, onClick }) => {
  const variantStyles = buttonStyles[variant];

  return (
    <Button sx={{ ...variantStyles }} onClick={onClick}>
      {title}
    </Button>
  );
};
