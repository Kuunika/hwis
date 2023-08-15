import { Box } from "@mui/material";
import { FC } from "react";
import { CircleWithLabel } from "./circleWithLabel";
import { stepperStyles } from "./stapper.styles";

type Step = {
  id: string | number;
  label: string;
  active: boolean;
};
type StepperProp = {
  steps: Step[];
};

export const Stepper: FC<StepperProp> = ({ steps }) => {
  return (
    <Box sx={stepperStyles.stepper}>
      {steps.map((step, key) => (
        <CircleWithLabel
          key={step.id}
          label={step.label}
          circleLabel={key + 1}
          active={step.active}
        />
      ))}
    </Box>
  );
};
