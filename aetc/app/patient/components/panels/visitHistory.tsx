import { Paper, Typography } from "@mui/material";
import { VisitTable } from "../visits";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useVisitDates } from "@/contexts/visitDatesContext";

import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";

// Styled components for accordion
const Accordion = styled(MuiAccordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": { borderBottom: 0 },
  "&::before": { display: "none" },
  disableGutters: true,
  elevation: 0,
  square: true,
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles?.("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export const VisitHistory = () => {
  const { patientId }: { patientId: any } = getActivePatientDetails();
  const { data: patientHistory, isLoading: historyLoading } =
    getPatientsEncounters(patientId);

  const { visitDate } = useVisitDates();
  const [filteredEncounters, setFilteredEncounter] = useState([]);
  const [expanded, setExpanded] = useState("panel1");

  // Filter encounters when patientHistory or visitDate changes
  useEffect(() => {
    if (!historyLoading && patientHistory && visitDate) {
      const filtered: any = patientHistory.filter(
        (encounter: any) => encounter.visit.date_started === visitDate
      );
      setFilteredEncounter(filtered);
    }
  }, [patientHistory, visitDate, historyLoading]);

  // Get the most recent observations for each concept
  const processObservations = (obs: any) => {
    const latestObsMap = new Map();

    // Find the most recent observation for each concept_id
    obs.forEach((observation: any) => {
      const { concept_id, obs_datetime } = observation;
      const currentLatest = latestObsMap.get(concept_id);

      if (
        !currentLatest ||
        new Date(obs_datetime) > new Date(currentLatest.obs_datetime)
      ) {
        latestObsMap.set(concept_id, observation);
      }
    });

    // Mark observations as latest or with reference to the latest
    return obs.map((observation: any) => {
      const { concept_id, obs_id } = observation;
      const latestObsId = latestObsMap.get(concept_id).obs_id;
      return {
        ...observation,
        managerId: latestObsId === obs_id ? null : latestObsId,
      };
    });
  };

  // Filter encounters by type and process observations
  const getEncountersByType = (encounterTypeUuid: any) => {
    if (!visitDate) return [];

    const encounter: any = filteredEncounters.find(
      (d: any) => d?.encounter_type?.uuid === encounterTypeUuid
    );

    return encounter ? processObservations(encounter.obs || []) : [];
  };

  if (historyLoading) {
    return <ProfilePanelSkeletonLoader />;
  }

  // Define encounter data for each accordion panel
  const encounterData = {
    panel1: {
      title: "Initial Registration",
      data: getEncountersByType(encounters.INITIAL_REGISTRATION),
    },
    panel2: {
      title: "Screening",
      data: getEncountersByType(encounters.SCREENING_ENCOUNTER),
    },
    panel3: {
      title: "Social History",
      data: getEncountersByType(encounters.SOCIAL_HISTORY),
    },
    panel4: {
      title: "Referral",
      data: getEncountersByType(encounters.REFERRAL),
    },
    panel5: {
      title: "Financing",
      data: getEncountersByType(encounters.FINANCING),
    },
    panel6: {
      title: "Presenting Complaints",
      data: getEncountersByType(encounters.PRESENTING_COMPLAINTS),
    },
    panel7: {
      title: "Vitals",
      data: getEncountersByType(encounters.VITALS),
    },
    panel8: {
      title: "Airway Assessment",
      data: getEncountersByType(encounters.AIRWAY_ASSESSMENT),
    },
    panel9: {
      title: "Blood Circulation",
      data: getEncountersByType(encounters.BLOOD_CIRCULATION),
    },
    panel10: {
      title: "Disability Assessment",
      data: getEncountersByType(encounters.DISABILITY_ASSESSMENT),
    },
    panel11: {
      title: "Persistent Pain",
      data: getEncountersByType(encounters.PERSISTENT_PAIN),
    },
    panel12: {
      title: "Triage Result",
      data: getEncountersByType(encounters.TRIAGE_RESULT),
    },
    panel13: {
      title: "Chest Assessment",
      data: getEncountersByType(encounters.CHEST_ASSESSMENT),
    },
    panel14: {
      title: "Abdomen and Pelvis Assessment",
      data: getEncountersByType(encounters.ABDOMEN_AND_PELVIS_ASSESSMENT),
    },
    panel15: {
      title: "Extremities Assessment",
      data: getEncountersByType(encounters.EXTREMITIES_ASSESSMENT),
    },
    panel16: {
      title: "Neurological Examination",
      data: getEncountersByType(encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT),
    },
    panel17: {
      title: "General Information",
      data: getEncountersByType(encounters.GENERAL_INFORMATION_ASSESSMENT),
    },
    panel18: {
      title: "Head and Neck Assessment",
      data: getEncountersByType(encounters.HEAD_AND_NECK_ASSESSMENT),
    },
    panel19: {
      title: "Medical History",
      data: getEncountersByType(encounters.MEDICAL_HISTORY),
    },
    panel20: {
      title: "Obstetric History",
      data: getEncountersByType(encounters.OBSTETRIC_HISTORY),
    },
    panel21: {
      title: "Prescriptions",
      data: getEncountersByType(encounters.PRESCRIPTIONS),
    },
    panel22: {
      title: "Allergies",
      data: getEncountersByType(encounters.ALLERGIES),
    },
    panel23: {
      title: "Diagnosis",
      data: getEncountersByType(encounters.DIAGNOSIS),
    },
    panel24: {
      title: "Surgical History",
      data: getEncountersByType(encounters.SURGICAL_HISTORY),
    },
    panel25: {
      title: "Patient Admissions",
      data: getEncountersByType(encounters.PATIENT_ADMISSIONS),
    },
    panel26: {
      title: "Summary Assessment",
      data: getEncountersByType(encounters.SUMMARY_ASSESSMENT),
    },
    panel27: {
      title: "CPR",
      data: getEncountersByType(encounters.CPR),
    },
    panel28: {
      title: "Bedside Test",
      data: getEncountersByType(encounters.BED_SIDE_TEST),
    },
    panel29: {
      title: "Discharge Patient",
      data: getEncountersByType(encounters.DISCHARGE_PATIENT),
    },
    panel30: {
      title: "Treatment",
      data: getEncountersByType(encounters.TREATMENT),
    },
    panel31: {
      title: "Non-Pharmacological Treatment",
      data: getEncountersByType(encounters.NON_PHARMACOLOGICAL),
    },
    panel32: {
      title: "Patient Care Area",
      data: getEncountersByType(encounters.PATIENT_CARE_AREA),
    },
    panel33: {
      title: "Dispensing",
      data: getEncountersByType(encounters.DISPENSING),
    },
    panel34: {
      title: "Family Medical History",
      data: getEncountersByType(encounters.FAMILY_MEDICAL_HISTORY),
    },
    panel35: {
      title: "Review of Systems",
      data: getEncountersByType(encounters.REVIEW_OF_SYSTEMS),
    },
    panel36: {
      title: "Airway and Breathing",
      data: getEncountersByType(encounters.AIRWAY_BREATHING),
    },
    panel37: {
      title: "Consciousness",
      data: getEncountersByType(encounters.CONSCIOUSNESS),
    },
    panel38: {
      title: "Clinical Notes",
      data: getEncountersByType(encounters.CLINICAL_NOTES),
    },
    panel39: {
      title: "Procedures Done",
      data: getEncountersByType(encounters.PROCEDURES_DONE),
    },
    panel40: {
      title: "Nursing Notes",
      data: getEncountersByType(encounters.NURSING_NOTES),
    },
    panel41: {
      title: "Diagnosis",
      data: getEncountersByType(encounters.OUTPATIENT_DIAGNOSIS),
    },
    panel42: {
      title: "Circulation Assessment",
      data: getEncountersByType(encounters.CIRCULATION_ASSESSMENT),
    },
    panel43: {
      title: "Nursing Care Notes",
      data: getEncountersByType(encounters.NURSING_CARE_NOTES),
    },
  };

  // Handle accordion expansion
  const handleChange = (panel: any) => (_: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <style>
        {`
         .noData {
            border: #a3a1a1 solid 1px;
            border-style: dashed;
            border-radius: 5px;
            padding: 10px;
            text-align: center;
            margin: 10px 10px 10px 0;
        }
        `}
      </style>

      <Paper style={{ marginTop: "10px" }}>
        {Object.entries(encounterData).map(
          ([panelId, { title, data }]) =>
            data.length > 0 && (
              <Accordion
                key={panelId}
                expanded={expanded === panelId}
                onChange={handleChange(panelId)}
              >
                <AccordionSummary
                  expandIcon={
                    <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />
                  }
                  aria-controls={`${panelId}-content`}
                  id={`${panelId}-header`}
                >
                  <Typography sx={{ fontWeight: 700 }} component="span">
                    {title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <VisitTable data={data} />
                </AccordionDetails>
              </Accordion>
            )
        )}
      </Paper>
    </>
  );
};
