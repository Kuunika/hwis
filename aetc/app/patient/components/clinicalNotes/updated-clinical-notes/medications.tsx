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

export const Medications: React.FC<{ data: Observation[] }> = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    const renderTimestamp = (panelData: Observation[]) => {
        if (!panelData?.[0]?.created_by) return null;

        return (
            <Typography sx={{ color: "#7f8c8d", fontSize: "14px", letterSpacing: "0.2px", mt: 1 }}>
                ~ {panelData[0].created_by} - {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
            </Typography>
        );
    };

    const getMedicationsWithDetails = () => {
        const medications: {
            drug: string;
            formulation: string;
            dose: string;
            doseUnit: string;
            frequency: string;
            duration: string;
            durationUnit: string;
            lastTaken: string;
            lastPrescribed: string;
            selfMedicated: string;
            description: string;
            timestamp: string;
            created_by?: string;
        }[] = [];

        data.forEach(obs => {
            if (obs.names[0]?.name === "Drug Given" && obs.value && obs.children) {
                const medication: any = {
                    drug: obs.value,
                    formulation: "",
                    dose: "",
                    doseUnit: "",
                    frequency: "",
                    duration: "",
                    durationUnit: "",
                    lastTaken: "",
                    lastPrescribed: "",
                    selfMedicated: "",
                    description: "",
                    timestamp: obs.obs_datetime || "",
                    created_by: obs.created_by
                };

                obs.children.forEach(child => {
                    switch (child.names[0]?.name) {
                        case "Medication Formulation":
                            medication.formulation = child.value;
                            break;
                        case "Medication Dose":
                            medication.dose = child.value;
                            break;
                        case "Medication Dose Unit":
                            medication.doseUnit = child.value;
                            break;
                        case "Medication Frequency":
                            medication.frequency = child.value;
                            break;
                        case "Medication Duration":
                            medication.duration = child.value;
                            break;
                        case "Medication Duration Unit":
                            medication.durationUnit = child.value;
                            break;
                        case "Medication Date Last Taken":
                            medication.lastTaken = child.value;
                            break;
                        case "Medication Date Of Last Prescription":
                            medication.lastPrescribed = child.value;
                            break;
                        case "Self medicated":
                            medication.selfMedicated = child.value;
                            break;
                        case "Description":
                            medication.description = child.value;
                            break;
                        case "Dose in milligrams":
                            medication.dose = child.value;
                            medication.doseUnit = "mg";
                            break;
                        case "Duration On Medication Days":
                            medication.duration = child.value;
                            medication.durationUnit = "days";
                            break;
                        case "Duration On Medication Hours":
                            medication.duration = child.value;
                            medication.durationUnit = "hours";
                            break;
                    }
                });

                medications.push(medication);
            }
        });

        return medications;
    };

    const medications = getMedicationsWithDetails();

    if (medications.length === 0) return null;

    // Group by timestamp to show entries from different sessions
    const groupedByTimestamp = medications.reduce((groups, medication) => {
        const dateKey = medication.timestamp.split('T')[0]; // Group by date only
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(medication);
        return groups;
    }, {} as Record<string, typeof medications>);

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Medications
            </Typography>

            <Box sx={{ pl: 2 }}>
                {Object.entries(groupedByTimestamp).map(([date, dateMedications]) => (
                    <Box key={date} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                            {getHumanReadableDateTime(dateMedications[0].timestamp)}
                        </Typography>
                        {dateMedications.map((medication, index) => (
                            <Box key={index} sx={{ ml: 2, mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {medication.drug}
                                    {medication.formulation && ` (${medication.formulation})`}
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    {medication.dose && (
                                        <Typography variant="body2">
                                            Dose: {medication.dose} {medication.doseUnit}
                                        </Typography>
                                    )}
                                    {medication.frequency && (
                                        <Typography variant="body2">
                                            Frequency: {medication.frequency}
                                        </Typography>
                                    )}
                                    {medication.duration && (
                                        <Typography variant="body2">
                                            Duration: {medication.duration} {medication.durationUnit}
                                        </Typography>
                                    )}
                                    {medication.lastTaken && (
                                        <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                            Last taken: {medication.lastTaken}
                                        </Typography>
                                    )}
                                    {medication.lastPrescribed && (
                                        <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                            Last prescribed: {medication.lastPrescribed}
                                        </Typography>
                                    )}
                                    {medication.selfMedicated && (
                                        <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                            Self-medicated: {medication.selfMedicated}
                                        </Typography>
                                    )}
                                    {medication.description && (
                                        <Typography variant="body2" sx={{ color: '#7f8c8d', fontStyle: 'italic' }}>
                                            Note: {medication.description}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};