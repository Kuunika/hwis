import { Paper, Typography } from "@mui/material";
import { PresentingComplaintTable } from "../visits";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";
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

  // Filter encounters by type and process observations
  const getEncountersByType = (encounterTypeUuid: any) => {
    if (!visitDate) return [];

    const encounter: any = filteredEncounters.find(
      (d: any) => d?.encounter_type?.uuid === encounterTypeUuid
    );

    return encounter?.obs || [];
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
            data.length > 0 && <PresentingComplaintTable data={data} />
        )}
      </Paper>
    </>
  );
};
