import { Typography, Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";
import CircularProgress from "@mui/material/CircularProgress";

export const FamilyHistoryNotes = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [familyHistoryEntries, setFamilyHistoryEntries] = useState<{
        paragraph: string;
        time: string;
        creator: string;
        rawTime: number;
    }[]>([]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const familyHistoryEncounters = patientHistory.filter(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.FAMILY_MEDICAL_HISTORY
            );

            const formattedEntries = familyHistoryEncounters.map(encounter => {
                const obs = encounter.obs;
                const conditions: {condition: string, relationship: string}[] = [];
                const creator = encounter.created_by || "Unknown";
                const encounterTime = isValidDate(encounter.encounter_datetime)
                    ? encounter.encounter_datetime
                    : new Date().toISOString();

                let currentSystem = "";
                let currentCondition = "";
                let currentRelationship = "";

                obs?.forEach((item: any) => {
                    const name = item.names?.[0]?.name;
                    const value = item.value;
                    console.log(name, value);

                    if (name === "Review Of Systems Other") {
                        currentSystem = "Other";
                    }
                    else if (name === "Family History" && value === true) {
                        currentCondition = name.replace("Family History", "").trim();
                    }
                    else if (name === "Relationship To Patient") {
                        currentRelationship = value;
                        // When we have all three components, add to array
                        if (currentSystem && currentCondition && currentRelationship) {
                            conditions.push({
                                condition: currentCondition,
                                relationship: currentRelationship
                            });
                            // Reset for next set
                            currentSystem = "";
                            currentCondition = "";
                            currentRelationship = "";
                        }
                    }
                });

                const paragraphs = conditions.map(item =>
                    `${item.condition} (${item.relationship})`
                );

                const paragraph = paragraphs.length > 0
                    ? `Family history: ${paragraphs.join(', ')}`
                    : "No family history documented.";

                return {
                    paragraph,
                    time: encounterTime,
                    creator,
                    rawTime: new Date(encounterTime).getTime()
                };
            });

            const sortedEntries = formattedEntries.sort((a, b) => b.rawTime - a.rawTime);
            setFamilyHistoryEntries(sortedEntries);
        }
    }, [patientHistory, historyLoading]);

    if (historyLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Family Medical History
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <CircularProgress size={40} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Family Medical History
            </Typography>
            {familyHistoryEntries.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No family history available.
                </Typography>
            ) : (
                familyHistoryEntries.map((data, index) => (
                    <Box key={index} sx={{ mb: 0, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 0 }}>
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
                            ~ {data.creator}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
};