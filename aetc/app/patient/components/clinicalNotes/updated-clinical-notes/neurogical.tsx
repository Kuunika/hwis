// neurologicalAssessment.tsx
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

export const NeurologicalAssessment: React.FC<{ data: Observation[] }> = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    // Function to render timestamp
    const renderTimestamp = (panelData: Observation[]) => {
        if (!panelData?.[0]?.created_by) return null;

        return (
            <Typography
                sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}
            >
                ~ {panelData[0].created_by} -{" "}
                {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
            </Typography>
        );
    };

    // Extract neurological observations
    const additionalNotes = data.find(item =>
        item?.names?.[0]?.name === "Additional Notes"
    );

    // Check if there's any neurological assessment data to display
    const hasNeurologicalData = [
        additionalNotes
    ].some(item => item !== undefined);

    if (!hasNeurologicalData) {
        return null;
    }

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Neurological Examination
            </Typography>

            <Box sx={{ pl: 2 }}>
                {/* Additional Notes */}
                {additionalNotes && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Notes:</strong> {additionalNotes.value}
                    </Typography>
                )}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};