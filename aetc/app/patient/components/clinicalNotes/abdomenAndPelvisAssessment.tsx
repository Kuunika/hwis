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
        const paragraphs: { paragraph: string; status: string; time: string }[] = [];
        let currentParagraph: string[] = [];
        let currentStatus = "normal";
        let currentTime = "";
        let additionalNotes = "";

        const addStatement = (statement: string, isAbnormal: boolean = false) => {
            currentParagraph.push(statement);
            if (isAbnormal) {
                currentStatus = "abnormal";
            }
        };

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;
            console.log("Processed Lero", `${name} ${valueText}`);

            if (name === "Abdominal distention") {
                if (isValidDate(ob.obs_datetime)) {
                    currentTime = ob.obs_datetime;
                } else {
                    currentTime = new Date().toISOString();
                }
            }

            if (name === "Abdominal distention") {
                if (valueText === "Yes") {
                    addStatement("The patient has abdominal distention.", true);
                }else if (valueText === "No") {
                    addStatement("The patient has no abdominal distention.", true);
                }
            } else if (name === "Abnormalities present") {
                if (valueText === "Yes") {
                    addStatement("Abnormality present.", true);
                }else if (valueText === "No") {
                    addStatement("Abnormality not present.", true);
                }

            } else if (name === "Shifting dullness") {
                if (valueText === "Yes") {
                    addStatement("Shifting dullness present.", true);
                }else if (valueText === "No") {
                    addStatement("Shifting dullness not present.", true);
                }

            } else if (name === "Fluid thrill") {
                if (valueText === "Yes") {
                    addStatement("Fluid Thrill available.", true);
                } else {
                    addStatement("Fluid Thrill not available. ", true);
                }
            } else if (name === "Tenderness") {
                if (valueText === "No") {
                    addStatement("Tenderness not present. ", true);
                } else {
                    addStatement("Tenderness present. ", true);
                }
            } else if (name === "Bruit") {
                if (valueText === "Yes") {
                    addStatement("Bruit present. ", true);
                } else {
                    addStatement("Bruit not present.", true);
                }
            } else if (name === "Bowel sounds") {

                    addStatement(`Bowel sounds: ${valueText}. `, true);

            } else if (name === "General") {
                addStatement(`General  digital rectal examination results: ${valueText}.`, true);

            } else if (name === "Mass") {
                if (valueText === "No") {
                    addStatement("Mass not present. ", true);
                } else {
                    addStatement("Mass present. ", true);
                }
            } else if (name === "Sphincter tone") {
                addStatement(`Sphincter tone: ${valueText}.`, true);

            } else if (name === "Circumcision status") {
                if (valueText === "No") {
                    addStatement("Patient is not circumcised.", true);
                } else {
                    addStatement("Patient is circumcised.", true);
                }
            }else if (name === "Laceration") {
                if (valueText === "No") {
                    addStatement("Ulcerations/lacerations, bite marks not present.", true);
                } else {
                    addStatement("Ulcerations/lacerations, bite marks present.", true);
                }
            }else if (name === "Hematomas") {
                if (valueText === "No") {
                    addStatement("Signs of oedema, Hematomas, discolourations not present. ", true);
                } else {
                    addStatement("Signs of oedema, Hematomas, discolourations present. ", true);
                }
            }else if (name === "Inflammation") {
                if (valueText === "No") {
                    addStatement("Signs of inflammation, edema, lesions around periurethral tissue, bleedingnot not present.", true);
                } else {
                    addStatement("Signs of inflammation, edema, lesions around periurethral tissue, bleeding present.", true);
                }
            }else if (name === "Testicles") {
                if (valueText === "No") {
                    addStatement("Both Testicles not present. ", true);
                } else {
                    addStatement("Both Testicles present.", true);
                }
            }else if (name === "Additional Notes") {
                additionalNotes = `Additional Notes: ${valueText}`;
            }
        });

        if (currentParagraph.length > 0) {
            if (additionalNotes) {
                currentParagraph.push(additionalNotes);
            }

            paragraphs.push({
                paragraph: currentParagraph.join(" "),
                status: currentStatus,
                time: currentTime,
            });
        }

        return paragraphs;
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
                                color: data.status === "abnormal" ? "" : "primary.main",
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