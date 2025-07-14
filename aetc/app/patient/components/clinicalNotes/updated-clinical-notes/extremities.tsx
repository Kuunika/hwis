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
            <Typography
                sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}
            >
                ~ {panelData[0].created_by} -{" "}
                {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
            </Typography>
        );
    };

    // Helper function to render findings with proper nesting
    const renderFinding = (finding: Observation, parent?: Observation) => {
        // Skip image part name observations
        if (finding.names?.[0]?.name === "Image Part Name") return null;

        // Skip if this is a detail that should be handled by its parent
        if (parent && [
            "Laceration length",
            "Laceration depth",
            "Laceration other",
            "Mass description",
            "Fracture description",
            "Description"
        ].includes(finding.names?.[0]?.name)) {
            return null;
        }

        return (
            <Box key={finding.obs_id} sx={{ mb: 0.5 }}>
                <Typography variant="body2">
                    - {finding.names?.[0]?.name}: {finding.value}
                </Typography>

                {/* Render nested details if they exist */}
                {finding.children && (
                    <Box sx={{ ml: 3 }}>
                        {finding.children.map(child => {
                            // Only show relevant details based on parent
                            if (
                                (finding.names?.[0]?.name === "Laceration" && finding.value === "Yes" && [
                                    "Laceration length",
                                    "Laceration depth",
                                    "Laceration other"
                                ].includes(child.names?.[0]?.name)) ||
                                (finding.names?.[0]?.name === "Mass" && finding.value === "Yes" &&
                                    child.names?.[0]?.name === "Mass description") ||
                                (finding.names?.[0]?.name === "Fracture" && finding.value === "Yes" &&
                                    child.names?.[0]?.name === "Fracture description") ||
                                (finding.names?.[0]?.name === "Skin rash" && finding.value === "Yes" &&
                                    child.names?.[0]?.name === "Description")
                            ) {
                                return (
                                    <Typography key={child.obs_id} variant="body2">
                                        • {child.names?.[0]?.name}: {child.value}
                                    </Typography>
                                );
                            }
                            return null;
                        })}
                    </Box>
                )}
            </Box>
        );
    };

    // Helper function to render limb findings
    const renderLimbFindings = (limbData: Observation | undefined) => {
        if (!limbData || !limbData.children) return null;

        return limbData.children.map((region, idx) => (
            <Box key={`region-${idx}`} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {region.value}
                </Typography>
                {region.children && (
                    <Box sx={{ ml: 2 }}>
                        {region.children
                            .filter(finding => {
                                // Filter out image part names and "No" responses
                                const name = finding.names?.[0]?.name;
                                return name !== "Image Part Name" &&
                                    !(finding.value === "No" && !finding.children);
                            })
                            .map(finding => renderFinding(finding))}
                    </Box>
                )}
            </Box>
        ));
    };

    // Extract general observations
    const edema = data.find(item =>
        item?.names?.some(name => ["Edema", "Oedema"].includes(name.name))
    );

    const edemaDetails = data.find(item =>
        item?.names?.[0]?.name === "Oedema details"
    );

    const coldClammy = data.find(item =>
        item?.names?.[0]?.name === "Cold clammy"
    );

    const upperLimbAbnormalities = data.find(item =>
        item?.names?.[0]?.name === "Abnormalities upper limb"
    );

    const lowerLimbAbnormalities = data.find(item =>
        item?.names?.[0]?.name === "Abnormalities lower limb"
    );

    // Extract limb assessments
    const upperLimbAnterior = data.find(item =>
        item?.value === "upper limb anterior"
    );

    const upperLimbPosterior = data.find(item =>
        item?.value === "upper limb posterior"
    );

    const lowerLimbAnterior = data.find(item =>
        item?.value === "lower limb anterior"
    );

    const lowerLimbPosterior = data.find(item =>
        item?.value === "lower limb posterior"
    );

    // Check if there's any extremities assessment data to display
    const hasExtremitiesData = [
        edema,
        edemaDetails,
        coldClammy,
        upperLimbAbnormalities,
        lowerLimbAbnormalities,
        upperLimbAnterior,
        upperLimbPosterior,
        lowerLimbAnterior,
        lowerLimbPosterior
    ].some(item => item !== undefined);

    if (!hasExtremitiesData) {
        return null;
    }

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Extremities Assessment
            </Typography>

            <Box sx={{ pl: 2 }}>
                {/* General Findings */}
                {edema && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Edema:</strong> {edema.value}
                    </Typography>
                )}

                {edemaDetails && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Edema Details:</strong> {edemaDetails.value}
                    </Typography>
                )}

                {coldClammy && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Cold/Clammy:</strong> {coldClammy.value}
                    </Typography>
                )}

                {upperLimbAbnormalities && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Upper Limb Abnormalities:</strong> {upperLimbAbnormalities.value}
                    </Typography>
                )}

                {lowerLimbAbnormalities && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Lower Limb Abnormalities:</strong> {lowerLimbAbnormalities.value}
                    </Typography>
                )}

                {/* Upper Limb Anterior */}
                {upperLimbAnterior && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Upper Limb Anterior
                        </Typography>
                        {renderLimbFindings(upperLimbAnterior)}
                    </Box>
                )}

                {/* Upper Limb Posterior */}
                {upperLimbPosterior && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Upper Limb Posterior
                        </Typography>
                        {renderLimbFindings(upperLimbPosterior)}
                    </Box>
                )}

                {/* Lower Limb Anterior */}
                {lowerLimbAnterior && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Lower Limb Anterior
                        </Typography>
                        {renderLimbFindings(lowerLimbAnterior)}
                    </Box>
                )}

                {/* Lower Limb Posterior */}
                {lowerLimbPosterior && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Lower Limb Posterior
                        </Typography>
                        {renderLimbFindings(lowerLimbPosterior)}
                    </Box>
                )}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};