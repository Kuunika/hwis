import { Box, SxProps, Typography } from "@mui/material";
import { FC } from "react";
import { stepperStyles } from "./stepper.styles";

type CircleProp = {
  label: string | number;
  active: boolean;
};

export const Circle: FC<CircleProp> = ({ label, active }) => {
  const activeStyles = active ? stepperStyles.active : ({} as SxProps);
  return (
    <Box sx={{ ...stepperStyles.circle, ...activeStyles }}>
      <Typography variant="h6">{label}</Typography>
    </Box>
  );
};

type CircleLabelProp = {
  circleLabel: string | number;
  active: boolean;
  label: string;
};

export const CircleWithLabel: FC<CircleLabelProp> = ({
  circleLabel,
  active,
  label,
}) => {
  return (
    <Box sx={stepperStyles.circleWithLabel}>
      <Circle label={circleLabel} active={active} />
      <Typography variant="h6" fontWeight={active ? "700" : "200"}>
        {label}
      </Typography>
    </Box>
  );
};
