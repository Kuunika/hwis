import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const AirwayAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setAirwayAssessmentData] = useState<{ paragraph: string; time: string }[]>([]);
    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const airwayEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.AIRWAY_ASSESSMENT
            );

            if (airwayEncounter) {
                const formattedData = formatAirwayAssessmentData(airwayEncounter.obs);
                setAirwayAssessmentData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    const formatAirwayAssessmentData = (obs: any[]) => {
        const paragraphs: { paragraph: string; time: string }[] = [];
        let currentParagraph: string[] = [];
        let currentTime = "";

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;

            if (name === "Airway Patent" && currentParagraph.length > 0) {
                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    time: currentTime,
                });

                currentParagraph = [];
            }

            if (name === "Airway Patent") {
                if (isValidDate(ob.obs_datetime)) {
                    currentTime = ob.obs_datetime;
                } else {
                    console.error("Invalid obs_datetime:", ob.obs_datetime);
                    currentTime = new Date().toISOString();
                }
            }

            if (name === "Airway Patent") {
                if (valueText === "Yes") {
                    currentParagraph.push("The patient's airway is patent.");
                } else if (valueText === "No") {
                    currentParagraph.push("The patient's airway is not patent.");
                } else {
                    currentParagraph.push("The patient's airway is threatened.");
                }
            } else if (name === "Airway Reason") {
                currentParagraph.push(`The airway obstruction is attributed to ${valueText}.`);
            } else if (name === "Airway Opening Intervention") {
                currentParagraph.push(`Intervention was performed using ${valueText} to maintain airway patency.`);
            } else if (name === "Patient Injured") {
                if (valueText === "Yes") {
                    currentParagraph.push("The patient has sustained injuries.");
                } else if (valueText === "No") {
                    currentParagraph.push("No injuries were reported.");
                }
            } else if (name === "Neck collar applied") {
                if (valueText === "Yes") {
                    currentParagraph.push("A cervical collar was applied as a precautionary measure.");
                } else if (valueText === "No") {
                    currentParagraph.push("No cervical collar was applied.");
                } else {
                    currentParagraph.push("Application of a cervical collar was not indicated.");
                }
            } else if (name === "Head blocks applied") {
                if (valueText === "Yes") {
                    currentParagraph.push("Head blocks were applied to stabilize the cervical spine.");
                } else {
                    currentParagraph.push("Head blocks were not utilized during the intervention.");
                }
            }
        });

        if (currentParagraph.length > 0) {
            paragraphs.push({
                paragraph: currentParagraph.join(" "),
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
            {/*<Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>*/}
            {/*    Airway Assessment Notes*/}
            {/*</Typography>*/}
            {airwayAssessmentData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                    No airway assessment data available.
                </Typography>
            ) : (
                airwayAssessmentData.map((data, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                            {data.paragraph}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
};