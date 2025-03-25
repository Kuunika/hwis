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
import { Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails, useParameters } from "@/hooks";

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
  const { patientId, activeVisit, activeVisitId } = getActivePatientDetails();
  const { data, isLoading, isRefetching, isPending, isFetching } =
    getPatientsEncounters(patientId as string);

  // Map children to steps to ensure order consistency
  const filteredChildren = children.filter((child) => child !== false);
  const validChildren = steps.map((step, index) => filteredChildren[index]);

  const checkIfEncounterSubmitted = (encounterType: string) => {
    const found = data
      ?.filter((d) => {
        return d.encounter_type.uuid == encounterType;
      })
      .filter((d) => d.visit_id == activeVisitId);

    return Boolean(found?.length);
  };

  return (
    <MainGrid container spacing={5}>
      <MainGrid sx={{ display: { xs: "none", lg: "block" } }} item lg={3}>
        <MainPaper elevation={0} sx={{ p: "1ch", width: "288px" }}>
          <MainTypography
            sx={{
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
          {validChildren.map((child, key) => {
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
                }}
                onChange={() => {
                  if (setActive) {
                    setActive(key);
                  }
                }}
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
                        lineHeight: "29px",
                        letterSpacing: "0em",
                        textAlign: "left",
                      }}
                    >
                      {steps[key]?.label}
                    </Typography>
                    {showSubmittedStatus && (
                      <Typography>
                        {isLoading || (isRefetching && active - 1 == key) ? (
                          <FaSpinner
                            size={"2.5ch"}
                            style={{
                              animation: "spin 1s linear infinite",
                            }}
                          />
                        ) : (
                          <FaCheckCircle
                            size={"2.5ch"}
                            color={
                              checkIfEncounterSubmitted(
                                steps[key]?.encounter as string
                              )
                                ? "green"
                                : "gray"
                            }
                          />
                        )}
                      </Typography>
                    )}
                  </Box>
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
