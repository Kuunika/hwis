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

interface ChestAssessmentProps {
    data: Observation[];
}

export const ChestAssessment: React.FC<ChestAssessmentProps> = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    const renderTimestamp = () => {
        const firstItemWithTimestamp = data.find(item => item.created_by);
        if (!firstItemWithTimestamp?.created_by) return null;

        return (
            <Typography sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}>
                ~ {firstItemWithTimestamp.created_by} -{" "}
                {getHumanReadableDateTime(firstItemWithTimestamp.obs_datetime || new Date())}
            </Typography>
        );
    };

    // List of relevant chest assessment concepts
    const chestConcepts = [
        "Respiratory rate",
        "Apex beat",
        "Positioning",
        "Trill",
        "Heart sounds",
        "Additional Notes",
        "Chest Expansion",
        "Tactile fremitus",
        "Auscultation Lung",
        "Percussion",
        "Localised chest wall abnormality",
        "Global Chest Wall Abnormality"
    ];

    // Filter observations to only include chest assessment relevant ones
    const chestObservations = data.filter(obs =>
        obs.names?.[0] && chestConcepts.includes(obs.names[0].name)
    );

    if (chestObservations.length === 0) return null;

    // Helper function to find observations by concept name
    const findObservations = (conceptName: string) =>
        chestObservations.filter(obs => obs.names[0].name === conceptName);

    // Render a simple observation value
    const renderSimpleObservation = (conceptName: string) => {
        const observations = findObservations(conceptName);
        if (observations.length === 0) return null;

        return (
            <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    - {conceptName}:
                </Typography>
                <Box sx={{ ml: 3 }}>
                    {observations.map(obs => (
                        <Typography key={obs.obs_id} variant="body2">
                            {obs.value}
                            {obs.children && renderChildObservations(obs.children)}
                        </Typography>
                    ))}
                </Box>
            </Box>
        );
    };

    // Render child observations with proper indentation
    const renderChildObservations = (children: Observation[], level = 1) => {
        return children.map(child => (
            <Box key={child.obs_id} sx={{ ml: level * 2 }}>
                <Typography variant="body2">
                    - {child.names[0]?.name || 'Finding'}: {child.value}
                </Typography>
                {child.children && renderChildObservations(child.children, level + 1)}
            </Box>
        ));
    };

    // Render auscultation findings with sites and zones
    const renderAuscultationFindings = () => {
        const auscultations = findObservations("Auscultation Lung");
        if (auscultations.length === 0) return null;

        return (
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    - Auscultation Findings:
                </Typography>
                <Box sx={{ ml: 3 }}>
                    {auscultations.map(auscultation => (
                        auscultation.children?.map(site => (
                            <Box key={site.obs_id} sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    - {site.value}
                                </Typography>
                                {site.children && (
                                    <Box sx={{ ml: 3 }}>
                                        {site.children.map(zone => (
                                            <Box key={zone.obs_id} sx={{ mb: 1 }}>
                                                <Typography variant="body2">- {zone.value}</Typography>
                                                {zone.children && renderChildObservations(zone.children, 2)}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        ))
                    ))}
                </Box>
            </Box>
        );
    };

    // Render chest wall abnormalities
    const renderChestWallAbnormalities = () => {
        const localAbnormalities = findObservations("Localised chest wall abnormality");
        const globalAbnormalities = findObservations("Global Chest Wall Abnormality");

        return (
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    - Chest Wall Abnormalities:
                </Typography>
                <Box sx={{ ml: 3 }}>
                    {localAbnormalities.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                - Localized:
                            </Typography>
                            <Box sx={{ ml: 3 }}>
                                {localAbnormalities.map(abnormality => (
                                    <Box key={abnormality.obs_id}>
                                        <Typography variant="body2">{abnormality.value}</Typography>
                                        {abnormality.children && renderChildObservations(abnormality.children)}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                    {globalAbnormalities.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                - Global:
                            </Typography>
                            <Box sx={{ ml: 3 }}>
                                {globalAbnormalities.map(abnormality => (
                                    <Box key={abnormality.obs_id}>
                                        <Typography variant="body2">{abnormality.value}</Typography>
                                        {abnormality.children && renderChildObservations(abnormality.children)}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Chest Assessment
            </Typography>

            <Box sx={{ pl: 2 }}>
                {renderSimpleObservation("Respiratory rate")}
                {renderSimpleObservation("Apex beat")}
                {renderSimpleObservation("Positioning")}
                {renderSimpleObservation("Trill")}
                {renderSimpleObservation("Heart sounds")}
                {renderSimpleObservation("Additional Notes")}
                {renderSimpleObservation("Chest Expansion")}
                {renderSimpleObservation("Tactile fremitus")}
                {renderSimpleObservation("Percussion")}
                {renderAuscultationFindings()}
                {renderChestWallAbnormalities()}
            </Box>

            {renderTimestamp()}
        </Box>
    );
};