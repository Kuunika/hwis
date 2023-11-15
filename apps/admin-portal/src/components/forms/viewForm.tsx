import { useState, useContext, useEffect } from "react";
import { WorkFlow } from "@/services";
import { MainTypography, StepperContainer } from "shared-ui/src";
import { FormFragment } from "@/app/build-form/view/formFragment";
import { FormBuilderContext, FormBuilderContextType } from "@/contexts";

type IProps = {
  workflow: WorkFlow;
};

export const ViewForm = ({ workflow }: IProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { setFragment, fragment } = useContext(
    FormBuilderContext
  ) as FormBuilderContextType;

  const steps = workflow.forms.map((fd, index) => ({
    id: index + 1,
    label: fd.formName,
  }));

  useEffect(() => {
    setFragment(workflow.forms[0]);
  }, [workflow]);

  const handleSubmit = (values: any) => {
    console.log({ values });
  };

  if (Object.keys(fragment).length == 0) {
    return <></>;
  }

  return (
    <>
      <MainTypography variant="h4">{workflow.name}</MainTypography>
      <br />
      <br />
      <StepperContainer
        sx={{ alignItems: "flex-start" }}
        steps={steps}
        active={activeStep}
        containerSx={{ justifyContent: "flex-start" }}
      >
        {workflow.forms.map((fg, index) => (
          <FormFragment
            key={fg.formName}
            frag={fragment}
            onSubmit={(values: any) => {
              handleSubmit(values);
              setFragment(workflow.forms[index + 1]);
              setActiveStep(index + 1);
            }}
          />
        ))}
      </StepperContainer>
    </>
  );
};
