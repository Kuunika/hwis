import { ReactNode } from "react";
import { MainGrid, MainPaper, MainTypography } from "shared-ui/src";
import { BackButton } from "../buttons";

type Prop = {
  children: ReactNode;
  title: string;
  leftGridSize?: number;
  middleGridSize?: number;
  rightGridSize?: number;
  rightChildComponent?: ReactNode;
};

export function MiddlePageLayout({
  children,
  title,
  rightChildComponent,
  leftGridSize = 2,
  middleGridSize = 7,
  rightGridSize = 3,
}: Prop) {
  return (
    <MainGrid container spacing={1}>
      <MainGrid item lg={leftGridSize}></MainGrid>
      <MainGrid item lg={middleGridSize}>
        <MainPaper elevation={0} sx={{ padding: "2ch", mt: "2ch" }}>
          <BackButton />
          <br />
          <MainTypography variant="h4" color={"gray"}>
            {title}
          </MainTypography>
          <br />
          {children}
        </MainPaper>
      </MainGrid>
      <MainGrid item lg={rightGridSize}>
        {rightChildComponent}
      </MainGrid>
    </MainGrid>
  );
}
