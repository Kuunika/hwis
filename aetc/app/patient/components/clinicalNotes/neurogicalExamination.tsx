import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const NeurogicalExamination = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setNeurogicalExaminationData] = useState<{ paragraph: string; time: string }[]>([]);
    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const chestEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT
            );

            if (chestEncounter) {
                const formattedData = formatNeurogicalExaminationData(chestEncounter.obs);
                setNeurogicalExaminationData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };
    const formatNeurogicalExaminationData = (obs: any[]) => {
        const paragraphs: { paragraph: string; time: string }[] = [];
        let currentParagraph: string[] = [];
        let currentTime = "";

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;
            console.log("Processed", `${name} ${valueText}`);


            if (name === "Additional Notes" && currentParagraph.length > 0) {
                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    time: currentTime,
                });

                currentParagraph = [];
            }

            if (name === "Additional Notes") {
                if (isValidDate(ob.obs_datetime)) {
                    currentTime = ob.obs_datetime;
                } else {
                    currentTime = new Date().toISOString();
                }
            }

            if (name === "Additional Notes") {
                currentParagraph.push(`${valueText}.`);
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
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Neurogical examination notes
            </Typography>
            {airwayAssessmentData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No neurological examination data available.
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