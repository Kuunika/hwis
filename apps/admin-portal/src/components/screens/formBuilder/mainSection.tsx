import { useContext } from "react";
import { AddFormDataElement } from "@/components";
import { SectionContext, SectionContextType } from "@/contexts";
import { WrapperBox } from "shared-ui/src";
import { FormDataElements } from ".";

export const MainSection = () => {
  const { addElement } = useContext(SectionContext) as SectionContextType;

  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
        px: "1ch",
      }}
    >
      <AddFormDataElement onSubmit={(values: any) => addElement(values)} />
      <FormDataElements />
    </WrapperBox>
  );
};
