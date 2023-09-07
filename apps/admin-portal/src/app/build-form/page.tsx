"use client";
import { useState } from "react";
import { StepperContainer, WrapperBox } from "shared-ui/src";
import { Form, Section, SectionForm, SectionList } from "./components";
import { v4 as uuidv4 } from "uuid";
import { ConfigureSectionScreen } from "./components/screens";

export default function Page() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [sections, setSections] = useState<Section[]>([]);
  const steps = [
    { id: 1, label: "Create Form" },
    { id: 2, label: "Create Sections" },
    { id: 3, label: "Configure Sections" },
  ];

  const handleFormCreate = (values: any) => {
    setActiveStep(1);
  };
  const handleSectionSubmit = (values: any, { resetForm }: any) => {
    setSections((sects: any) => [...sects, { id: uuidv4(), ...values }]);
    resetForm();
  };

  const handleDeleteSection = (id: string) => {
    setSections((sects) => sects.filter((s) => s.id !== id));
  };

  return (
    <WrapperBox mt={10}>
      <StepperContainer active={activeStep} steps={steps}>
        <Form onSubmit={handleFormCreate} />
        <>
          <SectionForm
            onSubmit={handleSectionSubmit}
            onNextSection={() => setActiveStep(2)}
          />
          <SectionList sections={sections} onDelete={handleDeleteSection} />
        </>
        <ConfigureSectionScreen sections={sections} />
      </StepperContainer>
    </WrapperBox>
  );
}
