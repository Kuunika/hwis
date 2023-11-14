import { FC } from "react";
import { MainGrid, WrapperBox } from "shared-ui/src";
import { ListFormDataElements, MainSection } from ".";

export const ConfigureSectionScreen: FC = () => {
  return (
    <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
      <MainGrid container spacing={1}>
        <MainGrid item lg={6}>
          <MainSection />
        </MainGrid>
        <MainGrid item lg={1}>
          <ListFormDataElements />
        </MainGrid>
        <MainGrid item lg={5}></MainGrid>
      </MainGrid>
    </WrapperBox>
  );
};
