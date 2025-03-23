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

export const PresentingComplaint = () => {
  const { patientId }: { patientId: any } = getActivePatientDetails();
  const { data: patientHistory, isLoading: historyLoading } =
    getPatientsEncounters(patientId);

  const { visitDate } = useVisitDates();
  const [filteredEncounters, setFilteredEncounter] = useState([]);

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
    console.log("🚀 ~ processObservations ~ obs:", obs);
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

  // Define encounter data for each accordion panel
  const encounterData = {
    panel6: {
      title: "Presenting Complaints",
      data: getEncountersByType(encounters.PRESENTING_COMPLAINTS),
    },
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
            data.length > 0 && <VisitTable data={data} />
        )}
      </Paper>
    </>
  );
};
