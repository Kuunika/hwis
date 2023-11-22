import { Box } from "@mui/material";
import { FC } from "react";
import { NewCircleWithLabel } from "./circleWithLabel";
import { stepperStyles } from "./stepper.styles";

export type Step = {
  id: string | number;
  label: string;
};
type StepperProp = {
  steps: Step[];
  active: number;
};

export const NewStepper: FC<StepperProp> = ({ steps, active }) => {
  return (
    <Box sx={stepperStyles.stepper}>
      {steps.map((step, key) => (
        <NewCircleWithLabel
          key={step.id}
          label={step.label}
          circleLabel={key + 1}
          active={key == active}
          last={steps.length - 1 == key}
        />
      ))}
    </Box>
  );
};
