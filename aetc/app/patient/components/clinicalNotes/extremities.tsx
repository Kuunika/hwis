import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const Extremities = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setExtremitiesData] = useState<{ paragraph: string; status: string; time: string }[]>([]);
    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const airwayEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.EXTREMITIES_ASSESSMENT
            );

            if (airwayEncounter) {
                const formattedData = formatExtremitiesData(airwayEncounter.obs);
                setExtremitiesData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };
    const formatExtremitiesData = (obs: any[]) => {
        const encounterGroups: {time: string; observations: any[]}[] = [];

        const sortedObs = [...obs].sort((a, b) =>
            new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
        );

        let currentGroup: {time: string; observations: any[]} | null = null;

        sortedObs.forEach(ob => {
            const obTime = isValidDate(ob.obs_datetime) ? ob.obs_datetime : new Date().toISOString();
            const obTimestamp = new Date(obTime).getTime();

            if (!currentGroup ||
                obTimestamp - new Date(currentGroup.time).getTime() > 5 * 60 * 1000) {
                currentGroup = {
                    time: obTime,
                    observations: []
                };
                encounterGroups.push(currentGroup);
            }

            currentGroup.observations.push(ob);
        });

        const assessments: { paragraph: string; status: string; time: string }[] = [];

        // Define all possible extremity abnormalities
        const extremityAbnormalities = [
            "Deformity", "Fracture", "Burns", "Mass",
            "Tenderness", "Crepitus", "Laceration",
            "Scars", "Skin rash", "Wound", "Swelling"
        ];

        encounterGroups.forEach(group => {
            const assessment: {
                findings: Record<string, string>,
                additionalNotes: string[],
                upperLimbImages: string[],
                lowerLimbImages: string[],
                upperLimbAbnormalities: string[],
                lowerLimbAbnormalities: string[],
                status: string
            } = {
                findings: {},
                additionalNotes: [],
                upperLimbImages: [],
                lowerLimbImages: [],
                upperLimbAbnormalities: [],
                lowerLimbAbnormalities: [],
                status: 'normal'
            };

            // First pass to collect all data
            group.observations.forEach(ob => {
                const name = ob.names?.[0]?.name;
                const valueText = ob.value;

                // Handle image names
                if (name === "Image Part Name" && valueText.includes("Upper Limb")) {
                    assessment.upperLimbImages.push(valueText.replace("Upper Limb - ", ""));
                }
                else if (name === "Image Part Name" && valueText.includes("Lower Limb")) {
                    assessment.lowerLimbImages.push(valueText.replace("Lower Limb - ", ""));
                }
                // Handle abnormalities
                else if (extremityAbnormalities.includes(name)) {
                    if (valueText === "Yes") {
                        assessment.status = 'abnormal';
                        if (ob.concept?.name?.includes("Upper")) {
                            assessment.upperLimbAbnormalities.push(name);
                        } else if (ob.concept?.name?.includes("Lower")) {
                            assessment.lowerLimbAbnormalities.push(name);
                        }
                    }
                }
                // Handle other fields
                else {
                    switch (name) {
                        case "Edema":
                            assessment.findings[name] = valueText === "Yes"
                                ? "The patient has edema. "
                                : "The patient has no edema. ";
                            if (valueText === "Yes") assessment.status = 'abnormal';
                            break;

                        case "Oedema details":
                            assessment.findings[name] = `Edema details: ${valueText}. `;
                            break;

                        case "Cold clammy":
                            assessment.findings[name] = valueText === "Yes"
                                ? "Cold clammy extremities present. "
                                : "Cold clammy extremities not present. ";
                            if (valueText === "Yes") assessment.status = 'abnormal';
                            break;

                        case "Additional Notes":
                            if (valueText.trim()) {
                                assessment.additionalNotes.push(valueText);
                            }
                            break;
                    }
                }
            });

            // Build the paragraph
            const paragraphParts: string[] = [];

            // Add edema and cold clammy findings
            if (assessment.findings["Edema"]) {
                paragraphParts.push(assessment.findings["Edema"]);
            }
            if (assessment.findings["Oedema details"]) {
                paragraphParts.push(assessment.findings["Oedema details"]);
            }
            if (assessment.findings["Cold clammy"]) {
                paragraphParts.push(assessment.findings["Cold clammy"]);
            }

            // Add upper limb findings
            if (assessment.upperLimbImages.length > 0 || assessment.upperLimbAbnormalities.length > 0) {
                let upperLimbText = "Upper limbs: ";
                const parts = [];

                if (assessment.upperLimbImages.length > 0) {
                    parts.push(`images of ${assessment.upperLimbImages.join(", ")}`);
                }

                if (assessment.upperLimbAbnormalities.length > 0) {
                    parts.push(`${assessment.upperLimbAbnormalities.join(", ")} present`);
                } else {
                    parts.push("no abnormalities detected");
                }

                upperLimbText += parts.join("; ") + ".";
                paragraphParts.push(upperLimbText);
            }

            // Add lower limb findings
            if (assessment.lowerLimbImages.length > 0 || assessment.lowerLimbAbnormalities.length > 0) {
                let lowerLimbText = "Lower limbs: ";
                const parts = [];

                if (assessment.lowerLimbImages.length > 0) {
                    parts.push(`images of ${assessment.lowerLimbImages.join(", ")}`);
                }

                if (assessment.lowerLimbAbnormalities.length > 0) {
                    parts.push(`${assessment.lowerLimbAbnormalities.join(", ")} present`);
                } else {
                    parts.push("no abnormalities detected");
                }

                lowerLimbText += parts.join("; ") + ".";
                paragraphParts.push(lowerLimbText);
            }

            // Add additional notes
            if (assessment.additionalNotes.length > 0) {
                const cleanNotes = assessment.additionalNotes
                    .filter(note => note.trim().length > 0)
                    .map(note => note.trim());
                if (cleanNotes.length > 0) {
                    paragraphParts.push(`Additional notes: ${cleanNotes.join('; ')}`);
                }
            }

            if (paragraphParts.length > 0) {
                assessments.push({
                    paragraph: paragraphParts.join(' '),
                    status: assessment.status,
                    time: group.time
                });
            }
        });

        return assessments;
    };
    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Extremities assessment
            </Typography>
            {airwayAssessmentData.length > 0 ? (
                airwayAssessmentData.map((data, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "primary.main", mb: 1 }}>
                            {new Date(data.time).toLocaleString()}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 2,
                            }}
                        >
                            {data.paragraph}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No abdomen and pelvis assessment data available.
                </Typography>
            )}
        </Box>
    );
};