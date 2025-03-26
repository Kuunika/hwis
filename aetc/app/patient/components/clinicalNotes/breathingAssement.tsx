import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const BreathingAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setAirwayAssessmentData] = useState<{ paragraph: string; status: string; time: string }[]>([]);
    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const airwayEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.BREATHING_ASSESSMENT
            );

            if (airwayEncounter) {
                const formattedData = formatBreathingAssessmentData(airwayEncounter.obs);
                setAirwayAssessmentData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };
    const formatBreathingAssessmentData = (obs: any[]) => {
        const paragraphs: { paragraph: string; status: string; time: string }[] = [];
        let currentParagraph: string[] = [];
        let currentStatus = "normal";
        let currentTime = "";
        let additionalNotes = "";

        const addStatement = (statement: string, isAbnormal: boolean = false) => {
            currentParagraph.push(statement);
            if (isAbnormal) {
                currentStatus = "abnormal";
            }
        };

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;
            if (name === "Is Breathing Abnormal" && currentParagraph.length > 0) {
                if (additionalNotes) {
                    currentParagraph.push(additionalNotes);
                    additionalNotes = "";
                }

                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    status: currentStatus,
                    time: currentTime,
                });

                currentParagraph = [];
                currentStatus = "normal";
            }

            if (name === "Is Breathing Abnormal") {
                if (isValidDate(ob.obs_datetime)) {
                    currentTime = ob.obs_datetime;
                } else {
                    currentTime = new Date().toISOString();
                }
            }

            if (name === "Is Breathing Abnormal") {
                if (valueText === "Yes") {
                    addStatement("The patient is breathing normally.", true);
                }else if (valueText === "No") {
                    addStatement("The patient is breathing abnormally.", true);
                    const startTimeObs = obs.find((ob: any) => ob.names?.[0]?.name === "Start Time");
                    const endTimeObs = obs.find((ob: any) => ob.names?.[0]?.name === "End Time");

                    if (startTimeObs) {
                        addStatement(`The patient was assisted with ventilation from ${startTimeObs.value}`, true);
                    }
                    if (endTimeObs) {
                        addStatement(`to ${endTimeObs.value}.`, true);
                    }
                }
            } else if (name === "Respiratory rate") {
                    addStatement(`The patient's respiratory rate is ${valueText} bpm.`, true);

            } else if (name === "Oxygen Saturation") {

                    addStatement(`And oxygen saturation is ${valueText}%.`, true);

            } else if (name === "Patient Need Oxygen") {
                if (valueText === "Yes") {
                    addStatement("Supplemental oxygen required.", true);
                } else {
                    addStatement("Supplemental oxygen not required.");
                }
            } else if (name === "Is Trachea Central") {
                if (valueText === "No") {
                    addStatement("The trachea is not central.", true);
                } else {
                    addStatement("The trachea is central.");
                }
            } else if (name === "Chest wall abnormality") {
                if (valueText === "Yes") {
                    addStatement("The chest wall is abnormal.", true);
                } else {
                    addStatement("The chest wall is normal.");
                }
            } else if (name === "Chest Expansion") {
                if (valueText === "Reduced") {
                    addStatement("The patient's chest expansion is reduced.", true);
                } else {
                    addStatement("The patient's chest expansion is normal.");
                }
            } else if (name === "Percussion") {
                if (valueText === "Abnormal") {
                    addStatement("Percussion findings are abnormal.", true);
                } else {
                    addStatement("Percussion findings are normal.");
                }
            } else if (name === "Breathing sounds") {
                if (valueText === "Abnormal") {
                    addStatement("Breath sounds are abnormal.", true);
                } else {
                    addStatement("Breath sounds are normal.");
                }
            } else if (name === "Additional Notes") {
                additionalNotes = `Additional Notes: ${valueText}`;
            }
        });

        if (currentParagraph.length > 0) {
            if (additionalNotes) {
                currentParagraph.push(additionalNotes);
            }

            paragraphs.push({
                paragraph: currentParagraph.join(" "),
                status: currentStatus,
                time: currentTime,
            });
        }

        return paragraphs;
    };
    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Breathing Assessment Notes
            </Typography>
            {airwayAssessmentData.length > 0 ? (
                airwayAssessmentData.map((data, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "primary.main", mb: 1 }}>
                            {new Date(data.time).toLocaleString()}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: data.status === "abnormal" ? "" : "primary.main",
                                mb: 2,
                            }}
                        >
                            {data.paragraph}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No breathing assessment data available.
                </Typography>
            )}
        </Box>
    );
};