import { ReactNode } from "react";
import { WrapperBox } from "..";
import { SxProps } from "@mui/material";

type Prop = {
  children: ReactNode;
  sx?: SxProps;
};
export const FieldsContainer = ({ children, sx }: Prop) => {
  return (
    <WrapperBox display={"flex"} alignItems={"center"} sx={sx}>
      {children}
    </WrapperBox>
  );
};
