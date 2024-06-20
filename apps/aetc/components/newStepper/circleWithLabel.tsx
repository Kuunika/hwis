import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { stepperStyles } from "./stepper.styles";
import { defaultTheme } from "../";

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
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "0em",
            textAlign: "left",
          }}
        >
          {label}
        </Typography>
      </Box>
      {!last && (
        <Box sx={{ borderLeft: "2px solid #B3B3B3", height: "24px" }} />
      )}
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
        sx={{
          font: "intel",
          fontSize: "16px",
          lineHeight: "24px",
          color: active ? defaultTheme.primary : "",
        }}
        variant="subtitle2"
        fontWeight={active ? "700" : "200"}
      >
        {label}
      </Typography>
    </Box>
  );
};
