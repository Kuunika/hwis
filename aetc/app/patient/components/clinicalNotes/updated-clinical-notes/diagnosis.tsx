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

export const Diagnosis: React.FC<{ data: Observation[] }> = ({ data }) => {
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

    const getDiagnosesWithDetails = () => {
        const diagnoses: {
            diagnosisDate: string;
            icd11Diagnosis: string;
            onTreatment: string;
            additionalDetails: string;
            timestamp: string;
            created_by?: string;
        }[] = [];

        data.forEach(obs => {
            if (obs.names[0]?.name === "Diagnosis date" && obs.value && obs.children) {
                const diagnosis: any = {
                    diagnosisDate: obs.value,
                    icd11Diagnosis: "",
                    onTreatment: "",
                    additionalDetails: "",
                    timestamp: obs.obs_datetime || "",
                    created_by: obs.created_by
                };

                obs.children.forEach(child => {
                    switch (child.names[0]?.name) {
                        case "ICD11 Diagnosis":
                            diagnosis.icd11Diagnosis = child.value;
                            break;
                        case "On treatment":
                            diagnosis.onTreatment = child.value;
                            break;
                        case "Additional Diagnosis Details":
                            diagnosis.additionalDetails = child.value;
                            break;
                    }
                });

                diagnoses.push(diagnosis);
            }
        });

        return diagnoses;
    };

    const diagnoses = getDiagnosesWithDetails();

    if (diagnoses.length === 0) return null;

    // Group by timestamp to show entries from different sessions
    const groupedByTimestamp = diagnoses.reduce((groups, diagnosis) => {
        const dateKey = diagnosis.timestamp.split('T')[0]; // Group by date only
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(diagnosis);
        return groups;
    }, {} as Record<string, typeof diagnoses>);

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Diagnosis
            </Typography>

            <Box sx={{ pl: 2 }}>
                {Object.entries(groupedByTimestamp).map(([date, dateDiagnoses]) => (
                    <Box key={date} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                            {getHumanReadableDateTime(dateDiagnoses[0].timestamp)}
                        </Typography>
                        {dateDiagnoses.map((diagnosis, index) => (
                            <Box key={index} sx={{ ml: 2, mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {diagnosis.icd11Diagnosis.split(',')[1] || diagnosis.icd11Diagnosis}
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '0.9em' }}>
                                        {diagnosis.icd11Diagnosis.split(',')[0]}
                                    </Typography>
                                    {diagnosis.diagnosisDate && (
                                        <Typography variant="body2">
                                            Date: {diagnosis.diagnosisDate.split(' ')[0]}
                                        </Typography>
                                    )}
                                    {diagnosis.onTreatment && (
                                        <Typography variant="body2">
                                            On Treatment: {diagnosis.onTreatment}
                                        </Typography>
                                    )}
                                    {diagnosis.additionalDetails && (
                                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                            Notes: {diagnosis.additionalDetails}
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