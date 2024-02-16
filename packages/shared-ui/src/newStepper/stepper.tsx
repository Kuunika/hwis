import { Box } from "@mui/material";
import { FC } from "react";
import { NewCircleWithLabel } from "./circleWithLabel";
import { stepperStyles } from "./stepper.styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

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

export const StepperTablet: FC<StepperProp> = ({ steps, active }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={active} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
