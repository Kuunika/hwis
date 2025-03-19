import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const AirwayAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setAirwayAssessmentData] = useState<any[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const airwayEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.AIRWAY_ASSESSMENT
            );

            if (airwayEncounter) {
                const formattedData = formatAirwayAssessmentData(airwayEncounter.obs);
                setAirwayAssessmentData(formattedData);
            }
            console.log("Encounter", airwayEncounter);
        }
    }, [patientHistory, historyLoading]);

    const formatAirwayAssessmentData = (obs: any[]) => {
        return obs.map((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;

            let humanReadableResponse = "";
            if (name === "Is Airway Compromised") {
                humanReadableResponse =
                    valueText === "Yes"
                        ? "The patient's airway is compromised."
                        : valueText === "No"
                            ? "The patient's airway is not compromised."
                            : "The patient's airway is threatened.";
            } else if (name === "Is Breathing Abnormal") {
                humanReadableResponse =
                    valueText === "Yes"
                        ? "The patient is injured."
                        : "The patient is not injured.";
            } else {
                humanReadableResponse = "No data available.";
            }

            return {
                name: name,
                value: humanReadableResponse,
                time: ob.obs_datetime,
            };
        });
    };

    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
                Airway Assessment Notes
            </Typography>
            {airwayAssessmentData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                    No airway assessment data available.
                </Typography>
            ) : (
                <List sx={{ listStyleType: "disc", pl: 4 }}>
                    {airwayAssessmentData.map((data, index) => (
                        <ListItem key={index} sx={{ display: "list-item", p: 0 }}>
                            <ListItemText
                                primary={
                                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                                        {data.value}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};