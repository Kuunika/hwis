import React from "react";
import { Box, Typography } from "@mui/material";
import { getHumanReadableDateTime } from "@/helpers/dateTime";
import {config} from "winston";

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

interface GenericNotesProps {
    data: Observation[];
    title: string;
    config: {
        rootConcept: string | string[];
        fields: {
            conceptName: string;
            displayName: string;
            format?: (value: string) => string;
            style?: React.CSSProperties;
        }[];
        groupBy?: string;
        itemRenderer?: (item: any) => React.ReactNode;
    };
}

export const GenericNotes: React.FC<GenericNotesProps> = ({
                                                              data,
                                                              title,
                                                              config
                                                          }) => {
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

    const isRootConcept = (obs: Observation): boolean => {
        if (Array.isArray(config.rootConcept)) {
            return config.rootConcept.some(concept => obs.names[0]?.name === concept);
        }
        return obs.names[0]?.name === config.rootConcept;
    };

    const extractNotesData = () => {
        // Extract notes based on the root concept and configured fields
        const notes: {
            [key: string]: any;
            timestamp: string;
            created_by?: string;
            rootValue?: string;
        }[] = [];

        data.forEach(obs => {
            if (isRootConcept(obs) && obs.value && obs.children) {
                const note: any = {
                    timestamp: obs.obs_datetime || "",
                    created_by: obs.created_by,
                    rootValue: obs.value
                };

                // Extract all configured fields
                config.fields.forEach(field => {
                    const child = obs.children?.find(c =>
                        c.names[0]?.name === field.conceptName
                    );
                    if (child) {
                        note[field.conceptName] = field.format
                            ? field.format(child.value)
                            : child.value;
                    }
                });

                notes.push(note);
            }
        });

        return notes;
    };

    const notesData = extractNotesData();

    if (notesData.length === 0) return null;

    // Group by timestamp or specified field
    const groupKey = config.groupBy || 'timestamp';
    const groupedData = notesData.reduce((groups, note) => {
        const key = note[groupKey]?.split?.('T')[0] || note[groupKey] || 'unknown';
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(note);
        return groups;
    }, {} as Record<string, typeof notesData>);

    const defaultItemRenderer = (item: any) => (
        <>
            {item.rootValue && (
                <Typography variant="body2" sx={{ fontWeight: 'large', mb: 0 }}>
                    -{item.rootValue}
                </Typography>
            )}
            <Box sx={{ ml: 2 }}>
                {config.fields.map((field, fieldIndex) => (
                    item[field.conceptName] && (
                        <Typography
                            key={fieldIndex}
                            variant="body2"
                            sx={field.style}
                        >
                            -{field.displayName}: {item[field.conceptName]}
                        </Typography>
                    )
                ))}
            </Box>
        </>
    );

    const renderItem = config.itemRenderer || defaultItemRenderer;

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0 }}>
                {title}
            </Typography>

            <Box sx={{ pl: 2 }}>
                {Object.entries(groupedData).map(([date, dateNotes]) => (
                    <Box key={date} sx={{ mb: 1 }}>
                        {dateNotes.map((note, index) => (
                            <Box key={index} sx={{ ml: 2, mt: 1, mb: 1.5 }}>
                               {renderItem(note)}
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>

            {renderTimestamp(data)}
        </Box>
    );
};

// Configuration presets for different clinical components
export const NotesConfig = {
    // Allergies Configuration
    ALLERGIES: {
        rootConcept: "Allergen Category",
        fields: [
            {
                conceptName: "Allergen",
                displayName: "Allergens",
                format: (value:any) => value
            },
            {
                conceptName: "Description",
                displayName: "Notes",
            }
        ]
    },

    // Medications Configuration
    MEDICATIONS: {
        rootConcept: "Drug Given",
        fields: [
            { conceptName: "Medication Formulation", displayName: "Formulation" },
            { conceptName: "Medication Dose", displayName: "Dose" },
            { conceptName: "Medication Dose Unit", displayName: "Unit" },
            { conceptName: "Medication Frequency", displayName: "Frequency" },
            { conceptName: "Medication Duration", displayName: "Duration" },
            { conceptName: "Medication Duration Unit", displayName: "Duration Unit" },
            { conceptName: "Description", displayName: "Notes",}
        ]
    },

    // Diagnosis Configuration
    DIAGNOSIS: {
        rootConcept: "Diagnosis date",
        fields: [
            {
                conceptName: "ICD11 Diagnosis",
                displayName: "Diagnosis",
                format: (value:any) => {
                    const parts = value.split(',');
                    return parts.length > 1 ? `${parts[1].trim()} (${parts[0].trim()})` : value;
                }
            },
            { conceptName: "On treatment", displayName: "On Treatment" },
            {
                conceptName: "Additional Diagnosis Details",
                displayName: "Details",
            }
        ]
    },

    // Surgical History Configuration
    SURGICAL_HISTORY: {
        rootConcept: "Surgical Procedure",
        fields: [
            { conceptName: "Date of surgery", displayName: "Date" },
            { conceptName: "Indication For Surgery", displayName: "Indication" },
            {
                conceptName: "Complications",
                displayName: "Complications",
            }
        ]
    },

    // Previous Admissions Configuration
    ADMISSIONS: {
        rootConcept: "Admission date",
        fields: [
            { conceptName: "Health center hospitals", displayName: "Hospital" },
            { conceptName: "Admission section", displayName: "Section" },
            {
                conceptName: "ICD11 Diagnosis",
                displayName: "Diagnosis",
                format: (value: any) => {
                    const parts = value.split(',');
                    return parts.length > 1 ? `${parts[1].trim()} (${parts[0].trim()})` : value;
                }
            },
            { conceptName: "Surgical interventions", displayName: "Interventions" },
            {
                conceptName: "Discharge Instructions",
                displayName: "Discharge Instructions",

            },
            { conceptName: "Follow Up", displayName: "Follow-up" }
        ]
    },

    // Last Meal Configuration
    LAST_MEAL: {
        rootConcept: "Time of last meal",
        fields: [
            {
                conceptName: "Description of last meal",
                displayName: "Meal Description",
            }
        ]
    },

    // Presenting Complaints Configuration
    PRESENTING_COMPLAINTS: {
        rootConcept: ["Presenting Complaints", "Current complaints or symptoms"],
        fields: [
            {
                conceptName: "Duration Of Symptoms Days",
                displayName: "Duration (days)"
            },
            {
                conceptName: "Duration Of Symptoms Hours",
                displayName: "Duration (hours)"
            },
            {
                conceptName: "Duration Of Symptoms Weeks",
                displayName: "Duration (weeks)"
            },
            {
                conceptName: "Duration Of Symptoms Months",
                displayName: "Duration (months)"
            },
            {
                conceptName: "Duration Of Symptoms Years",
                displayName: "Duration (years)"
            }
        ]
    },

    // Family Medical History Configuration
    FAMILY_HISTORY: {
        rootConcept: [
            "Family History Asthma",
            "Family History Diabetes Mellitus",
            "Family History Tuberculosis",
            "Family History Other Condition"
        ],
        fields: [
            {
                conceptName: "Relationship To Patient",
                displayName: "Relationship",
            }
        ],
        itemRenderer: (item: any) => (
            <>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {item.rootValue === "true" ?
                        item.timestamp.includes("Family History") ?
                            item.timestamp.replace("Family History ", "") :
                            "Other Condition"
                        : item.rootValue
                    }
                </Typography>
                <Box sx={{ ml: 2 }}>
                    {item["Relationship To Patient"] && (
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                            Relationship: {item["Relationship To Patient"]}
                        </Typography>
                    )}
                </Box>
            </>
        )
    },
};