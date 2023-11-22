import * as React from "react";
import { styled } from "@mui/material/styles";
import { FaAngleDown } from "react-icons/fa";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
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
}

export function CustomizedAccordions({
  children,
  active,
  steps,
  title,
}: IProps) {
  return (
    <MainGrid container spacing={5}>
      <MainGrid item lg={4}>
        <MainPaper elevation={0} sx={{ width: "100%", p: "1ch" }}>
          <MainTypography variant="h4">{title}</MainTypography>
          <NewStepper steps={steps} active={active} />
        </MainPaper>
      </MainGrid>
      <MainGrid item lg={8}>
        <WrapperBox width={"100%"}>
          {children.map((child, key) => {
            return (
              <Accordion expanded={key == active}>
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
