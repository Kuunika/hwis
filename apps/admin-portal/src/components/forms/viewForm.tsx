import { useState, useContext, useEffect } from "react";
import { Form } from "@/services";
import { MainTypography, StepperContainer } from "shared-ui/src";
import { FormFragment } from "@/app/build-form/view/formFragment";
import { FormBuilderContext, FormBuilderContextType } from "@/contexts";

type IProps = {
  form: Form;
};

export const ViewForm = ({ form }: IProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { setFragment, fragment } = useContext(
    FormBuilderContext
  ) as FormBuilderContextType;

  const steps = form.fragments.map((fd, index) => ({
    id: index + 1,
    label: fd.fragmentName,
  }));

  useEffect(() => {
    setFragment(form.fragments[0]);
  }, [form]);

  console.log("fragment", fragment);

  const handleSubmit = (values: any) => {
    console.log({ values });
  };

  if (Object.keys(fragment).length == 0) {
    return <></>;
  }

  return (
    <>
      <MainTypography variant="h4">{form.name}</MainTypography>
      <StepperContainer steps={steps} active={activeStep}>
        {form.fragments.map((fg, index) => (
          <FormFragment
            key={fg.fragmentName}
            frag={fragment}
            onSubmit={(values: any) => {
              handleSubmit(values);
              setFragment(form.fragments[index + 1]);
              setActiveStep(index + 1);
            }}
          />
        ))}
      </StepperContainer>
    </>
  );
};
