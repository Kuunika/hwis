import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { stepperStyles } from "./stepper.styles";

type CircleProp = {
  label: string | number;
  active: boolean;
  last?: boolean;
};

export const NewCircle: FC<CircleProp> = ({ label, active, last }) => {
  const styles = {
    ...(stepperStyles.circle ? stepperStyles.circle : {}),
    ...(active ? stepperStyles.active : {}),
  };

  return (
    <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
      <Box sx={styles}>
        <Typography variant="subtitle2">{label}</Typography>
      </Box>
      {!last && <Box sx={{ borderLeft: "2px solid green", height: "10px" }} />}
    </Box>
  );
};

type CircleLabelProp = {
  circleLabel: string | number;
  active: boolean;
  label: string;
  last?: boolean;
};

export const NewCircleWithLabel: FC<CircleLabelProp> = ({
  circleLabel,
  active,
  label,
  last,
}) => {
  return (
    <Box sx={stepperStyles.circleWithLabel}>
      <NewCircle label={circleLabel} active={active} last={last} />
      <Typography
        sx={{ display: { sm: active ? "block" : "none", md: "block" } }}
        variant="subtitle2"
        fontWeight={active ? "700" : "200"}
      >
        {label}
      </Typography>
    </Box>
  );
};
