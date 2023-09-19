"use client";
import { useState, useContext } from "react";
import { StepperContainer, WrapperBox } from "shared-ui/src";
import { Form, SectionForm, SectionList } from "./components";
import { ConfigureSectionScreen } from "./components/screens";
import { SectionContext, SectionContextType } from "../contexts";

export default function Page() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { sections, addSection, deleteSection, addFormName } = useContext(
    SectionContext
  ) as SectionContextType;

  const steps = [
    { id: 1, label: "Create Form" },
    { id: 2, label: "Create Sections" },
    { id: 3, label: "Configure Sections" },
  ];

  const handleFormCreate = (values: any) => {
    addFormName(values.name);
    setActiveStep(1);
  };
  const handleSectionSubmit = (values: any, { resetForm }: any) => {
    addSection(values);
    resetForm();
  };

  const handleNextSection = () => {
    if (sections.length == 0) return;
    setActiveStep(2);
  };

  return (
    <WrapperBox mt={10}>
      <StepperContainer active={activeStep} steps={steps}>
        <Form onSubmit={handleFormCreate} />
        <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
          <SectionForm
            onSubmit={handleSectionSubmit}
            onNextSection={handleNextSection}
          />
          <SectionList sections={sections} onDelete={deleteSection} />
        </WrapperBox>
        <ConfigureSectionScreen />
      </StepperContainer>
    </WrapperBox>
  );
}
