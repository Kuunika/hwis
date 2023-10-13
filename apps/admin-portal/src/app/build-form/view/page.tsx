"use client";
import { useState, useContext, useEffect } from "react";

import {
  MainButton,
  MainCard,
  MainTypography,
  StepperContainer,
} from "shared-ui/src";
import { FormFragment } from "./formFragment";
import {
  FormBuilderContext,
  FormBuilderContextType,
  Section,
  SectionContext,
  SectionContextType,
} from "@/contexts";
import { useRouter } from "next/navigation";

export default function FormStepper() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { setFragment, fragment } = useContext(
    FormBuilderContext
  ) as FormBuilderContextType;

  const { sections, formName } = useContext(
    SectionContext
  ) as SectionContextType;
  const router = useRouter();

  const draftSections = JSON.parse(JSON.stringify(sections)) as Section[];

  useEffect(() => {
    setFragment(draftSections[0]);
  }, []);

  const steps = draftSections.map((fd, index) => ({
    id: index + 1,
    label: fd.fragmentName,
  }));

  const handleSubmit = (values: any) => {};

  if (Object.keys(fragment).length == 0) {
    return <></>;
  }
  return (
    <>
      <MainButton
        title="Return to Editing"
        variant="secondary"
        onClick={() => router.back()}
      />
      <br />
      <MainCard
        elevation={2}
        sx={{
          mx: "2ch",
          my: "2ch",
          alignItems: "center",
        }}
      >
        <MainTypography variant="h4">{formName}</MainTypography>
        <StepperContainer steps={steps} active={activeStep}>
          {draftSections.map((fg, index) => (
            <FormFragment
              key={fg.id}
              frag={fragment}
              onSubmit={(values: any) => {
                handleSubmit(values);
                setFragment(draftSections[index + 1]);
                setActiveStep(index + 1);
              }}
            />
          ))}
        </StepperContainer>
      </MainCard>
    </>
  );
}
