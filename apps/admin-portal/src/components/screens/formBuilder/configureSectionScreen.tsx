import { FC, useContext } from "react";
import { SideSectionList } from "../..";
import { MainGrid, MainTypography, WrapperBox } from "shared-ui/src";
import { SectionContext, SectionContextType } from "@/contexts";
import { ListFormDataElements, MainSection } from ".";

export const ConfigureSectionScreen: FC = () => {
  return (
    <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
      <MainGrid container spacing={1}>
        <MainGrid item lg={10}>
          <MainSection />
        </MainGrid>
        <MainGrid item lg={2}>
          <ListFormDataElements />
        </MainGrid>
      </MainGrid>
    </WrapperBox>
  );
};
