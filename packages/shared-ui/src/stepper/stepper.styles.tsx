import { SxProps } from "@mui/material";
import { defaultTheme } from "../theme/colors";

const Styles: { [key: string]: SxProps } = {
  circle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "30px",
    width: "30px",
    borderRadius: "15px",
    backgroundColor: defaultTheme.secondary,
    color: defaultTheme.secondaryFontColor,
    mx: "5px",
  },
  active: {
    backgroundColor: defaultTheme.primaryDark,
  },
  circleWithLabel: {
    display: "flex",
    alignItems: "center",
  },
  stepper: {
    display: "flex",
    alignItems: "center",
    my: "5px",
  },
};

export const stepperStyles = Styles;
