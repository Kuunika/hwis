import { ReactNode } from "react";
import { MainTypography, WrapperBox } from "shared-ui/src";

type Props = {
  title: string;
  children: ReactNode;
};
export const Panel = ({ children, title }: Props) => {
  return (
    <WrapperBox>
      <MainTypography>{title}</MainTypography>
      <WrapperBox>{children}</WrapperBox>
    </WrapperBox>
  );
};
