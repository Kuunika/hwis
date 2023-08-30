import { Box } from "@mui/material";
import { FC, ReactNode, Children } from "react";
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
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper steps={steps} active={active} />
      <Box sx={{ mx: "1ch", mt: "2ch" }}>{childrenArray[active]}</Box>
    </Box>
  );
};
