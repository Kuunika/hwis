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
            <Typography sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}>
                ~ {panelData[0].created_by} - {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
            </Typography>
        );
    };

    // Helper function to find observation
    const findObs = (name: string) => data.find(item => item?.names?.[0]?.name === name);

    // Find all relevant observations
    const isNormal = findObs("Is Normal");
    const abdominalDistention = findObs("Abdominal distention");
    const shiftingDullness = findObs("Shifting dullness");
    const fluidThrill = findObs("Fluid thrill");
    const bowelSounds = findObs("Bowel sounds");
    const bruit = findObs("Bruit");
    const mass = findObs("Mass");
    const massDescription = findObs("Description");
    const sphincterTone = findObs("Sphincter tone");
    const clitorisAppearance = findObs("Unusual size appearance of clitoris");
    const pelvicExam = findObs("Pelvic examination");
    const vaginalExamNotes = findObs("Digital vaginal examination notes");
    const tenderness = findObs("Tenderness");
    const additionalNotes = findObs("Additional Notes");

    // Check if there's any data to display
    const hasData = [
        isNormal, abdominalDistention, shiftingDullness, fluidThrill,
        bowelSounds, bruit, mass, massDescription, sphincterTone,
        clitorisAppearance, pelvicExam, vaginalExamNotes, tenderness, additionalNotes
    ].some(item => item !== undefined);

    if (!hasData) return null;

    // Render a standard observation with bullet point
    const renderObservation = (obs: Observation | undefined, label: string, indent = 0) => {
        if (!obs) return null;

        return (
            <Box sx={{ ml: indent * 2 }}>
                <Typography variant="body2">
                    - {label}: {obs.value}
                </Typography>
            </Box>
        );
    };

    // Render a section with title and observations
    const renderSection = (title: string, observations: (Observation | undefined)[], indent = 0) => {
        const hasObservations = observations.some(obs => obs !== undefined);
        if (!hasObservations) return null;

        return (
            <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', ml: indent * 2 }}>
                    - {title}
                </Typography>
                <Box sx={{ ml: (indent + 1) * 2 }}>
                    {observations.map((obs, index) =>
                        obs && renderObservation(obs, obs.names[0].name, 0)
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Abdomen and Pelvis Assessment
            </Typography>

            <Box sx={{ pl: 2 }}>
                {/* General Assessment */}
                {renderObservation(isNormal, "Abnormalities present")}

                {/* Abdominal Findings */}
                {renderSection("Abdominal Findings", [
                    abdominalDistention,
                    shiftingDullness,
                    fluidThrill,
                    bowelSounds,
                    bruit
                ])}

                {/* Mass Details */}
                {(mass || massDescription) && (
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            - Mass
                        </Typography>
                        <Box sx={{ ml: 3 }}>
                            {renderObservation(mass, "Present")}
                            {renderObservation(massDescription, "Description")}
                        </Box>
                    </Box>
                )}

                {/* Pelvic Findings */}
                {renderSection("Pelvic Findings", [
                    sphincterTone,
                    clitorisAppearance,
                    pelvicExam,
                    vaginalExamNotes,
                    tenderness
                ])}

                {/* Additional Notes */}
                {additionalNotes && (
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            - Additional Notes
                        </Typography>
                        <Box sx={{ ml: 3 }}>
                            <Typography variant="body2">{additionalNotes.value}</Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};