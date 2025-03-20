import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const SoapierNotes = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setAirwayAssessmentData] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const soapierEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.NURSING_CARE_NOTES
            );

            if (soapierEncounter) {
                const formattedData = formatSoapierAssessmentData(soapierEncounter.obs);
                setAirwayAssessmentData(formattedData);
            }
            console.log("Ma Encounter", soapierEncounter);
        }
    }, [patientHistory, historyLoading]);

    const formatSoapierAssessmentData = (obs: any[]) => {
        const groupedData: { [key: string]: any[] } = {};

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;
            const time = ob.obs_datetime;
            console.log("Processing observation:", { name, valueText, time });

            let humanReadableResponse = "";

            if (name === "Subjective") {
                humanReadableResponse = `Subjective: ${valueText}`;
            } else if (name === "Objective") {
                humanReadableResponse = `Objective: ${valueText}`;
            } else if (name === "Assessment") {
                humanReadableResponse = `Assessment: ${valueText}`;
            } else if (name === "Plan") {
                humanReadableResponse = `Plan: ${valueText}`;
            } else if (name === "Intervention") {
                humanReadableResponse = `Intervention: ${valueText}`;
            } else if (name === "Evaluation") {
                humanReadableResponse = `Evaluation: ${valueText}`;
            } else if (name === "Replan") {
                humanReadableResponse = `Re-plan: ${valueText}`;
            } else if (name === "Implementation") {
                humanReadableResponse = `Implementation: ${valueText}`;
            }

            if (humanReadableResponse) {
                if (!groupedData[time]) {
                    groupedData[time] = [];
                }
                groupedData[time].push({
                    name: name,
                    value: humanReadableResponse,
                    time: time,
                });
            }
        });

        return groupedData;
    };

    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                SOAP Notes
            </Typography>
            {Object.keys(airwayAssessmentData).length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                    No airway assessment data available.
                </Typography>
            ) : (
                Object.keys(airwayAssessmentData).map((time) => (
                    <Box key={time} sx={{ mb: 3, borderBottom: "1px solid #E0E0E0", pb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                            {new Date(time).toLocaleString()} {/* Display the time */}
                        </Typography>
                        <List sx={{ listStyleType: "disc", pl: 4 }}>
                            {airwayAssessmentData[time].map((data, index) => (
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
                    </Box>
                ))
            )}
        </Box>
    );
};