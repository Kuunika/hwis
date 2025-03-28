"use client";
import { styled } from "@mui/material/styles";
import {
  FaAngleDown,
  FaAngleLeft,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ReactNode, useState, useEffect } from "react";
import {
  MainGrid,
  MainPaper,
  MainTypography,
  NewStepper,
  Step,
  StepperTablet,
  SubSteps,
  WrapperBox,
} from "..";
import { Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks";
import { getHumanReadableDateTime } from "@/helpers/dateTime";
import React from "react";

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
  showSubmittedStatus?: boolean;
}

export function NewStepperContainer({
  children,
  active,
  steps,
  title,
  setActive,
  onBack,
  showSubmittedStatus = false,
}: IProps) {
  const { patientId, activeVisitId } = getActivePatientDetails();
  const { data, isLoading, isRefetching } = getPatientsEncounters(
    patientId as string
  );

  const filteredChildren = children.filter((item) => item !== false);

  let indexToDelete: number[] = [];
  const subChildren = React.Children.toArray(children).filter((obj, key) => {
    if (React.isValidElement(obj) && obj.type === SubSteps) {
      indexToDelete.push(key);
      return true; 
    }
    return false;
  });

  indexToDelete.sort((a, b) => b - a).forEach((index) => {
    filteredChildren.splice(index, 1);
  });
  
  const subStepData = new Map<Number, string[]>();
  
  subChildren.forEach((subChild) => {
    if (React.isValidElement(subChild)) {
      const parent = subChild.props.parent;
      if (!subStepData.has(parent)) {
        subStepData.set(parent, []);
      }
      subStepData.get(parent)!.push(subChild.props.children);
    }
  });

  console.log(subStepData)
  const [encounterTimes, setEncounterTimes] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    if (showSubmittedStatus) {
      const updatedTimes: { [key: number]: string } = {};

      steps.forEach((step, index) => {
        const time = data
          ?.filter((d) => d.encounter_type.uuid === step.encounter)
          .filter((d) => d.visit_id === activeVisitId)?.[0]?.encounter_datetime;

        if (time) {
          updatedTimes[index] = time;
        }
      });

      setEncounterTimes(updatedTimes);
    }
  }, [data, steps, showSubmittedStatus]);

  return (
    <MainGrid container spacing={5}>
      {/* Sidebar Navigation */}
      <MainGrid sx={{ display: { xs: "none", lg: "block" } }} item lg={3}>
        <MainPaper elevation={0} sx={{ p: "1ch", width: "288px" }}>
          <MainTypography
            sx={{
              fontSize: "20px",
              fontWeight: 600,
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

      {/* Main Content */}
      <MainGrid item xs={10} lg={8}>
        <WrapperBox width={"100%"}>
          {/* Mobile Stepper */}
          <MainGrid item sx={{ display: { xs: "block", lg: "none" } }} xs={12}>
            <StepperTablet steps={steps} active={active} />
          </MainGrid>

          {/* Back Button */}
          <WrapperBox
            onClick={() => onBack && onBack()}
            sx={{ display: { lg: "flex", xs: "none" }, cursor: "pointer" }}
          >
            <MainTypography
              sx={{ width: "24px", height: "24px", fontSize: "20px" }}
            >
              <FaAngleLeft />
            </MainTypography>
            <MainTypography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "0em",
                textAlign: "left",
              }}
            >
              Back to Profile
            </MainTypography>
          </WrapperBox>

          {/* Step Accordions */}
          {steps.map((step, key) => (
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
              }}
              onChange={() => setActive && setActive(key)}
              expanded={key === active}
              key={key}
            >
              <AccordionSummary
                aria-controls={`panel${key + 1}-content`}
                id={`panel${key + 1}-header`}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    pr: "2ch",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "24px",
                      fontWeight: 700,
                      textAlign: "left",
                    }}
                  >
                    {step.label}
                  </Typography>

                  {/* Encounter Status with Aligned Icons */}
                  {showSubmittedStatus && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.5rem",

                        width: "30%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {isLoading || (isRefetching && active - 1 === key) ? (
                          <FaSpinner
                            size={"20px"}
                            style={{
                              animation: "spin 1s linear infinite",
                              color: "gray",
                            }}
                          />
                        ) : (
                          <FaCheckCircle
                            size={"20px"}
                            color={encounterTimes[key] ? "green" : "gray"}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: encounterTimes[key] ? "green" : "gray",
                          minWidth: "120px", // Ensure alignment
                          textAlign: "left",
                          fontStyle: "italic",
                        }}
                      >
                        {getHumanReadableDateTime(encounterTimes[key]) ||
                          "not submitted"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>{filteredChildren[key]}</AccordionDetails>
                {subStepData.has(key) &&
                  subStepData.get(key)?.map((substep, index) => (
                    <AccordionDetails key={index}>{substep}</AccordionDetails>
                  ))}
            </Accordion>
          ))}
        </WrapperBox>
      </MainGrid>
    </MainGrid>
  );
}
