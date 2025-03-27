import { Typography, Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const AbdomenAndPelvisAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [abdomenPelvisData, setAbdomenPelvisData] = useState<{
        paragraph: string;
        status: string;
        time: string;
        creator: string
    }[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const abdomenEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.ABDOMEN_AND_PELVIS_ASSESSMENT
            );

            if (abdomenEncounter) {
                const formattedData = formatAbdomenPelvisData(
                    abdomenEncounter.obs,
                    abdomenEncounter.created_by,
                );
                setAbdomenPelvisData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    const formatAbdomenPelvisData = (obs: any[], creator: string) => {
        const encounterGroups: {time: string; observations: any[]; creator: string}[] = [];
        const sortedObs = [...obs].sort((a, b) =>
            new Date(a.obs_datetime).getTime() - new Date(b.obs_datetime).getTime()
        );

        let currentGroup: {time: string; observations: any[]; creator: string} | null = null;

        sortedObs.forEach(ob => {
            const obTime = isValidDate(ob.obs_datetime) ? ob.obs_datetime : new Date().toISOString();
            const obTimestamp = new Date(obTime).getTime();
            const obCreator = ob.creator?.display || creator;

            if (!currentGroup ||
                obTimestamp - new Date(currentGroup.time).getTime() > 5 * 60 * 1000) {
                currentGroup = {
                    time: obTime,
                    observations: [],
                    creator: obCreator
                };
                encounterGroups.push(currentGroup);
            }

            currentGroup.observations.push(ob);
        });

        return encounterGroups.map(group => {
            const assessment: {
                findings: Record<string, string>,
                additionalNotes: string[],
                status: string
            } = {
                findings: {},
                additionalNotes: [],
                status: 'normal'
            };

            group.observations.forEach(ob => {
                const name = ob.names?.[0]?.name;
                const valueText = ob.value;

                switch (name) {
                    case "Abdominal distention":
                        assessment.findings[name] = valueText === "Yes"
                            ? "The patient has abdominal distention."
                            : "The patient has no abdominal distention.";
                        break;

                    case "Abnormalities present":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Abnormality present."
                            : "Abnormality not present.";
                        break;

                    case "Shifting dullness":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Shifting dullness present."
                            : "Shifting dullness not present.";
                        break;

                    case "Fluid thrill":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Fluid Thrill available."
                            : "Fluid Thrill not available.";
                        break;

                    case "Tenderness":
                        assessment.findings[name] = valueText === "No"
                            ? "Tenderness not present."
                            : "Tenderness present.";
                        break;

                    case "Bruit":
                        assessment.findings[name] = valueText === "Yes"
                            ? "Bruit present."
                            : "Bruit not present.";
                        break;

                    case "Bowel sounds":
                        assessment.findings[name] = `Bowel sounds: ${valueText}.`;
                        break;

                    case "General":
                        assessment.findings[name] = `Digital rectal examination: ${valueText}.`;
                        break;
                    case "Prostate":
                        assessment.findings[name] = `Prostate: ${valueText}.`;
                        break;
                    case "Mass":
                        assessment.findings[name] = valueText === "No"
                            ? "Mass not present."
                            : "Mass present.";
                        break;

                    case "Sphincter tone":
                        assessment.findings[name] = `Sphincter tone: ${valueText}.`;
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
                        break;

                    case "Hematomas":
                        assessment.findings[name] = valueText === "No"
                            ? "Signs of oedema, Hematomas, discolourations not present."
                            : "Signs of oedema, Hematomas, discolourations present.";
                        break;

                    case "Inflammation":
                        assessment.findings[name] = valueText === "No"
                            ? "Signs of inflammation, edema, lesions around periurethral tissue, bleeding not present."
                            : "Signs of inflammation, edema, lesions around periurethral tissue, bleeding present.";
                        break;

                    case "Testicles":
                        assessment.findings[name] = valueText === "No"
                            ? "Both Testicles not present."
                            : "Both Testicles present.";
                        break;

                    case "Additional Notes":
                        if (valueText.trim()) {
                            assessment.additionalNotes.push(valueText);
                        }
                        break;
                }
            });

            const orderedFindings = [
                "Abdominal distention",
                "Abnormalities present",
                "Shifting dullness",
                "Fluid thrill",
                "Tenderness",
                "Bruit",
                "Bowel sounds",
                "General",
                "Prostate",
                "Mass",
                "Sphincter tone",
                "Circumcision status",
                "Laceration",
                "Hematomas",
                "Inflammation",
                "Testicles"
            ];

            const paragraphParts = orderedFindings
                .filter(finding => assessment.findings[finding])
                .map(finding => assessment.findings[finding]);

            if (assessment.additionalNotes.length > 0) {
                const cleanNotes = assessment.additionalNotes
                    .filter(note => note.trim().length > 0);
                if (cleanNotes.length > 0) {
                    paragraphParts.push(`Additional notes: ${cleanNotes.join('; ')}`);
                }
            }

            return {
                paragraph: paragraphParts.join(' '),
                status: assessment.status,
                time: group.time,
                creator: group.creator
            };
        });
    };

    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Abdomen and Pelvis Assessment
            </Typography>
            {abdomenPelvisData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No abdomen and pelvis assessment data available.
                </Typography>
            ) : (
                abdomenPelvisData.map((data, index) => (
                    <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "primary.main", mb: 1 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", mb: 1 }}>
                            {data.paragraph}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                textAlign: 'right',
                                color: 'text.secondary',
                                fontStyle: 'italic',
                                mt: 1
                            }}
                        >
                            Assessed by: {data.creator}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
};