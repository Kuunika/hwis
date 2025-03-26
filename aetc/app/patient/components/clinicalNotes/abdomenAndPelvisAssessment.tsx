import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const AbdomenAndPelvisAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setAbdomenPelvisAssessmentData] = useState<{ paragraph: string; status: string; time: string }[]>([]);
    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const airwayEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.ABDOMEN_AND_PELVIS_ASSESSMENT
            );

            if (airwayEncounter) {
                const formattedData = formatAbdomenPelvisAssessmentData(airwayEncounter.obs);
                setAbdomenPelvisAssessmentData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };
    const formatAbdomenPelvisAssessmentData = (obs: any[]) => {
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

        encounterGroups.forEach(group => {
            const assessment: {
                findings: Record<string, string>,
                additionalNotes: string[],
                status: string
            } = {
                findings: {},
                additionalNotes: [],
                status: 'normal'
            };

            // Process all observations for this encounter
            group.observations.forEach(ob => {
                const name = ob.names?.[0]?.name;
                const valueText = ob.value;

                switch (name) {
                    case "Abdominal distention":
                        assessment.findings[name] = valueText === "Yes"
                            ? "The patient has abdominal distention."
                            : "The patient has no abdominal distention.";
                        if (valueText === "Yes") assessment.status = 'abnormal';
                        break;

                    case "Abnormalities present":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Abnormality present."
                            : "Abnormality not present.";
                        if (valueText === "Yes") assessment.status = 'abnormal';
                        break;

                    case "Shifting dullness":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Shifting dullness present."
                            : "Shifting dullness not present.";
                        if (valueText === "Yes") assessment.status = 'abnormal';
                        break;

                    case "Fluid thrill":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Fluid Thrill available."
                            : "Fluid Thrill not available.";
                        if (valueText === "Yes") assessment.status = 'abnormal';
                        break;

                    case "Tenderness":
                        assessment.findings[name] = valueText === "No"
                            ? "Tenderness not present."
                            : "Tenderness present.";
                        if (valueText !== "No") assessment.status = 'abnormal';
                        break;

                    case "Bruit":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Bruit present."
                            : "Bruit not present.";
                        if (valueText === "Yes") assessment.status = 'abnormal';
                        break;

                    case "Bowel sounds":
                        assessment.findings[name] = `Bowel sounds: ${valueText}.`;
                        if (valueText !== "Normal") assessment.status = 'abnormal';
                        break;

                    case "Mass":
                        assessment.findings[name] = valueText === "No"
                            ? "Mass not present."
                            : "Mass present.";
                        if (valueText !== "No") assessment.status = 'abnormal';
                        break;

                    case "General":
                        assessment.findings["Digital rectal"] = `Digital rectal examination: ${valueText}.`;
                        assessment.status = 'abnormal';
                        break;

                    case "Sphincter tone":
                        assessment.findings[name] = `Sphincter tone: ${valueText}.`;
                        if (valueText !== "Normal") assessment.status = 'abnormal';
                        break;

                    case "Circumcision status":
                        assessment.findings[name] = valueText === "No"
                            ? "Patient is not circumcised."
                            : "Patient is circumcised.";
                        break;

                    case "Laceration":
                        assessment.findings[name] = valueText === "No"
                            ? "Ulcerations/lacerations, bite marks not present."
                            : "Ulcerations/lacerations, bite marks present.";
                        if (valueText !== "No") assessment.status = 'abnormal';
                        break;

                    case "Hematomas":
                        assessment.findings[name] = valueText === "No"
                            ? "Signs of oedema, Hematomas, discolourations not present."
                            : "Signs of oedema, Hematomas, discolourations present.";
                        if (valueText !== "No") assessment.status = 'abnormal';
                        break;

                    case "Inflammation":
                        assessment.findings[name] = valueText === "No"
                            ? "Signs of inflammation, edema, lesions around periurethral tissue, bleeding not present."
                            : "Signs of inflammation, edema, lesions around periurethral tissue, bleeding present.";
                        if (valueText !== "No") assessment.status = 'abnormal';
                        break;

                    case "Testicles":
                        assessment.findings[name] = valueText === "No"
                            ? "Both Testicles not present."
                            : "Both Testicles present.";
                        if (valueText === "No") assessment.status = 'abnormal';
                        break;

                    case "Additional Notes":
                        if (valueText.trim()) {
                            assessment.additionalNotes.push(valueText);
                        }
                        break;
                }
            });

            // Define the order of findings in the final paragraph
            const orderedFindings = [
                "Abdominal distention",
                "Abnormalities present",
                "Shifting dullness",
                "Fluid thrill",
                "Tenderness",
                "Bruit",
                "Bowel sounds",
                "Mass",
                "Digital rectal",
                "Sphincter tone",
                "Circumcision status",
                "Laceration",
                "Hematomas",
                "Inflammation",
                "Testicles"
            ];

            const paragraphParts: string[] = [];

            orderedFindings.forEach(finding => {
                if (assessment.findings[finding]) {
                    paragraphParts.push(assessment.findings[finding]);
                }
            });

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
                Abdomen and Pelvis assessment notes
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