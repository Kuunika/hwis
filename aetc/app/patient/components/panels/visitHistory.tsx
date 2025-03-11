import { Button, Grid, Paper } from "@mui/material";
import { Vitals } from "../visits";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { useEffect, useState } from "react";
import { concepts, encounters } from "@/constants";

export const VisitHistory = () => {
  const { patientId } = getActivePatientDetails();
  const { data: patientVisits } = getPatientVisitTypes(patientId as string);

  const { data: patientHistory, isLoading: historyLoading } =
    getPatientsEncounters(patientId as string);

  // Use a state variable to track dates instead of re-calculating on every render
  const [dates, setDates] = useState<any[]>([]);
  const [activeDate, setActiveVisitDate] = useState<string | null>(null);
  const [filteredEncounters, setFilteredEncounter] = useState<any[]>([]);

  // Extract dates from patient visits only when patientVisits changes
  useEffect(() => {
    if (patientVisits && patientVisits.length > 0) {
      const visitDates: any = patientVisits.map((visit) => visit.date_started);
      setDates(visitDates);

      // Set the initial active date only if it hasn't been set yet
      if (activeDate === null && visitDates.length > 0) {
        setActiveVisitDate(visitDates[0]);
      }
    }
  }, [patientVisits]);

  // Only filter encounters when patientHistory or activeDate changes
  useEffect(() => {
    if (!historyLoading && patientHistory && activeDate) {
      const filtered = filterByVisitDate(patientHistory, activeDate);
      setFilteredEncounter(filtered);
    }
  }, [patientHistory, activeDate, historyLoading]);

  function formatDate(dateString: any) {
    const date = new Date(dateString);

    // Extracting components
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${day} ${month}, ${year} (${time})`;
  }

  function filterByVisitDate(encounters: any, targetDate: any) {
    return encounters.filter(
      (encounter: any) => encounter.visit.date_started === targetDate
    );
  }

  function filterEncounterType(encounterUuid: string) {
    const encounter = filteredEncounters.filter(
      (d: any) => d?.encounter_type?.uuid == encounterUuid
    );
    return processObservations(encounter[0]?.obs ?? []);
  }

  function processObservations(obs: any) {
    const latestObsMap = new Map();
    const processedObs: any = [];

    // Determine the most recent observation for each concept_id
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

    // Process all observations
    obs.forEach((observation: any) => {
      const { concept_id, obs_id } = observation;
      const latestObsId = latestObsMap.get(concept_id).obs_id;

      if (latestObsId === obs_id) {
        // Most recent observation
        processedObs.push({ ...observation, managerId: null });
      } else {
        // Older observation
        processedObs.push({ ...observation, managerId: latestObsId });
      }
    });

    return processedObs;
  }

  // Memoize the vital encounter results to prevent unnecessary re-computation
  const vitalEncounters = activeDate
    ? filterEncounterType(encounters.VITALS)
    : [];

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
            margin-bottom: 10px;
            margin-top: 10px;
            margin-right: 10px;
        }
        `}
      </style>
      <Paper style={{ marginTop: "10px" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <div style={{ padding: "15px" }}>
              <div>
                {dates.map((date: any) => (
                  <Button
                    key={date} // Added key prop for list rendering
                    onClick={() => setActiveVisitDate(date)}
                    size="large"
                    style={{
                      width: "100%",
                      backgroundColor: date == activeDate ? "#DDEEDD" : "",
                      marginBottom: "8px",
                    }}
                    variant="outlined"
                  >
                    {formatDate(date)}
                  </Button>
                ))}
              </div>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            style={{
              borderLeft: "1px solid #B3B3B3",
              paddingLeft: "15px",
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            {vitalEncounters.length === 0 ? (
              <div className="noData">No Vitals were recorded</div>
            ) : (
              <div>
                <Vitals data={vitalEncounters} />
              </div>
            )}
            <div className="noData">No Investigations were recorded</div>
            <div className="noData">No Medication were recorded</div>
            <div className="noData">No Clinical Notes were recorded</div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
