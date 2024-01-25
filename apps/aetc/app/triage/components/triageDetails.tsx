import { MainPaper, MainTypography, WrapperBox } from "shared-ui/src";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { FaAngleDown } from "react-icons/fa";
import { useContext } from "react";
import { TriageContext, TriageContextType } from "@/contexts";

const vitals = [
  { name: "Respiratory Rate", value: "12 breaths per minute" },
  { name: "Heart Rate", value: "11 beats per minute" },
  { name: "Temperature", value: "37 degrees Celsius" },
  { name: "Blood Pressure Systolic", value: "120 mmHg" },
  { name: "Blood Pressure Diastolic", value: "80 mmHg" },
  { name: "Pulse Rate", value: "70 beats per minute" },
  { name: "Pulse Oximetry", value: "98%" },
  { name: "Eye Opening Response", value: "To Speech" },
  { name: "Motor Response", value: "Obeying commands" },
  { name: "Verbal Response", value: "Confused speech" },
  { name: "AVPU", value: "Awake and responsive" },
  { name: "Glucose", value: "120 mg/dL" },
];
const airway = [
  { name: "Oxygen Stats < 89", value: "Yes" },
  { name: "Respiratory Rate < 8 or > 31", value: "No" },
  { name: "Severe Respiratory dysfunction or exhaustion", value: "Yes" },
  { name: "Inability to speak in complete sentences", value: "No" },
  { name: "Stridor", value: "Yes" },
  { name: "Reduced Level of Consciousness due to low oxygen", value: "No" },
  { name: "Oxygen Sats 90-92%", value: "No" },
  { name: "Respiratory Rate > 9 or 21-30", value: "Yes" },
];

const circulation = [
  { name: "Is Circulation Abnormal", value: "No" },
  {
    name: "Heart Rate <50 >120 or Systolic Blood Pressure <70 >180",
    value: "Yes",
  },
  { name: "Weak, Thready, Bounding or regular/irregular pulse", value: "No" },
  { name: "Reduced urinary output < 30ml/hr", value: "Yes" },
  { name: "Cool clammy peripherals or cap refill > 4 seconds", value: "No" },
  { name: "Temperature", value: "Yes" },
  { name: "Hemorrhage", value: "Yes" },
  { name: "Dehydration skin turgor, sunken eyes", value: "No" },
  { name: "Heart Rate <50, >60 or 100-110", value: "Yes" },
  { name: "Temperature 37-38C", value: "No" },
];

const consciousness = [
  { name: "reduced consciousness", value: "yes" },
  { name: "Blood Glucose", value: "120 mg/dL" },
  { name: "GSC", value: "120 mg/dL" },
];

const persistentPain = [
  { name: "Active Seizures", value: "No" },
  { name: "Focal Neurologic Findings", value: "Yes" },
  { name: "Headache", value: "Yes" },
  { name: "Weakness", value: "No" },
  { name: "Severe Pain", value: "Yes" },
  {
    name: "Moderate Pain or a Reason to be Seen in Under Four Hours",
    value: "No",
  },
];

const triageResults = [
  { name: "Vitals", values: vitals },
  { name: "Persistent Pain", values: persistentPain },
  { name: "Consciousness", values: consciousness },
  { name: "Airway", values: airway },
  { name: "Circulation", values: circulation },
];
export const ViewTriageResults = () => {
  const { show } = useContext(TriageContext) as TriageContextType;

  if (!show) {
    return <></>;
  }
  return (
    <MainPaper elevation={0} sx={{ padding: "2ch" }}>
      {triageResults.map((result) => {
        return (
          <>
            <Accordion elevation={0}>
              <AccordionSummary
                expandIcon={<FaAngleDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <MainTypography variant="h6">{result.name}</MainTypography>
              </AccordionSummary>
              <AccordionDetails>
                {result.values.map((value) => {
                  return (
                    <WrapperBox sx={{ display: "flex", my: "2ch" }}>
                      <MainTypography
                        fontSize={"0.8rem"}
                        width={"20ch"}
                        fontWeight={"600"}
                      >
                        {value.name}{" "}
                      </MainTypography>
                      <MainTypography fontSize={"0.8rem"}>
                        {value.value}
                      </MainTypography>
                    </WrapperBox>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          </>
        );
      })}
    </MainPaper>
  );
};
