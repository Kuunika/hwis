import { Typography, Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const ChestAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [chestAssessmentData, setChestAssessmentData] = useState<{ paragraph: string; time: string }[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const chestEncounters = patientHistory.filter(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.CHEST_ASSESSMENT
            );

            if (chestEncounters.length > 0) {
                const allFormattedData: { paragraph: string; time: string }[] = [];

                chestEncounters.forEach(encounter => {
                    const formattedData = formatChestAssessmentData(encounter.obs, encounter.encounter_datetime);
                    allFormattedData.push(...formattedData);
                });

                setChestAssessmentData(allFormattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    const formatChestAssessmentData = (obs: any[], encounterTime: string) => {
        const paragraphs: { paragraph: string; time: string }[] = [];
        let currentParagraph: string[] = [];
        let currentTime = isValidDate(encounterTime) ? encounterTime : new Date().toISOString();
        let abnormalZones = new Set<string>(); // Track zones without notes

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;

            if (name === "Respiratory rate") {
                if (currentParagraph.length > 0) {
                    if (abnormalZones.size > 0) {
                        currentParagraph.push(`Abnormal findings in ${formatList(Array.from(abnormalZones))}.`);
                        abnormalZones = new Set();
                    }
                    paragraphs.push({
                        paragraph: currentParagraph.join(" "),
                        time: currentTime,
                    });
                    currentParagraph = [];
                }
                currentTime = isValidDate(ob.obs_datetime) ? ob.obs_datetime : currentTime;
                currentParagraph.push(`Respiratory rate: ${valueText} bpm.`);
            }
            else if (name === "Chest wall abnormality") {
                currentParagraph.push(valueText === "Yes"
                    ? "Chest wall abnormality present."
                    : "No chest wall abnormality.");
            }
            else if (name === "Apex beat") {
                if (valueText === "Displaced") {
                    const positioning = obs.find(o => o.names?.[0]?.name === "Positioning")?.value;
                    currentParagraph.push("Apex beat displaced" + (positioning ? ` (${positioning}).` : "."));
                } else {
                    currentParagraph.push("Apex beat normal.");
                }
            }
            else if (name === "Trill") {
                currentParagraph.push(valueText === "Yes"
                    ? "Trill detected."
                    : "No trill detected.");
            }
            else if (name === "Heaves") {
                currentParagraph.push(valueText === "Yes"
                    ? "Heaves present."
                    : "No heaves present.");
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
                    const notes = obs.find(o =>
                        o.names?.[0]?.name === "Clinician notes" &&
                        o.group_id === ob.group_id
                    )?.value;

                    if (notes) {
                        currentParagraph.push(`${valueText}: ${notes}.`);
                    } else {
                        abnormalZones.add(valueText);
                    }
                }
            }
        });

        if (abnormalZones.size > 0) {
            currentParagraph.push(`Abnormal findings in ${formatList(Array.from(abnormalZones))}.`);
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
        return <Typography>Loading chest assessment...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Chest Assessment Notes
            </Typography>
            {chestAssessmentData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No chest assessment data available.
                </Typography>
            ) : (
                chestAssessmentData.map((data, index) => (
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