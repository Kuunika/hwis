import Popover from "@mui/material/Popover";
import { ReactNode, FC } from "react";

type Prop = {
  children: ReactNode;
  anchorEl: any;
  onClose: () => void;
  anchorOrigin?: any;
  transformOrigin?: any;
  maxHeight?: string | number; // Add maxHeight prop to customize the maximum height
};
export const BasePopover: FC<Prop> = ({
  children,
  anchorEl,
  onClose,
  anchorOrigin = {
    vertical: "top",
    horizontal: "right",
  },
  transformOrigin = {
    vertical: "top",
    horizontal: "left",
  },
  maxHeight = "500px", // Default max height
}) => {
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={{
        "& .MuiPopover-paper": {
          maxHeight: maxHeight,
          overflow: "auto",
        },
      }}
    >
      {children}
    </Popover>
  );
};
