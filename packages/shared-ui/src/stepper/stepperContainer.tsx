import { Box } from "@mui/material";
import { FC, ReactNode, Children, isValidElement, cloneElement } from "react";
import { Step, Stepper } from ".";

type StepperContainerProp = {
  children: ReactNode[];
  active: number;
  steps: Step[];
};

export const StepperContainer: FC<StepperContainerProp> = ({
  children,
  active,
  steps,
}) => {
  const childrenArray = Children.toArray(children);

  //   const stepperChildren = childrenArray.map((child) => {
  //     if (isValidElement(child)) {
  //       return cloneElement(child, {
  //         ...child.props,
  //       });
  //     }
  //   });
  return (
    <Box>
      <Stepper steps={steps} active={active} />
      {childrenArray[active]}
    </Box>
  );
};
