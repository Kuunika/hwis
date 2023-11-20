import { ReactNode } from "react";
import { MainGrid, MainPaper, MainTypography } from "shared-ui/src";
import { BackButton } from "../buttons";

type Prop = {
  children: ReactNode;
  title: string;
};

export function MiddlePageLayout({ children, title }: Prop) {
  return (
    <MainGrid container spacing={1}>
      <MainGrid item lg={2}></MainGrid>
      <MainGrid item lg={7}>
        <MainPaper elevation={0} sx={{ padding: "2ch", mt: "2ch" }}>
          <BackButton />
          <br />
          <MainTypography variant="h3" color={"gray"}>
            {title}
          </MainTypography>
          <br />
          {children}
        </MainPaper>
      </MainGrid>
    </MainGrid>
  );
}
