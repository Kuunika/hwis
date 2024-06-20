import { ReactNode } from "react";
import {
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
} from "@/components";

type Props = {
  title: string;
  children: ReactNode;
  icon?: any;
};
export const Panel = ({ children, title, icon }: Props) => {
  return (
    <MainPaper
      sx={{
        width: "100%",
        borderStyle: "solid",
        borderWidth: "0.1ch",
        borderColor: { xs: "#B3B3B3", lg: "#E6E6E6" },
        p: "2ch",
        backgroundColor: "#fff",
        m: "0.5ch",
      }}
    >
      <WrapperBox display={"flex"} alignItems={"center"}>
        <MainTypography
          sx={{
            fontFamily: "Inter",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "24px",
            letterSpacing: "0em",
            textAlign: "left",
          }}
        >
          {title}
        </MainTypography>
        {icon}
      </WrapperBox>
      <WrapperBox>{children}</WrapperBox>
    </MainPaper>
  );
};
