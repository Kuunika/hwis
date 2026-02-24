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
    encounter_id?: number;
    encounter_type_name?: string;
    created_by?: string;
    obs_datetime?: string;
}

export const GeneralInformation: React.FC<{ data: Observation[] }> = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Get the encounter_id for this section (we assume all obs are from same encounter)
    const currentEncounterId = data[0]?.encounter_id;

    // Filter for "General Information" and "Additional Notes" for this encounter only
    const notes = data.filter(
        item =>
            ["General Information", "Additional Notes"].includes(item?.names?.[0]?.name) &&
            item.encounter_id === currentEncounterId
    );

    if (notes.length === 0) return null;

    const renderTimestamp = () => {
        const first = notes[0];
        if (!first?.created_by) return null;

        return (
            <Typography sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}>
                ~ {first.created_by} - {getHumanReadableDateTime(first.obs_datetime || new Date())}
            </Typography>
        );
    };

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>

            {notes.map((item, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0 }}>
                    {item.value}
                </Typography>
            ))}

            {renderTimestamp()}
        </Box>
    );
};
