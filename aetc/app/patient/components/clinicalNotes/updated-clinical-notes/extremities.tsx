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

export const ExtremitiesAssessment: React.FC<{ data: Observation[] }> = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    // Function to render timestamp
    const renderTimestamp = (panelData: Observation[]) => {
        if (!panelData?.[0]?.created_by) return null;

        return (
            <Typography sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}>
                ~ {panelData[0].created_by} - {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
            </Typography>
        );
    };

    // Helper function to find observation
    const findObs = (name: string) => data.find(item =>
        item?.names?.some(n => n.name === name)
    );

    // Helper function to find all matching observations
    const findAllObs = (name: string) => data.filter(item =>
        item?.names?.some(n => n.name === name)
    );

    // Helper function to find limb assessments
    const findLimbAssessment = (value: string) => data.find(item =>
        item?.value === value
    );

    // Extract general observations
    const edema = findObs("Edema") || findObs("Oedema");
    const edemaDetails = findObs("Oedema details");
    const coldClammy = findObs("Cold clammy");
    const upperLimbAbnormalities = findObs("Abnormalities upper limb");
    const lowerLimbAbnormalities = findObs("Abnormalities lower limb");

    // Extract limb assessments
    const upperLimbAnterior = findLimbAssessment("upper limb anterior");
    const upperLimbPosterior = findLimbAssessment("upper limb posterior");
    const lowerLimbAnterior = findLimbAssessment("lower limb anterior");
    const lowerLimbPosterior = findLimbAssessment("lower limb posterior");

    // Check if there's any data to display
    const hasData = [
        edema, edemaDetails, coldClammy,
        upperLimbAbnormalities, lowerLimbAbnormalities,
        upperLimbAnterior, upperLimbPosterior,
        lowerLimbAnterior, lowerLimbPosterior
    ].some(item => item !== undefined);

    if (!hasData) return null;

    // Render a finding with proper indentation and bullet points
    const renderFinding = (finding: Observation, level = 0) => {
        if (!finding || finding.names?.[0]?.name === "Image Part Name") return null;

        const isNegativeFinding = finding.value === "No" && !finding.children;
        if (isNegativeFinding) return null;

        return (
            <Box key={finding.obs_id} sx={{ ml: level * 2, mb: 0.5 }}>
                <Typography variant="body2">
                    - {finding.names[0]?.name}: {finding.value}
                </Typography>
                {finding.children && renderFindings(finding.children, level + 1)}
            </Box>
        );
    };

    // Render multiple findings with proper nesting
    const renderFindings = (findings: Observation[], level = 0) => {
        if (!findings || findings.length === 0) return null;

        return (
            <Box sx={{ ml: level * 2 }}>
                {findings.map(finding => renderFinding(finding, level))}
            </Box>
        );
    };

    // Render a limb assessment section
    const renderLimbAssessment = (title: string, assessment: Observation | undefined) => {
        if (!assessment || !assessment.children) return null;

        return (
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    - {title}
                </Typography>
                <Box sx={{ ml: 3 }}>
                    {assessment.children.map((region, idx) => (
                        <Box key={`region-${idx}`} sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                - {region.value}
                            </Typography>
                            {region.children && renderFindings(region.children, 1)}
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    // Render a general observation section
    const renderGeneralObservation = (title: string, observation: Observation | undefined) => {
        if (!observation) return null;

        return (
            <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    - {title}: {observation.value}
                </Typography>
                {observation.children && renderFindings(observation.children, 1)}
            </Box>
        );
    };

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Extremities Assessment
            </Typography>

            <Box sx={{ pl: 2 }}>
                {/* General Findings */}
                {renderGeneralObservation("Edema", edema)}
                {edemaDetails && (
                    <Box sx={{ ml: 3, mb: 1 }}>
                        <Typography variant="body2">
                            - Details: {edemaDetails.value}
                        </Typography>
                    </Box>
                )}

                {renderGeneralObservation("Cold/Clammy", coldClammy)}
                {renderGeneralObservation("Upper Limb Abnormalities", upperLimbAbnormalities)}
                {renderGeneralObservation("Lower Limb Abnormalities", lowerLimbAbnormalities)}

                {/* Limb Assessments */}
                {renderLimbAssessment("Upper Limb Anterior", upperLimbAnterior)}
                {renderLimbAssessment("Upper Limb Posterior", upperLimbPosterior)}
                {renderLimbAssessment("Lower Limb Anterior", lowerLimbAnterior)}
                {renderLimbAssessment("Lower Limb Posterior", lowerLimbPosterior)}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};