import Popover from "@mui/material/Popover";
import { ReactNode, FC } from "react";

type Prop = {
  children: ReactNode;
  anchorEl: any;
  onClose: () => void;
  anchorOrigin?: any;
  transformOrigin?: any
};
export const BasePopover: FC<Prop> = ({ children, anchorEl, onClose, anchorOrigin = {
  vertical: "top",
  horizontal: "right",
}, transformOrigin = {
  vertical: "top",
  horizontal: "left",
} }) => {
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
    >
      {children}
    </Popover>
  );
};
