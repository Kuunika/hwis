'use client'
import { ReactNode } from "react";

import { SxProps } from "@mui/material";
import { WrapperBox, MainTypography } from "..";

type Prop = {
  children: ReactNode;
  sx?: SxProps;
};
export const FieldsContainer = ({ children, sx }: Prop) => {
  return (
    <WrapperBox
      display={"flex"}
      justifyContent={"flex-start"}
      sx={{
        ...sx,
        "& > :first-child": {
          mr: "5px",
        },
      }}
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

        flexDirection: { xs: "column", lg: "row" },
        my: "1ch",
        py: "2ch",
        width: "100%",
        borderBottom: last ? "" : "2px dashed #B3B3B3",
      }}
    >
      <MainTypography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "24px",
          letterSpacing: "0em",
          textAlign: "left",
          width: { lg: "40%" },
          mb: { xs: "2ch" },
        }}
      >
        {title}
      </MainTypography>
      <WrapperBox sx={{ width: { xs: "100%", lg: "60%" } }}>
        {children}
      </WrapperBox>
    </WrapperBox>
  );
};
