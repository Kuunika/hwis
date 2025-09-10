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
            <div style={{
                color: "#7f8c8d",
                fontSize: "14px",
                letterSpacing: "0.2px",
                marginTop: "8px",
                fontStyle: 'italic'
            }}>
                ~ {panelData[0].created_by} - {getHumanReadableDateTime(panelData[0].obs_datetime || new Date())}
            </div>
        );
    };

    const isRootConcept = (obs: Observation): boolean => {
        if (Array.isArray(config.rootConcept)) {
            return config.rootConcept.some(concept => obs.names[0]?.name === concept);
        }
        return obs.names[0]?.name === config.rootConcept;
    };

    const extractNotesData = () => {
        const notes: any[] = [];

        data.forEach(obs => {
            if (isRootConcept(obs) && obs.value) {
                const note: any = {
                    ...obs, // Spread the entire observation
                    timestamp: obs.obs_datetime || "",
                    created_by: obs.created_by,
                    rootValue: obs.value
                };

                // Extract all configured fields from children
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
    }, {} as Record<string, any[]>); // Fix: Use any[] instead of typeof notesData

    const defaultItemRenderer = (item: any) => (
        <div style={{ marginBottom: "6px" }}>
            {item.rootValue && (
                <div style={{ fontWeight: "100", marginBottom: "2px" }}>
                    - {item.rootValue}
                </div>
            )}
            <div style={{ paddingLeft: "16px" }}>
                {config.fields.map(
                    (field, fieldIndex) =>
                        item[field.conceptName] && (
                            <div
                                key={fieldIndex}
                                style={{
                                    marginBottom: "2px",
                                    ...(field.style || {}),
                                }}
                            >
                                - {field.displayName}: {item[field.conceptName]}
                            </div>
                        )
                )}
            </div>
        </div>
    );

    const renderItem = config.itemRenderer || defaultItemRenderer;

    return (
        <div style={{marginBottom: "12px", fontFamily: "Arial, sans-serif", lineHeight: 1.6}}>
            <h4 style={{ fontWeight: "bold", marginBottom: "4px" }}>{title}</h4>

            <div style={{ marginLeft: "20px" }}>
                {Object.entries(groupedData).map(([date, dateNotes]) => (
                    <div key={date} style={{ marginBottom: "8px" }}>
                        {(dateNotes as any[]).map((note, index) => ( // Fix: Cast dateNotes to any[]
                            <div key={index} style={{ marginBottom: "6px" }}>
                                {renderItem(note)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {renderTimestamp(data)}
        </div>
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
    // UPDATED Family Medical History Configuration
    FAMILY_HISTORY: {
        rootConcept: [
            "Family History Asthma",
            "Family History Diabetes Mellitus",
            "Family History Tuberculosis",
            "Family History Other Condition",
            "Family History Hypertension",
            "Family History Epilepsy",
            "Family History Cancer"
        ],
        fields: [
            {
                conceptName: "Relationship To Patient",
                displayName: "Relationship",
            }
        ],
        itemRenderer: (item: any) => {
            // Extract condition name from the observation names
            const rawConditionName = item.names?.[0]?.name || "";
            const conditionName = rawConditionName.replace("Family History ", "");

            // Handle different value types
            let conditionValue = item.value;
            let displayCondition = "";
            if (rawConditionName === "Family History Other Condition" ||
                rawConditionName === "Family History Cancer") {
                displayCondition = conditionValue !== "true" ? conditionValue : conditionName;
            } else {
                displayCondition = conditionValue === "true" ? "Yes" : conditionName;
            }

            let relationship = item["Relationship To Patient"];
            if (!relationship && item.children) {
                const relationshipChild = item.children.find((child: any) =>
                    child.names?.[0]?.name === "Relationship To Patient"
                );
                relationship = relationshipChild?.value;
            }

            return (
                <div style={{ marginBottom: "8px" }}>
                    <div style={{ fontWeight: "100", marginBottom: "4px" }}>
                        - {conditionName}: {displayCondition}
                    </div>
                    {relationship && (
                        <div style={{ paddingLeft: "16px", marginBottom: "0px", lineHeight: 1.6  }}>
                            - Relationship: {relationship}
                        </div>
                    )}
                </div>
            );
        }
    }
    }