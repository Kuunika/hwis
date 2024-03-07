import { styled } from "@mui/material/styles";
import { FaAngleDown } from "react-icons/fa";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { FaAngleLeft } from "react-icons/fa";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";
import {
  MainGrid,
  MainPaper,
  MainTypography,
  NewStepper,
  Step,
  StepperTablet,
  WrapperBox,
} from "..";
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<FaAngleDown />} {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

interface IProps {
  children: ReactNode[];
  active: number;
  steps: Step[];
  title: string;
  setActive?: (value: any) => void;
  onBack?: () => void;
}

export function NewStepperContainer({
  children,
  active,
  steps,
  title,
  setActive,
  onBack,
}: IProps) {
  return (
    <MainGrid container spacing={5}>
      <MainGrid sx={{ display: { xs: "none", lg: "block" } }} item lg={3}>
        <MainPaper elevation={0} sx={{ p: "1ch", width: "288px" }}>
          <MainTypography
            sx={{
              fontFamily: "Inter",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: "0em",
              textAlign: "left",
              ml: "2ch",
              my: "2ch",
            }}
          >
            {title}
          </MainTypography>
          <NewStepper steps={steps} active={active} />
        </MainPaper>
      </MainGrid>

      <MainGrid item xs={1} lg={0}></MainGrid>

      <MainGrid item xs={10} lg={8}>
        <WrapperBox width={"100%"}>
          <MainGrid item sx={{ display: { xs: "block", lg: "none" } }} xs={12}>
            <StepperTablet steps={steps} active={active} />
          </MainGrid>
          <WrapperBox
            onClick={() => onBack && onBack()}
            sx={{ display: { lg: "flex", xs: "none" }, cursor: "pointer" }}
          >
            <MainTypography
              sx={{
                width: "24px",
                height: "24px",
                fontSize: "20px",
                fontWeight: 400,
              }}
            >
              <FaAngleLeft />
            </MainTypography>
            <MainTypography
              sx={{
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "0em",
                textAlign: "left",
              }}
            >
              Back
            </MainTypography>
          </WrapperBox>
          {children.map((child, key) => {
            return (
              <Accordion
                sx={{
                  my: "2ch",
                  backgroundColor: "whitesmoke",
                  borderStyle: "none",
                  "& .MuiAccordionSummary-root": {
                    backgroundColor: "whitesmoke",
                    display: "flex",
                    flexDirection: "row",
                    borderBottom: "solid 0.2ch #B3B3B3",
                  },
                  "& .css-1betqn-MuiAccordionSummary-content p": {
                    fontFamily: "Inter",
                    fontSize: "24px",
                    fontWeight: 700,
                    lineHeight: "29px",
                    letterSpacing: "0em",
                    textAlign: "left",
                  },
                }}
                onChange={() => {
                  if (setActive) {
                    setActive(key);
                  }
                }}
                expanded={key == active}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <Typography>{steps[key].label}</Typography>
                </AccordionSummary>
                <AccordionDetails>{child}</AccordionDetails>
              </Accordion>
            );
          })}
        </WrapperBox>
      </MainGrid>
    </MainGrid>
  );
}
