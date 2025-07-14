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

export const AbdomenAndPelvis: React.FC<{ data: Observation[] }> = ({ data }) => {
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

    // Extract specific observations
    const abdominalDistention = data.find(item =>
        item?.names?.[0]?.name === "Abdominal distention"
    );

    const shiftingDullness = data.find(item =>
        item?.names?.[0]?.name === "Shifting dullness"
    );

    const fluidThrill = data.find(item =>
        item?.names?.[0]?.name === "Fluid thrill"
    );

    const bowelSounds = data.find(item =>
        item?.names?.[0]?.name === "Bowel sounds"
    );

    const bruit = data.find(item =>
        item?.names?.[0]?.name === "Bruit"
    );

    const additionalNotes = data.find(item =>
        item?.names?.[0]?.name === "Additional Notes"
    );

    // Check if there's any abdomen and pelvis assessment data to display
    const hasAbdomenData = [
        abdominalDistention,
        shiftingDullness,
        fluidThrill,
        bowelSounds,
        bruit,
        additionalNotes
    ].some(item => item !== undefined);

    if (!hasAbdomenData) {
        return null;
    }

    // Helper function to render findings with grouped values
    const renderFindings = (findings: Observation[]) => {
        if (!findings || findings.length === 0) return null;

        // Group findings by their type (name)
        const groupedFindings: Record<string, string[]> = {};

        findings.forEach(finding => {
            const findingName = finding.names[0]?.name;
            if (findingName) {
                if (!groupedFindings[findingName]) {
                    groupedFindings[findingName] = [];
                }
                groupedFindings[findingName].push(finding.value);
            }
        });

        return Object.entries(groupedFindings).map(([name, values]) => (
            <Typography key={name} variant="body2" sx={{ ml: 2 }}>
                - {name}: {values.join(", ")}
            </Typography>
        ));
    };

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Abdomen and Pelvis Assessment
            </Typography>

            <Box sx={{ pl: 2 }}>
                {/* Abdominal Distention */}
                {abdominalDistention && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Abdominal Distention:</strong> {abdominalDistention.value}
                    </Typography>
                )}

                {/* Shifting Dullness */}
                {shiftingDullness && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Shifting Dullness:</strong> {shiftingDullness.value}
                    </Typography>
                )}

                {/* Fluid Thrill */}
                {fluidThrill && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Fluid Thrill:</strong> {fluidThrill.value}
                    </Typography>
                )}

                {/* Bowel Sounds */}
                {bowelSounds && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Bowel Sounds:</strong> {bowelSounds.value}
                    </Typography>
                )}

                {/* Bruit */}
                {bruit && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Bruit:</strong> {bruit.value}
                    </Typography>
                )}

                {/* Additional Notes */}
                {/*{additionalNotes && (*/}
                {/*    <Typography variant="body2" sx={{ mb: 0.5 }}>*/}
                {/*        <strong>Notes:</strong> {additionalNotes.value}*/}
                {/*    </Typography>*/}
                {/*)}*/}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};