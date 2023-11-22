import { SxProps } from "@mui/material";
import { defaultTheme } from "../theme/colors";

const Styles: { [key: string]: SxProps } = {
  circle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "20px",
    width: "20px",
    borderRadius: "10px",
    backgroundColor: defaultTheme.secondary,
    color: defaultTheme.white,
    mx: "5px",
  },
  active: {
    backgroundColor: defaultTheme.primary,
  },
  circleWithLabel: {
    display: "flex",
    alignItems: "start",
  },
  stepper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    my: "5px",
    width: "100%",
  },
};

export const stepperStyles = Styles;
