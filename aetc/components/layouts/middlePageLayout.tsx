import { ReactNode } from "react";
import { MainGrid, MainPaper, MainTypography } from "@/components";
import { BackButton } from "../buttons";

type Prop = {
  children: ReactNode;
  title: string;
  leftGridSize?: number;
  middleGridSize?: number;
  rightGridSize?: number;
  leftChildComponent?: ReactNode;
  rightChildComponent?: ReactNode;
};

export function MiddlePageLayout({
  children,
  title,
  rightChildComponent,
  leftChildComponent,
  leftGridSize = 2,
  middleGridSize = 7,
  rightGridSize = 3,
}: Prop) {
  return (
    <MainGrid container spacing={1}>
      <MainGrid item lg={leftGridSize} md={1}>
        {leftChildComponent}
      </MainGrid>
      <MainGrid
        item
        lg={middleGridSize}
        md={10}
        sx={{
          padding: "2ch",
          mt: "2ch",
          width: "100%",
        }}
      >
        <MainPaper
          elevation={0}
          sx={{
            padding: "2ch",
            mt: "2ch",
          }}
        >
          <BackButton />
          <br />
          <MainTypography variant="h4" color={"gray"}>
            {title}
          </MainTypography>
          <br />
          {children}
        </MainPaper>
      </MainGrid>
      <MainGrid item lg={rightGridSize} md={1}>
        {rightChildComponent}
      </MainGrid>
    </MainGrid>
  );
}
