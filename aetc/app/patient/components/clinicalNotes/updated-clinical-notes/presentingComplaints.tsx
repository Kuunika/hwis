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

export const PresentingComplaints: React.FC<{ data: Observation[] }> = ({ data }) => {
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

    const getComplaintsWithDuration = () => {
        const complaints: { name: string; duration: string; unit: string; timestamp: string }[] = [];

        data.forEach(obs => {
            if (obs.names[0]?.name === "Presenting Complaints" && obs.value) {
                complaints.push({
                    name: obs.value,
                    duration: "",
                    unit: "",
                    timestamp: obs.obs_datetime || ""
                });
            }

            // Current complaints with duration children
            if (obs.names[0]?.name === "Current complaints or symptoms" && obs.value && obs.children) {
                const durationChild = obs.children.find(child =>
                    child.names[0]?.name === "Duration Of Symptoms Days" ||
                    child.names[0]?.name === "Duration Of Symptoms Hours" ||
                    child.names[0]?.name === "Duration Of Symptoms Weeks"
                );

                complaints.push({
                    name: obs.value,
                    duration: durationChild?.value || "",
                    unit: durationChild?.names[0]?.name.replace("Duration Of Symptoms ", "") || "",
                    timestamp: obs.obs_datetime || ""
                });
            }
        });

        return complaints;
    };

    const complaints = getComplaintsWithDuration();

    if (complaints.length === 0) return null;

    // Group by timestamp to show entries from different sessions
    const groupedByTimestamp = complaints.reduce((groups, complaint) => {
        const dateKey = complaint.timestamp.split('T')[0]; // Group by date only
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(complaint);
        return groups;
    }, {} as Record<string, typeof complaints>);

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Presenting Complaints
            </Typography>

            <Box sx={{ pl: 2 }}>
                {Object.entries(groupedByTimestamp).map(([date, dateComplaints]) => (
                    <Box key={date} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                            {getHumanReadableDateTime(dateComplaints[0].timestamp)}
                        </Typography>
                        {dateComplaints.map((complaint, index) => (
                            <Box key={index} sx={{ ml: 2, mt: 0.5 }}>
                                <Typography variant="body2">
                                    - {complaint.name}
                                    {complaint.duration && (
                                        <Typography component="span" sx={{ color: '#7f8c8d', ml: 1, fontSize: '0.9em' }}>
                                            ({complaint.duration} {complaint.unit.toLowerCase()})
                                        </Typography>
                                    )}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};