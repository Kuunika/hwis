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

export const ChestAssessment: React.FC<{ data: Observation[] }> = ({ data }) => {
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
    const respiratoryRate = data.find(item =>
        item?.names?.[0]?.name === "Respiratory rate"
    );

    const apexBeat = data.find(item =>
        item?.names?.[0]?.name === "Apex beat"
    );

    const positioning = data.find(item =>
        item?.names?.[0]?.name === "Positioning"
    );

    const trill = data.find(item =>
        item?.names?.[0]?.name === "Trill"
    );

    const heartSounds = data.find(item =>
        item?.names?.[0]?.name === "Heart sounds"
    );

    const additionalNotes = data.find(item =>
        item?.names?.[0]?.name === "Additional Notes"
    );

    const chestExpansion = data.find(item =>
        item?.names?.[0]?.name === "Chest Expansion"
    );

    const tactileFremitus = data.find(item =>
        item?.names?.[0]?.name === "Tactile fremitus"
    );

    const auscultationLung = data.find(item =>
        item?.names?.[0]?.name === "Auscultation Lung"
    );

    const percussion = data.find(item =>
        item?.names?.[0]?.name === "Percussion"
    );

    const localizedAbnormality = data.find(item =>
        item?.names?.[0]?.name === "Localised chest wall abnormality"
    );

    const globalAbnormality = data.find(item =>
        item?.names?.[0]?.name === "Global Chest Wall Abnormality"
    );

    // Check if there's any chest assessment data to display
    const hasChestData = [
        respiratoryRate,
        apexBeat,
        positioning,
        trill,
        heartSounds,
        additionalNotes,
        chestExpansion,
        tactileFremitus,
        auscultationLung,
        percussion,
        localizedAbnormality,
        globalAbnormality
    ].some(item => item !== undefined);

    if (!hasChestData) {
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
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb:0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Chest Assessment
            </Typography>

            <Box sx={{ pl: 2 }}>
                {/* Respiratory Rate */}
                {respiratoryRate && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Respiratory Rate: {respiratoryRate.value}
                    </Typography>
                )}

                {/* Apex Beat */}
                {apexBeat && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Apex Beat: {apexBeat.value}
                    </Typography>
                )}

                {/* Positioning */}
                {positioning && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Positioning: {positioning.value}
                    </Typography>
                )}

                {/* Trill */}
                {trill && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Trill: {trill.value}
                    </Typography>
                )}

                {/* Heart Sounds */}
                {heartSounds && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Heart Sounds: {heartSounds.value}
                    </Typography>
                )}

                {/* Additional Notes */}
                {additionalNotes && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Notes: {additionalNotes.value}
                    </Typography>
                )}

                {/* Chest Expansion */}
                {chestExpansion && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Chest Expansion: {chestExpansion.value}
                    </Typography>
                )}

                {/* Tactile Fremitus */}
                {tactileFremitus && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Tactile Fremitus: {tactileFremitus.value}
                    </Typography>
                )}

                {/* Auscultation Lung */}
                {auscultationLung && auscultationLung.children && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Auscultation Findings
                        </Typography>
                        {auscultationLung.children.map((site, idx) => (
                            <Box key={`site-${idx}`} sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {site.value}
                                </Typography>
                                {site.children && site.children.map((zone, zoneIdx) => (
                                    <Box key={`zone-${zoneIdx}`} sx={{ ml: 2 }}>
                                        <Typography variant="body2">
                                            {zone.value}
                                        </Typography>
                                        {zone.children && renderFindings(zone.children)}
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Percussion */}
                {percussion && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Percussion: {percussion.value}
                    </Typography>
                )}

                {/* Localized Abnormality */}
                {localizedAbnormality && localizedAbnormality.children && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Localized Chest Wall Abnormality
                        </Typography>
                        {localizedAbnormality.children.map((zone, idx) => (
                            <Box key={`local-zone-${idx}`} sx={{ mb: 1 }}>
                                <Typography variant="body2">
                                    {zone.value}
                                </Typography>
                                {zone.children && renderFindings(zone.children)}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Global Abnormality */}
                {globalAbnormality && globalAbnormality.children && (
                    <Box sx={{ mb: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Global Chest Wall Abnormality
                        </Typography>
                        {globalAbnormality.children.map((abnormality, idx) => (
                            <Typography key={`global-ab-${idx}`} variant="body2" sx={{ ml: 2 }}>
                                - {abnormality.value}
                            </Typography>
                        ))}
                    </Box>
                )}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};