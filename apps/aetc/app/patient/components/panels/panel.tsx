import { ReactNode } from "react";
import { MainTypography, WrapperBox } from "shared-ui/src";

type Props = {
  title: string;
  children: ReactNode;
};
export const Panel = ({ children, title }: Props) => {
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
      <MainTypography variant="h5">{title}</MainTypography>
      <WrapperBox>{children}</WrapperBox>
    </WrapperBox>
  );
};
