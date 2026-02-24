import React from "react";
import { Box, Typography } from "@mui/material";
import { getHumanReadableDateTime } from "@/helpers/dateTime";

interface Name {
    name: string;
    [key: string]: any;
}

interface Observation {
    obs_id: number;
    names: Name[];
    value: string;
    children?: Observation[];
    created_by?: string;
    obs_datetime?: string;
}

export const FamilyMedicalHistory: React.FC<{ data: Observation[] }> = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    const renderTimestamp = (panelData: Observation[]) => {
        if (!panelData?.[0]?.created_by) return null;

        return (
            <Typography sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}>
                ~ {panelData[0].created_by} - {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
            </Typography>
        );
    };

    const getFamilyMedicalHistory = () => {
        const familyHistory: {
            condition: string;
            relationship: string;
            timestamp: string;
            created_by?: string;
        }[] = [];

        data.forEach(obs => {
            // Check for various family history conditions
            if ((obs.names[0]?.name === "Family History Asthma" ||
                    obs.names[0]?.name === "Family History Diabetes Mellitus" ||
                    obs.names[0]?.name === "Family History Tuberculosis" ||
                    obs.names[0]?.name === "Family History Other Condition") &&
                obs.value && obs.children) {

                const history: any = {
                    condition: obs.names[0]?.name.replace("Family History ", ""),
                    relationship: "",
                    timestamp: obs.obs_datetime || "",
                    created_by: obs.created_by
                };

                // For "Other Condition", use the specified value instead of the concept name
                if (obs.names[0]?.name === "Family History Other Condition") {
                    history.condition = obs.value;
                }

                obs.children.forEach(child => {
                    if (child.names[0]?.name === "Relationship To Patient") {
                        history.relationship = child.value;
                    }
                });

                familyHistory.push(history);
            }
        });

        return familyHistory;
    };

    const familyHistory = getFamilyMedicalHistory();

    if (familyHistory.length === 0) return null;

    // Group by timestamp to show entries from different sessions
    const groupedByTimestamp = familyHistory.reduce((groups, history) => {
        const dateKey = history.timestamp.split('T')[0]; // Group by date only
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(history);
        return groups;
    }, {} as Record<string, typeof familyHistory>);

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Family Medical History
            </Typography>

            <Box sx={{ pl: 2 }}>
                {Object.entries(groupedByTimestamp).map(([date, dateHistory]) => (
                    <Box key={date} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                            {getHumanReadableDateTime(dateHistory[0].timestamp)}
                        </Typography>
                        {dateHistory.map((history, index) => (
                            <Box key={index} sx={{ ml: 2, mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {history.condition}
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    {history.relationship && (
                                        <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                            Relationship: {history.relationship}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};