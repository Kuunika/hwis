import { ReactNode } from "react";
import { MainPaper, MainTypography, WrapperBox } from "@/components";

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
        border: '1px solid #ccc',
        p: "1ch",
        backgroundColor: "#fff",
        m: "0.5ch",
        boxShadow:'none',
      }}
    >
      <WrapperBox display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
        <MainTypography
        variant="h5" fontWeight={"700"}
          sx={{

            lineHeight: "24px",
            letterSpacing: "0em",
            textAlign: "left",
            marginBottom: "1ch",
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
