import { useEffect, useContext, useState } from "react";
import { Section, SectionContext, SectionContextType } from "@/contexts";
import { WrapperBox, MainTypography } from "shared-ui/src";
import { FormDataElementContainer } from ".";

export const FormDataElements = () => {
  const [section, setSection] = useState<Section>();
  const { getActiveSection, sections } = useContext(
    SectionContext
  ) as SectionContextType;

  useEffect(() => {
    const sect = getActiveSection();

    if (!sect) return;

    setSection(sect);
  }, [sections]);

  return (
    <WrapperBox sx={{ width: "100%" }}>
      <br />
      <MainTypography variant="h5">Form Data Elements</MainTypography>
      <br />
      {section?.formDataElements?.map((dataElement) => (
        <FormDataElementContainer
          key={dataElement.id}
          formDataElement={dataElement}
        />
      ))}
    </WrapperBox>
  );
};
