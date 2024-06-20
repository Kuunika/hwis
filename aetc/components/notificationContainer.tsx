"use client";
import { MainTypography, WrapperBox } from "@/components";

type Props = {
  message: string;
};

export const NotificationContainer = ({ message }: Props) => {
  return (
    <WrapperBox
      sx={{
        backgroundColor: "#B9E6FE",
        color: "#026AA2",
        py: "2ch",
        px: "1ch",
        my: "1ch",
      }}
    >
      <MainTypography>{message}</MainTypography>
    </WrapperBox>
  );
};
