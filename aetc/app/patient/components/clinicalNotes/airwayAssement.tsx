import { Typography, Box } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const AirwayAssessment = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [airwayAssessmentData, setAirwayAssessmentData] = useState<{ paragraph: string; time: string; creator: string }[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const airwayEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.AIRWAY_ASSESSMENT
            );

            if (airwayEncounter) {
                const formattedData = formatAirwayAssessmentData(airwayEncounter.obs);
                setAirwayAssessmentData(formattedData);
            }
        }
    }, [patientHistory, historyLoading]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    const formatAirwayAssessmentData = (obs: any[]) => {
        const paragraphs: { paragraph: string; time: string; rawTime: number; creator: string }[] = [];
        let currentParagraph: string[] = [];
        let currentTime = "";
        let currentCreator = "";
        let airwayReasons: string[] = [];
        let airwayInterventions: string[] = [];

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;
            const creator = ob.created_by;

            if (name === "Airway Patent" && currentParagraph.length > 0) {
                if (airwayReasons.length > 0) {
                    currentParagraph.push(`The airway obstruction is attributed to ${airwayReasons.join(", ")}.`);
                    airwayReasons = [];
                }
                if (airwayInterventions.length > 0) {
                    currentParagraph.push(`Interventions performed: ${airwayInterventions.join(", ")}.`);
                    airwayInterventions = [];
                }

                paragraphs.push({
                    paragraph: currentParagraph.join(" "),
                    time: currentTime,
                    creator: currentCreator,
                    rawTime: new Date(currentTime).getTime(),
                });

                currentParagraph = [];
            }

            if (name === "Airway Patent") {
                if (isValidDate(ob.obs_datetime)) {
                    currentTime = ob.obs_datetime;
                } else {
                    console.error("Invalid obs_datetime:", ob.obs_datetime);
                    currentTime = new Date().toISOString();
                }
                currentCreator = creator;
            }

            if (name === "Airway Patent") {
                if (valueText === "Yes") {
                    currentParagraph.push("The airway is patent.");
                } else if (valueText === "No") {
                    currentParagraph.push("The airway is not patent.");
                } else {
                    currentParagraph.push("The patient's airway is threatened.");
                }
            } else if (name === "Airway Reason") {
                airwayReasons.push(valueText);
            } else if (name === "Airway Opening Intervention") {
                airwayInterventions.push(valueText);
            } else if (name === "Patient Injured") {
                if (valueText === "Yes") {
                    currentParagraph.push("The patient has sustained injuries.");
                } else if (valueText === "No") {
                    currentParagraph.push("The patient is not injured.");
                }
            } else if (name === "Neck collar applied") {
                if (valueText === "Yes") {
                    currentParagraph.push("The patient was stabilised by applying the Neck Collar.");
                } else if (valueText === "No") {
                    currentParagraph.push("The Neck Collar was not applied.");
                } else {
                    currentParagraph.push("Application of a Neck Collar was not indicated.");
                }
            } else if (name === "Head blocks applied") {
                if (valueText === "Yes") {
                    currentParagraph.push("Head blocks were applied to stabilize the C-Spine.");
                } else {
                    currentParagraph.push("Head blocks were not applied as an Intervention to stabilize the C-Spine.");
                }
            }
        });

        if (airwayReasons.length > 0) {
            currentParagraph.push(`The airway obstruction is attributed to ${airwayReasons.join(", ")}.`);
        }
        if (airwayInterventions.length > 0) {
            currentParagraph.push(`Interventions performed: ${airwayInterventions.join(", ")}.`);
        }

        if (currentParagraph.length > 0) {
            paragraphs.push({
                paragraph: currentParagraph.join(" "),
                time: currentTime,
                creator: currentCreator,
                rawTime: new Date(currentTime).getTime(),
            });
        }

        return paragraphs.sort((a, b) => b.rawTime - a.rawTime);
    };

    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Airway Assessment
            </Typography>
            {airwayAssessmentData.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No airway assessment data available.
                </Typography>
            ) : (
                airwayAssessmentData.map((data, index) => (
                    <Box key={index} sx={{ mb: 0, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "primary.main", mb: 0 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", mb: 0 }}>
                            {data.paragraph}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                textAlign: 'right',
                                color: 'text.secondary',
                                fontStyle: 'italic',
                                mt: 0
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