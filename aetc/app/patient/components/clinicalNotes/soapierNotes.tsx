import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getActivePatientDetails } from "@/hooks/getActivePatientDetails";
import { useEffect, useState } from "react";
import { encounters } from "@/constants";

export const SoapierNotes = () => {
    const { patientId }: { patientId: any } = getActivePatientDetails();
    const { data: patientHistory, isLoading: historyLoading } = getPatientsEncounters(patientId);
    const [soapNotes, setSoapNotes] = useState<{ time: string; data: any[] }[]>([]);

    useEffect(() => {
        if (!historyLoading && patientHistory) {
            const soapierEncounter = patientHistory.find(
                (encounter: any) => encounter?.encounter_type?.uuid === encounters.NURSING_CARE_NOTES
            );

            if (soapierEncounter) {
                const formattedData = formatSoapierAssessmentData(soapierEncounter.obs);
                setSoapNotes(formattedData);
            }
            // console.log("Ma Encounter", soapierEncounter);
        }
    }, [patientHistory, historyLoading]);

    const formatSoapierAssessmentData = (obs: any[]) => {
        const groupedData: { time: string; data: any[] }[] = [];
        let currentBlock: { time: string; data: any[] } | null = null;

        obs.forEach((ob: any) => {
            const name = ob.names?.[0]?.name;
            const valueText = ob.value;
            const time = ob.obs_datetime;
            // console.log("Processing observation:", { name, valueText, time });

            let humanReadableResponse = "";

            if (name === "Subjective") {
                if (currentBlock) {
                    groupedData.push(currentBlock);
                }
                currentBlock = {
                    time: time,
                    data: [],
                };
                humanReadableResponse = `Subjective: ${valueText}`;
            } else if (name === "Objective") {
                humanReadableResponse = `Objective: ${valueText}`;
            } else if (name === "Assessment") {
                humanReadableResponse = `Assessment: ${valueText}`;
            } else if (name === "Plan") {
                humanReadableResponse = `Plan: ${valueText}`;
            } else if (name === "Intervention") {
                humanReadableResponse = `Intervention: ${valueText}`;
            } else if (name === "Evaluation") {
                humanReadableResponse = `Evaluation: ${valueText}`;
            } else if (name === "Replan") {
                humanReadableResponse = `Re-plan: ${valueText}`;
            } else if (name === "Implementation") {
                humanReadableResponse = `Implementation: ${valueText}`;
            }

            if (humanReadableResponse && currentBlock) {
                currentBlock.data.push({
                    name: name,
                    value: humanReadableResponse,
                });
            }
        });

        if (currentBlock) {
            groupedData.push(currentBlock);
        }

        return groupedData;
    };

    if (historyLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            {soapNotes.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "main.secondary" }}>
                    No SOAPIER notes available.
                </Typography>
            ) : (
                soapNotes.map((block, blockIndex) => (
                    <Box key={blockIndex} sx={{ mb: 3, borderBottom: "1px solid #E0E0E0", pb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                            {new Date(block.time).toLocaleString()}
                        </Typography>
                        <List sx={{ listStyleType: "disc", pl: 4 }}>
                            {block.data.map((data, index) => (
                                <ListItem key={index} sx={{ display: "list-item", p: 0 }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" sx={{ color: "text.primary" }}>
                                                {data.value}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))
            )}
        </Box>
    );
};