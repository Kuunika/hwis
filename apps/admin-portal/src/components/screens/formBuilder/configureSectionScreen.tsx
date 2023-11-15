import { FC, useContext } from "react";
import { MainGrid, WrapperBox } from "shared-ui/src";
import { ListFormDataElements, MainSection } from ".";
import ViewForm from "@/app/forms/view/page";
import { ViewFormFragment } from "@/components";
import { SectionContextType, SectionContext } from "@/contexts";

export const ConfigureSectionScreen: FC = () => {
  const { formDataElements, formName, resetContext } = useContext(
    SectionContext
  ) as SectionContextType;

  const form = { id: "", formName, formInputs: formDataElements };

  return (
    <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
      <MainGrid container spacing={1}>
        <MainGrid item lg={6}>
          <WrapperBox sx={{ px: "2ch" }}>
            <MainSection />
          </WrapperBox>
        </MainGrid>
        <MainGrid item lg={1}>
          <ListFormDataElements />
        </MainGrid>
        <MainGrid item lg={5}>
          <WrapperBox sx={{ px: "2ch" }}>
            <ViewFormFragment
              frag={form}
              onSubmit={(values: any) => console.log({ values })}
            />
          </WrapperBox>
        </MainGrid>
      </MainGrid>
    </WrapperBox>
  );
};
