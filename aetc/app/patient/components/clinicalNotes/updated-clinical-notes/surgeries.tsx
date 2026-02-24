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

export const SurgicalHistory: React.FC<{ data: Observation[] }> = ({ data }) => {
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

    const getSurgeriesWithDetails = () => {
        const surgeries: {
            procedure: string;
            date: string;
            indication: string;
            complications: string;
            timestamp: string;
            created_by?: string;
        }[] = [];

        data.forEach(obs => {
            if (obs.names[0]?.name === "Surgical Procedure" && obs.value && obs.children) {
                const surgery: any = {
                    procedure: obs.value,
                    date: "",
                    indication: "",
                    complications: "",
                    timestamp: obs.obs_datetime || "",
                    created_by: obs.created_by
                };

                obs.children.forEach(child => {
                    switch (child.names[0]?.name) {
                        case "Date of surgery":
                            surgery.date = child.value;
                            break;
                        case "Indication For Surgery":
                            surgery.indication = child.value;
                            break;
                        case "Complications":
                            surgery.complications = child.value;
                            break;
                    }
                });

                surgeries.push(surgery);
            }
        });

        return surgeries;
    };

    const surgeries = getSurgeriesWithDetails();

    if (surgeries.length === 0) return null;

    // Group by timestamp to show entries from different sessions
    const groupedByTimestamp = surgeries.reduce((groups, surgery) => {
        const dateKey = surgery.timestamp.split('T')[0]; // Group by date only
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(surgery);
        return groups;
    }, {} as Record<string, typeof surgeries>);

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Surgical History
            </Typography>

            <Box sx={{ pl: 2 }}>
                {Object.entries(groupedByTimestamp).map(([date, dateSurgeries]) => (
                    <Box key={date} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                            {getHumanReadableDateTime(dateSurgeries[0].timestamp)}
                        </Typography>
                        {dateSurgeries.map((surgery, index) => (
                            <Box key={index} sx={{ ml: 2, mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {surgery.procedure}
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    {surgery.date && (
                                        <Typography variant="body2">
                                            Date: {surgery.date.split(' ')[0]}
                                        </Typography>
                                    )}
                                    {surgery.indication && (
                                        <Typography variant="body2">
                                            Indication: {surgery.indication}
                                        </Typography>
                                    )}
                                    {surgery.complications && (
                                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                            Complications: {surgery.complications}
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