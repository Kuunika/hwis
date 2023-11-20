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
        margin: "0.5ch",
        borderStyle: "solid",
        borderWidth: "0.3ch",
        borderRadius: "0.5ch",
        borderColor: "#B3B3B3",
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
