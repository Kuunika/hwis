import { Typography, Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const GeneralInformation = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [generalInformationData, setGeneralInformationData] = useState<{
        paragraph: string;
        time: string;
        creator: string
    }[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const generalInfoEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.GENERAL_INFORMATION_ASSESSMENT
            );

            if (generalInfoEncounter) {
                const formattedData = formatGeneralInformationData(generalInfoEncounter.obs);
                setGeneralInformationData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    const formatGeneralInformationData = (obs: any[]) => {
        const paragraphs: { paragraph: string; time: string; creator: string }[] = [];
        let currentParagraph: string[] = [];
        let currentTime = "";
        let currentCreator = "";

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;
            const creator = ob.created_by;

            if (name === "Additional Notes" && currentParagraph.length > 0) {
                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    time: currentTime,
                    creator: currentCreator
                });

                currentParagraph = [];
            }

            if (name === "Additional Notes") {
                if (isValidDate(ob.obs_datetime)) {
                    currentTime = ob.obs_datetime;
                } else {
                    currentTime = new Date().toISOString();
                }
                currentCreator = creator;
            }

            if (name === "Additional Notes") {
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
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                General Information
            </Typography>
            {generalInformationData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No general information data available.
                </Typography>
            ) : (
                generalInformationData.map((data, index) => (
                    <Box key={index} sx={{ mb: 0, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", mb: 1 }}>
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