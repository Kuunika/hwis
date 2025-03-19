import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const BreathingAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setAirwayAssessmentData] = useState<any[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const airwayEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.BREATHING_ASSESSMENT
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

                let humanReadableResponse = "";
                let status = "normal"; // Default status is "normal"

                if (name === "Is Breathing Abnormal") {
                    if (valueText === "Yes") {
                        humanReadableResponse = "The patient is not breathing normally.";
                        status = "abnormal"; // Mark as abnormal
                    } else if (valueText === "No") {
                        humanReadableResponse = "The patient is breathing abnormally.";
                        status = "abnormal"; // Mark as abnormal
                    } else {
                        humanReadableResponse = "The patient's airway status is threatened.";
                        status = "abnormal"; // Mark as abnormal
                    }
                } else if (name === "Respiratory rate") {
                    humanReadableResponse = `The patient's respiratory rate is ${valueText} breaths per minute.`;
                    // Mark as abnormal if respiratory rate is outside normal range (e.g., < 12 or > 20)
                    const rate = parseInt(valueText, 10);
                    if (rate < 12 || rate > 20) {
                        status = "abnormal";
                    }
                } else if (name === "Oxygen Saturation") {
                    humanReadableResponse = `The patient's oxygen saturation is ${valueText}%.`;
                    // Mark as abnormal if oxygen saturation is below normal (e.g., < 95%)
                    const saturation = parseInt(valueText, 10);
                    if (saturation < 95) {
                        status = "abnormal";
                    }
                } else if (name === "Patient Need Oxygen") {
                    humanReadableResponse = valueText === "Yes"
                        ? "The patient requires oxygen."
                        : "The patient does not require oxygen.";
                    if (valueText === "Yes") {
                        status = "abnormal"; // Mark as abnormal if oxygen is required
                    }
                } else if (name === "Is Trachea Central") {
                    humanReadableResponse = valueText === "Yes"
                        ? "The patient's trachea is central."
                        : "The trachea is not central.";
                    if (valueText === "No") {
                        status = "abnormal"; // Mark as abnormal if trachea is not central
                    }
                } else if (name === "Chest wall abnormality") {
                    humanReadableResponse = valueText === "Yes"
                        ? "The chest wall is abnormal."
                        : "The chest wall is normal.";
                    if (valueText === "Yes") {
                        status = "abnormal"; // Mark as abnormal if chest wall is abnormal
                    }
                } else if (name === "Chest Expansion") {
                    humanReadableResponse = valueText === "Normal"
                        ? "The patient's chest expansion is normal."
                        : "The patient's chest expansion is reduced.";
                    if (valueText === "Reduced") {
                        status = "abnormal"; // Mark as abnormal if chest expansion is reduced
                    }
                } else if (name === "Percussion") {
                    humanReadableResponse = valueText === "Normal"
                        ? "The patient's percussion is normal."
                        : "The patient's percussion is abnormal.";
                    if (valueText === "Abnormal") {
                        status = "abnormal"; // Mark as abnormal if percussion is abnormal
                    }
                } else if (name === "Breathing sounds") {
                    humanReadableResponse = valueText === "Normal"
                        ? "The breath sounds are normal."
                        : "The breath sounds are abnormal.";
                    if (valueText === "Abnormal") {
                        status = "abnormal"; // Mark as abnormal if breath sounds are abnormal
                    }
                } else if (name === "Additional Notes") {
                    humanReadableResponse = `Additional Notes: ${valueText}`;
                    // Additional notes are neutral, so no status change
                }

                if (humanReadableResponse) {
                    return {
                        name: name,
                        value: humanReadableResponse,
                        time: ob.obs_datetime,
                        status: status, // Include the status
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
                Breathing Assessment Notes
            </Typography>
            {airwayAssessmentData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                    No breathing assessment data available.
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