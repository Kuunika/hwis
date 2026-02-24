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

export const LastMeal: React.FC<{ data: Observation[] }> = ({ data }) => {
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

    const getLastMealDetails = () => {
        const meals: {
            time: string;
            description: string;
            timestamp: string;
            created_by?: string;
        }[] = [];

        data.forEach(obs => {
            if (obs.names[0]?.name === "Time of last meal" && obs.value && obs.children) {
                const meal: any = {
                    time: obs.value,
                    description: "",
                    timestamp: obs.obs_datetime || "",
                    created_by: obs.created_by
                };

                obs.children.forEach(child => {
                    if (child.names[0]?.name === "Description of last meal") {
                        meal.description = child.value;
                    }
                });

                meals.push(meal);
            }
        });

        return meals;
    };

    const meals = getLastMealDetails();

    if (meals.length === 0) return null;

    // Group by timestamp to show entries from different sessions
    const groupedByTimestamp = meals.reduce((groups, meal) => {
        const dateKey = meal.timestamp.split('T')[0];
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(meal);
        return groups;
    }, {} as Record<string, typeof meals>);

    return (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Last Meal
            </Typography>

            <Box sx={{ pl: 2 }}>
                {Object.entries(groupedByTimestamp).map(([date, dateMeals]) => (
                    <Box key={date} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                            {getHumanReadableDateTime(dateMeals[0].timestamp)}
                        </Typography>
                        {dateMeals.map((meal, index) => (
                            <Box key={index} sx={{ ml: 2, mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    Time: {meal.time.split(',')[0]} {/* Show only the date part */}
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    {meal.description && (
                                        <Typography variant="body2">
                                            Description: {meal.description}
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