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
        return obs
            .map((ob: any) => {
                const name = ob.names?.[0]?.name;
                const valueText = ob.value;

                console.log("Processing observation:", { name, valueText }); // Debugging log

                let humanReadableResponse = "";

                if (name === "Airway Patent") {
                    if (valueText === "Yes") {
                        humanReadableResponse = "The patient's airway is patent.";
                    } else if (valueText === "No") {
                        humanReadableResponse = "The patient's airway is not patent.";
                    } else {
                        humanReadableResponse = "The patient's airway status is unclear.";
                    }
                } else if (name === "Airway Reason") {
                    humanReadableResponse = `The airway is not patent due to ${valueText}.`;
                } else if (name === "Airway Opening Intervention") {
                    humanReadableResponse = `The ${valueText} was provided as intervention.`;
                } else if (name === "Patient Injured") {
                    if (valueText === "Yes") {
                        humanReadableResponse = "The patient is injured.";
                    } else if (valueText === "No") {
                        humanReadableResponse = "The patient is not injured.";
                    }
                } else if (name === "Neck collar applied") {
                    if (valueText === "Yes") {
                        humanReadableResponse = "The neck collar was provided as intervention.";
                    } else if (valueText === "No") {
                        humanReadableResponse = "The neck collar was not provided.";
                    } else {
                        humanReadableResponse = "The neck collar intervention was not indicated.";
                    }
                } else if (name === "Head blocks applied") {
                    if (valueText === "Yes") {
                        humanReadableResponse = "The head block was provided as intervention.";
                    } else {
                        humanReadableResponse = "No head block was provided as intervention.";
                    }
                }

                if (humanReadableResponse) {
                    return {
                        name: name,
                        value: humanReadableResponse,
                        time: ob.obs_datetime,
                    };
                } else {
                    return null;
                }
            })
            .filter((item) => item !== null);
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