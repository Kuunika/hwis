"use client";
import { useContext } from "react";
import { SectionContext, SectionContextType } from "@/contexts";
import { WrapperBox, MainTypography } from "shared-ui/src";
import { FormDataElementContainer } from ".";

export const FormDataElements = () => {
  const { formDataElements } = useContext(SectionContext) as SectionContextType;

  return (
    <WrapperBox sx={{ width: "100%" }}>
      <br />
      <MainTypography variant="h6">Form inputs</MainTypography>

      {formDataElements?.map((dataElement) => (
        <FormDataElementContainer
          key={dataElement.id}
          formDataElement={dataElement}
        />
      ))}
    </WrapperBox>
  );
};
