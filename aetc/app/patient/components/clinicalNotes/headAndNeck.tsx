import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const HeadAndNeck = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setNeckAndNeckData] = useState<{ paragraph: string; time: string }[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const chestEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.HEAD_AND_NECK_ASSESSMENT
            );

            if (chestEncounter) {
                const formattedData = formatHeadAndNeckData(chestEncounter.obs);
                setNeckAndNeckData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    const isBasicImageName = (name: string) => {
        const basicNames = ["Front", "Back", "Left", "Right"];
        return basicNames.includes(name);
    };

    const formatHeadAndNeckData = (obs: any[]) => {
        const assessments: { paragraph: string; time: string }[] = [];
        let currentAssessment: {
            parts: string[];
            abnormalities: Map<
                string,
                {
                    type: string;
                    details: Record<string, string>;
                }[]
            >;
            time: string;
        } = {
            parts: [],
            abnormalities: new Map(),
            time: ""
        };

        let currentImageName = "";
        let currentAbnormalityType = "";

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;

            if (name === "Image Part Name") {
                if (valueText === "Front") {
                    if (currentAssessment.parts.length > 0 || currentAssessment.abnormalities.size > 0) {
                        assessments.push(formatAssessmentToParagraph(currentAssessment));
                    }

                    // Start new assessment
                    currentAssessment = {
                        parts: [],
                        abnormalities: new Map(),
                        time: isValidDate(ob.obs_datetime) ? ob.obs_datetime : new Date().toISOString()
                    };
                }

                // Track current image name if it's not Left, Right, Back and front
                if (!isBasicImageName(valueText)) {
                    currentImageName = valueText;
                    if (!currentAssessment.parts.includes(valueText)) {
                        currentAssessment.parts.push(valueText);
                    }
                }
            }
            else if (name === "Abnormalities") {
                currentAbnormalityType = valueText;
                if (currentImageName) {
                    if (!currentAssessment.abnormalities.has(currentImageName)) {
                        currentAssessment.abnormalities.set(currentImageName, []);
                    }
                    currentAssessment.abnormalities.get(currentImageName)?.push({
                        type: valueText,
                        details: {}
                    });
                }
            }
            else if (name === "Laceration length" && currentAbnormalityType === "Laceration") {
                const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
                if (lastAbnormality) lastAbnormality.details.length = valueText;
            }
            else if (name === "Laceration depth" && currentAbnormalityType === "Laceration") {
                const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
                if (lastAbnormality) lastAbnormality.details.depth = valueText;
            }
            else if (name === "Laceration other" && currentAbnormalityType === "Laceration") {
                const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
                if (lastAbnormality) lastAbnormality.details.other = valueText;
            }
            else if (name === "Description" && currentAbnormalityType === "Bruise") {
                const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
                if (lastAbnormality) lastAbnormality.details.description = valueText;
            }
            else if (name === "Specify" && currentAbnormalityType === "Other") {
                const lastAbnormality = getLastAbnormality(currentAssessment, currentImageName);
                if (lastAbnormality) lastAbnormality.details.specify = valueText;
            }
            else if (name === "Clinician notes") {
                if (!currentAssessment.abnormalities.has("General")) {
                    currentAssessment.abnormalities.set("General", []);
                }
                currentAssessment.abnormalities.get("General")?.push({
                    type: "Note",
                    details: { note: valueText }
                });
            }
        });

        // Add the last assessment
        if (currentAssessment.parts.length > 0 || currentAssessment.abnormalities.size > 0) {
            assessments.push(formatAssessmentToParagraph(currentAssessment));
        }

        return assessments;
    };

    const getLastAbnormality = (assessment: any, imageName: string) => {
        if (!assessment.abnormalities.has(imageName)) return null;
        const abnormalities = assessment.abnormalities.get(imageName);
        return abnormalities[abnormalities.length - 1];
    };

    const formatAssessmentToParagraph = (assessment: any) => {
        let paragraphParts: string[] = [];

        // Add the assessed parts
        if (assessment.parts.length > 0) {
            paragraphParts.push(`Assessment of ${assessment.parts.join(", ")} was performed.`);
        }

        // Add abnormalities for each part
        assessment.abnormalities.forEach((abnormalities:any, part:any) => {
            if (part === "General") {
                abnormalities.forEach((abnormality: any) => {
                    paragraphParts.push(`Clinician notes: ${abnormality.details.note}.`);
                });
            } else {
                abnormalities.forEach((abnormality: any) => {
                    let description = `${part} showed ${abnormality.type}`;

                    // Add specific details based on abnormality type
                    switch (abnormality.type) {
                        case "Laceration":
                            if (abnormality.details.length) description += ` (Length: ${abnormality.details.length}`;
                            if (abnormality.details.depth) description += `, Depth: ${abnormality.details.depth}`;
                            if (abnormality.details.other) description += `, Description: ${abnormality.details.other}`;
                            if (abnormality.details.length) description += ")";
                            break;
                        case "Bruise":
                            if (abnormality.details.description) description += ` (${abnormality.details.description})`;
                            break;
                        case "Other":
                            if (abnormality.details.specify) description += ` (${abnormality.details.specify})`;
                            break;
                    }

                    paragraphParts.push(description + ".");
                });
            }
        });

        return {
            paragraph: paragraphParts.join(" "),
            time: assessment.time
        };
    };

    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Head and Neck assessment notes
            </Typography>
            {airwayAssessmentData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No head and neck data available.
                </Typography>
            ) : (
                airwayAssessmentData.map((data, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                            {data.paragraph}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
};