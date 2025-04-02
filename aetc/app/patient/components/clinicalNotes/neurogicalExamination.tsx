import { Typography, Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const NeurologicalExamination = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [neurologicalData, setNeurologicalData] = useState<{
        paragraph: string;
        time: string;
        creator: string
    }[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const neuroEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT
            );

            if (neuroEncounter) {
                const formattedData = formatNeurologicalData(neuroEncounter.obs, neuroEncounter.created_by || "Unknown");
                setNeurologicalData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    const formatNeurologicalData = (obs: any[], defaultCreator: string) => {
        const paragraphs: { paragraph: string; time: string; creator: string }[] = [];
        let currentParagraph: string[] = [];
        let currentTime = "";
        let currentCreator = defaultCreator;

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;
            const creator = ob.creator?.display || currentCreator;

            if (name === "Additional Notes" && currentParagraph.length > 0) {
                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    time: currentTime,
                    creator: currentCreator
                });
                currentParagraph = [];
            }

            if (name === "Additional Notes") {
                currentTime = isValidDate(ob.obs_datetime) ? ob.obs_datetime : new Date().toISOString();
                currentCreator = creator;
                currentParagraph.push(`${valueText}.`);
            }
        });

        if (currentParagraph.length > 0) {
            paragraphs.push({
                paragraph: currentParagraph.join(" "),
                time: currentTime,
                creator: currentCreator
            });
        }

        return paragraphs;
    };

    if (historyLoading) {
        return <Typography>Loading neurological examination data...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Neurological Examination
            </Typography>
            {neurologicalData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No neurological examination data available.
                </Typography>
            ) : (
                neurologicalData.map((data, index) => (
                    <Box key={index} sx={{ mb: 0, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", mb: 0 }}>
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