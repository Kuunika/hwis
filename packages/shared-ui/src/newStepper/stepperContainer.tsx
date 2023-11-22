import { Box, SxProps } from "@mui/material";
import { FC, ReactNode, Children } from "react";
import { Step, Stepper } from ".";

type StepperContainerProp = {
  children: ReactNode[];
  active: number;
  steps: Step[];
  sx?: SxProps;
  containerSx?: SxProps;
};

export const NewStepperContainer: FC<StepperContainerProp> = ({
  children,
  active,
  steps,
  sx,
  containerSx,
}) => {
  const childrenArray = Children.toArray(children);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...sx,
      }}
    >
      <Stepper steps={steps} active={active} />
      <Box
        sx={{
          mx: "1ch",
          mt: "2ch",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          ...containerSx,
        }}
      >
        {childrenArray[active]}
      </Box>
    </Box>
  );
};
