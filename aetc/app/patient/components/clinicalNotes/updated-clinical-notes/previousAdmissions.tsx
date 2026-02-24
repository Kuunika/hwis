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

export const PreviousAdmissions: React.FC<{ data: Observation[] }> = ({ data }) => {
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

    const getAdmissionsWithDetails = () => {
        const admissions: {
            admissionDate: string;
            hospital: string;
            section: string;
            diagnosis: string;
            interventions: string;
            dischargeInstructions: string;
            followUp: string;
            timestamp: string;
            created_by?: string;
        }[] = [];

        data.forEach(obs => {
            if (obs.names[0]?.name === "Admission date" && obs.value && obs.children) {
                const admission: any = {
                    admissionDate: obs.value,
                    hospital: "",
                    section: "",
                    diagnosis: "",
                    interventions: "",
                    dischargeInstructions: "",
                    followUp: "",
                    timestamp: obs.obs_datetime || "",
                    created_by: obs.created_by
                };

                obs.children.forEach(child => {
                    switch (child.names[0]?.name) {
                        case "Health center hospitals":
                            admission.hospital = child.value;
                            break;
                        case "Admission section":
                            admission.section = child.value;
                            break;
                        case "ICD11 Diagnosis":
                            admission.diagnosis = child.value;
                            break;
                        case "Surgical interventions":
                        case "Surgical interventions for tuberculosis":
                        case "Surgical interventions for TB":
                            admission.interventions = child.value;
                            break;
                        case "Discharge Instructions":
                            admission.dischargeInstructions = child.value;
                            break;
                        case "Follow Up":
                            admission.followUp = child.value;
                            break;
                    }
                });

                admissions.push(admission);
            }
        });

        return admissions;
    };

    const admissions = getAdmissionsWithDetails();

    if (admissions.length === 0) return null;

    const groupedByTimestamp = admissions.reduce((groups, admission) => {
        const dateKey = admission.timestamp.split('T')[0]; // Group by date only
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(admission);
        return groups;
    }, {} as Record<string, typeof admissions>);

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Previous Admissions
            </Typography>

            <Box sx={{ pl: 2 }}>
                {Object.entries(groupedByTimestamp).map(([date, dateAdmissions]) => (
                    <Box key={date} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                            {getHumanReadableDateTime(dateAdmissions[0].timestamp)}
                        </Typography>
                        {dateAdmissions.map((admission, index) => (
                            <Box key={index} sx={{ ml: 2, mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    Admission: {admission.admissionDate}
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    {admission.hospital && (
                                        <Typography variant="body2">
                                            Hospital: {admission.hospital}
                                        </Typography>
                                    )}
                                    {admission.section && (
                                        <Typography variant="body2">
                                            Section: {admission.section}
                                        </Typography>
                                    )}
                                    {admission.diagnosis && (
                                        <Typography variant="body2">
                                            Diagnosis: {admission.diagnosis.split(',')[1] || admission.diagnosis}
                                            {admission.diagnosis.split(',')[0] && (
                                                <Typography component="span" sx={{ color: '#7f8c8d', fontSize: '0.9em', ml: 1 }}>
                                                    ({admission.diagnosis.split(',')[0]})
                                                </Typography>
                                            )}
                                        </Typography>
                                    )}
                                    {admission.interventions && (
                                        <Typography variant="body2">
                                            Interventions: {admission.interventions}
                                        </Typography>
                                    )}
                                    {admission.dischargeInstructions && (
                                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                            Discharge Instructions: {admission.dischargeInstructions}
                                        </Typography>
                                    )}
                                    {admission.followUp && (
                                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                            Follow-up: {admission.followUp}
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