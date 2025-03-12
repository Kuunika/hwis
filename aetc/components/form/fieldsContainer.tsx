"use client";
import { ReactNode } from "react";

import { Box, SxProps } from "@mui/material";
import { WrapperBox, MainTypography } from "..";

type Prop = {
  children: ReactNode;
  sx?: SxProps;
  mr?: string;
};
export const FieldsContainer = ({ children, sx, mr = "1ch" }: Prop) => {
  return (
    <WrapperBox
      display={"flex"}
      justifyContent={"flex-start"}
      sx={{
        ...sx,

        "& > :first-child": {
          mr,
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

export const DashedContainer = ({
  children,
  my = "0.5ch",
  border = "top",
}: {
  children: ReactNode;
  my?: string;
  border?: "bottom" | "top" | "both";
}) => {
  const borderStyles = {
    borderTop:
      border === "top" || border === "both" ? "2px dashed #B3B3B3" : undefined,
    borderBottom:
      border === "bottom" || border === "both"
        ? "2px dashed #B3B3B3"
        : undefined,
  };

  return <Box sx={{ ...borderStyles, my, py: "0.5ch" }}>{children}</Box>;
};

export const FormFieldContainerMultiple = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        width: "100%",

        "& > *": {
          width: { xs: "100%", sm: "auto" },
          flex: 1,
        },
      }}
    >
      {children}
    </Box>
  );
};
