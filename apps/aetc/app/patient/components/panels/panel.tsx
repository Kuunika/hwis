import { ReactNode } from "react";
import { MainButton, MainTypography, WrapperBox } from "shared-ui/src";

type Props = {
  title: string;
  children: ReactNode;
  icon?: any;
};
export const Panel = ({ children, title, icon }: Props) => {
  return (
    <WrapperBox
      sx={{
        width: "100%",
        borderStyle: "solid",
        borderWidth: "0.1ch",
        borderColor: "#E6E6E6",
        p: "1ch",
        height: "30ch",
      }}
    >
      <WrapperBox display={"flex"} justifyContent={"space-between"}>
        <MainTypography variant="h5">{title}</MainTypography>
        {icon}
      </WrapperBox>
      <WrapperBox>{children}</WrapperBox>
    </WrapperBox>
  );
};
