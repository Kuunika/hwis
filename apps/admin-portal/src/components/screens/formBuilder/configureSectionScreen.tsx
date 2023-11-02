import { FC, useContext } from "react";
import { SideSectionList } from "../..";
import { MainGrid, MainTypography, WrapperBox } from "shared-ui/src";
import { SectionContext, SectionContextType } from "@/contexts";
import { ListFormDataElements, MainSection } from ".";

export const ConfigureSectionScreen: FC = () => {
  const { sections } = useContext(SectionContext) as SectionContextType;
  const section = sections.find((s) => s.active);
  return (
    <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
      <MainTypography variant="h4" alignSelf={"center"} mb={"2ch"}>
        {section?.fragmentName} Section
      </MainTypography>
      <MainGrid container spacing={1}>
        <MainGrid item lg={2}>
          <SideSectionList />
        </MainGrid>
        <MainGrid item lg={8}>
          <MainSection />
        </MainGrid>
        <MainGrid item lg={2}>
          <ListFormDataElements />
        </MainGrid>
      </MainGrid>
    </WrapperBox>
  );
};
