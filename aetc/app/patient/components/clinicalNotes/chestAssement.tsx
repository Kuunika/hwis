import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const ChestAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setChestAssessmentData] = useState<{ paragraph: string; time: string }[]>([]);
    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const chestEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.CHEST_ASSESSMENT
            );

            if (chestEncounter) {
                const formattedData = formatChestAssessmentData(chestEncounter.obs);
                setChestAssessmentData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };
    const formatChestAssessmentData = (obs: any[]) => {
        const paragraphs: { paragraph: string; time: string }[] = [];
        let currentParagraph: string[] = [];
        let currentTime = "";
        let imageParts: string[] = []; // To track multiple image parts

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;

            if (name === "Respiratory rate" && currentParagraph.length > 0) {
                if (imageParts.length > 0) {
                    currentParagraph.push(`Abnormal tactile fremitus was noted in the ${formatList(imageParts)}.`);
                    imageParts = [];
                }

                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    time: currentTime,
                });
                currentParagraph = [];
            }

            if (name === "Respiratory rate") {
                currentTime = isValidDate(ob.obs_datetime) ? ob.obs_datetime : new Date().toISOString();
                currentParagraph.push(`The patient's respiratory rate is ${valueText} breaths per minute.`);
            }
            else if (name === "Chest wall abnormality") {
                currentParagraph.push(valueText === "Yes"
                    ? "Chest wall abnormality was observed."
                    : "No chest wall abnormality was detected.");
            }
            else if (name === "Apex beat") {
                if (valueText === "Displaced") {
                    const positioning = obs.find(o => o.names?.[0]?.name === "Positioning")?.value;
                    currentParagraph.push("The apex beat is displaced" + (positioning ? ` (${positioning}).` : "."));
                } else {
                    currentParagraph.push("The apex beat is normally positioned.");
                }
            }
            else if (name === "Trill") {
                if (valueText === "Yes") {
                    const description = obs.find(o => o.names?.[0]?.name === "Description")?.value;
                    currentParagraph.push("A trill was detected" + (description ? ` (${description}).` : "."));
                } else {
                    currentParagraph.push("No trill was detected.");
                }
            }
            else if (name === "Heaves") {
                if (valueText === "Yes") {
                    const description = obs.find(o => o.names?.[0]?.name === "Heaves description")?.value;
                    currentParagraph.push("Heaves were present" + (description ? ` (${description}).` : "."));
                } else {
                    currentParagraph.push("No heaves were present.");
                }
            }
            else if (name === "Chest Expansion") {
                currentParagraph.push(`Chest expansion is ${valueText.toLowerCase()}.`);
            }
            else if (name === "Tactile fremitus") {
                currentParagraph.push(`Tactile fremitus is ${valueText.toLowerCase()}.`);
            }
            else if (name === "Image Part Name") {
                const validZones = [
                    "Right Upper Zone", "Left Upper Zone",
                    "Right Middle Zone", "Left Middle Zone",
                    "Right Lower Zone", "Left Lower Zone"
                ];

                if (validZones.includes(valueText)) {
                    imageParts.push(valueText);
                }
            }
        });

        if (imageParts.length > 0) {
            currentParagraph.push(`Abnormal findings were noted.`);
        }

        if (currentParagraph.length > 0) {
            paragraphs.push({
                paragraph: currentParagraph.join(" "),
                time: currentTime,
            });
        }

        return paragraphs;
    };

    const formatList = (items: string[]) => {
        if (items.length === 1) return items[0];
        if (items.length === 2) return `${items[0]} and ${items[1]}`;
        return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
    };
    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
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