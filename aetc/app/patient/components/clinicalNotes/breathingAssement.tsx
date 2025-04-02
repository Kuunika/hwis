import { Typography, Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const BreathingAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [breathingAssessmentData, setBreathingAssessmentData] = useState<{
        paragraph: string;
        status: string;
        time: string;
        creator: string
    }[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const breathingEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.BREATHING_ASSESSMENT
            );

            if (breathingEncounter) {
                const formattedData = formatBreathingAssessmentData(breathingEncounter.obs);
                setBreathingAssessmentData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    const formatBreathingAssessmentData = (obs: any[]) => {
        const paragraphs: { paragraph: string;rawTime: number;  status: string; time: string; creator: string }[] = [];
        let currentParagraph: string[] = [];
        let currentStatus = "normal";
        let currentTime = "";
        let currentCreator = "";
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
            const creator = ob.created_by;

            if (name === "Is Breathing Abnormal" && currentParagraph.length > 0) {
                if (additionalNotes) {
                    currentParagraph.push(additionalNotes);
                    additionalNotes = "";
                }

                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    status: currentStatus,
                    time: currentTime,
                    creator: currentCreator,
                    rawTime: new Date(currentTime).getTime(),

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
                currentCreator = creator;
            }

            if (name === "Is Breathing Abnormal") {
                if (valueText === "Yes") {
                    addStatement("The patient is breathing normally.", true);
                } else if (valueText === "No") {
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
                creator: currentCreator,
                rawTime: new Date(currentTime).getTime(),

            });
        }

        return paragraphs.sort((a, b) => b.rawTime - a.rawTime);
    };

    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Breathing Assessment
            </Typography>
            {breathingAssessmentData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No breathing assessment data available.
                </Typography>
            ) : (
                breathingAssessmentData.map((data, index) => (
                    <Box key={index} sx={{ mb: 0, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "primary.main", mb: 0 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: data.status === "abnormal" ? "" : "primary.main",
                                mb: 0
                            }}
                        >
                            {data.paragraph}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                textAlign: 'right',
                                color: 'text.secondary',
                                fontStyle: 'italic',
                                mt: 0
                            }}
                        >
                            Assessed by: {data.creator}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
};