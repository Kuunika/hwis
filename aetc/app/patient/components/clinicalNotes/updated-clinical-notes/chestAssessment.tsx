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
    created_by?: string;
    obs_datetime?: string;
    children?: Observation[];
}

interface ChestAssessmentProps {
    data: Observation[];
}

export const ChestAssessment: React.FC<ChestAssessmentProps> = ({ data }) => {
    if (!data || data.length === 0) return null;

    // List of chest assessment relevant observation names
    const chestRelevantNames = [
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
        "Global Chest Wall Abnormality",
        "Chest Assessment Image",
    ];

    // Filter observations to only relevant chest assessment names
    const filteredData = data.filter(
        (obs) => chestRelevantNames.includes(obs.names?.[0]?.name)
    );

    if (filteredData.length === 0) return null;

    // Helper to find first observation by name
    const findObs = (name: string) =>
        filteredData.find((item) => item.names[0].name === name);

    // Helper to find all observations by name
    const findAllObs = (name: string) =>
        filteredData.filter((item) => item.names[0].name === name);

    // Render timestamp from first observation's created_by and obs_datetime
    const renderTimestamp = () => {
        const first = filteredData[0];
        if (!first?.created_by) return null;

        return (
            <Typography sx={{ color: "#7f8c8d", fontSize: 14, letterSpacing: 0.2, mt: 1 }}>
                ~ {first.created_by} - {getHumanReadableDateTime(first.obs_datetime || new Date())}
            </Typography>
        );
    };

    // Render findings with proper indentation
    const renderFindings = (findings: Observation[], level = 0) => {
        if (!findings || findings.length === 0) return null;

        return findings.map((finding) => (
            <Box key={finding.obs_id} sx={{ ml: level * 2 }}>
                <Typography variant="body2">
                    - {finding.names[0]?.name || 'Finding'}: {finding.value}
                </Typography>
                {finding.children && renderFindings(finding.children, level + 1)}
            </Box>
        ));
    };

    // Render assessment section with title and items
    const renderAssessmentSection = (title: string, observation: Observation | undefined) => {
        if (!observation) return null;

        return (
            <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    - {title}
                </Typography>
                <Box sx={{ ml: 3 }}>
                    <Typography variant="body2">{observation.value}</Typography>
                    {observation.children && renderFindings(observation.children, 1)}
                </Box>
            </Box>
        );
    };

    // Render multi-note section
    const renderMultiNoteSection = (title: string, notes: Observation[]) => {
        if (notes.length === 0) return null;

        return (
            <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    - {title}
                </Typography>
                <Box sx={{ ml: 3 }}>
                    {notes.map((note) => (
                        <Typography key={note.obs_id} variant="body2">
                            - {note.value}
                        </Typography>
                    ))}
                </Box>
            </Box>
        );
    };

    // Render complex assessment section (like auscultation findings)
    const renderComplexAssessment = (
        title: string,
        observation: Observation | undefined,
        childKey: string
    ) => {
        if (!observation || !observation.children) return null;

        return (
            <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    - {title}
                </Typography>
                <Box sx={{ ml: 3 }}>
                    {observation.children.map((site) => (
                        <Box key={`${childKey}-${site.obs_id}`} sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                - {site.value}
                            </Typography>
                            {site.children && (
                                <Box sx={{ ml: 3 }}>
                                    {site.children.map((zone) => (
                                        <Box key={`zone-${zone.obs_id}`} sx={{ mb: 1 }}>
                                            <Typography variant="body2">- {zone.value}</Typography>
                                            {zone.children && renderFindings(zone.children, 2)}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
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
                {renderAssessmentSection("Respiratory Rate", findObs("Respiratory rate"))}
                {renderAssessmentSection("Apex Beat", findObs("Apex beat"))}
                {renderAssessmentSection("Positioning", findObs("Positioning"))}
                {renderAssessmentSection("Trill", findObs("Trill"))}
                {renderAssessmentSection("Heart Sounds", findObs("Heart sounds"))}

                {renderMultiNoteSection("Additional Notes", findAllObs("Additional Notes"))}

                {renderAssessmentSection("Chest Expansion", findObs("Chest Expansion"))}
                {renderAssessmentSection("Tactile Fremitus", findObs("Tactile fremitus"))}

                {renderComplexAssessment(
                    "Auscultation Findings",
                    findObs("Auscultation Lung"),
                    "auscultation"
                )}

                {renderAssessmentSection("Percussion", findObs("Percussion"))}

                {renderComplexAssessment(
                    "Localized Chest Wall Abnormality",
                    findObs("Localised chest wall abnormality"),
                    "local-abnormality"
                )}

                {renderComplexAssessment(
                    "Global Chest Wall Abnormality",
                    findObs("Global Chest Wall Abnormality"),
                    "global-abnormality"
                )}
            </Box>

            {renderTimestamp()}
        </Box>
    );
};