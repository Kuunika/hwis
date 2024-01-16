import { ReactNode } from "react";
import { MainTypography, WrapperBox } from "..";
import { SxProps } from "@mui/material";

type Prop = {
  children: ReactNode;
  sx?: SxProps;
};
export const FieldsContainer = ({ children, sx }: Prop) => {
  return (
    <WrapperBox
      display={"flex"}
      justifyContent={"space-between"}
      sx={{ ...sx }}
    >
      {children}
    </WrapperBox>
  );
};

export const FormFieldContainerLayout = ({
  children,
  title,
  last = false,
}: {
  children: ReactNode;
  title: string;
  last?: boolean;
}) => {
  return (
    <WrapperBox
      sx={{
        display: "flex",
        justifyContent: "space-between",
        my: "1ch",
        py: "2ch",
        borderBottom: last ? "" : "2px dashed #B3B3B3",
      }}
    >
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "24px",
          letterSpacing: "0em",
          textAlign: "left",
          width: "45ch",
        }}
      >
        {title}
      </MainTypography>
      <WrapperBox sx={{ width: "100%" }}>{children}</WrapperBox>
    </WrapperBox>
  );
};
