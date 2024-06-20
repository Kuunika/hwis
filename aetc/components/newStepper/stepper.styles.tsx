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
    border: "solid 1px #636363",
    color: "#636363",
    mx: "5px",
  },
  active: {
    backgroundColor: defaultTheme.primary,
    color: defaultTheme.white,
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
