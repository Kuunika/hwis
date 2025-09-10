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

export const Allergies: React.FC<{ data: Observation[] }> = ({ data }) => {
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

    const getAllergiesWithDetails = () => {
        const allergies: {
            category: string;
            allergens: string[];
            description: string;
            timestamp: string;
            created_by?: string;
        }[] = [];

        data.forEach(obs => {
            if (obs.names[0]?.name === "Allergen Category" && obs.value && obs.children) {
                const allergenChildren = obs.children.filter(child =>
                    child.names[0]?.name === "Allergen"
                );

                const descriptionChild = obs.children.find(child =>
                    child.names[0]?.name === "Description"
                );

                allergies.push({
                    category: obs.value,
                    allergens: allergenChildren.map(allergen => allergen.value),
                    description: descriptionChild?.value || "",
                    timestamp: obs.obs_datetime || "",
                    created_by: obs.created_by
                });
            }
        });

        return allergies;
    };

    const allergies = getAllergiesWithDetails();

    if (allergies.length === 0) return null;

    // Group by timestamp to show entries from different sessions
    const groupedByTimestamp = allergies.reduce((groups, allergy) => {
        const dateKey = allergy.timestamp.split('T')[0]; // Group by date only
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(allergy);
        return groups;
    }, {} as Record<string, typeof allergies>);

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Allergies
            </Typography>

            <Box sx={{ pl: 2 }}>
                {Object.entries(groupedByTimestamp).map(([date, dateAllergies]) => (
                    <Box key={date} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                            {getHumanReadableDateTime(dateAllergies[0].timestamp)}
                        </Typography>
                        {dateAllergies.map((allergy, index) => (
                            <Box key={index} sx={{ ml: 2, mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {allergy.category}:
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    {allergy.allergens.map((allergen, allergenIndex) => (
                                        <Typography key={allergenIndex} variant="body2" sx={{ ml: 1 }}>
                                            • {allergen}
                                        </Typography>
                                    ))}
                                    {allergy.description && (
                                        <Typography variant="body2" sx={{ color: '#7f8c8d', mt: 0.5, fontStyle: 'italic' }}>
                                            Note: {allergy.description}
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