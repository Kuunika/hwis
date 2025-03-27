"use client";
import { Typography, Box } from "@mui/material";
import { WrapperBox } from "@/components";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { encounters } from "@/constants";

function AllergiesNotes() {
    const { params } = useParameters();
    const { data: historicData, isLoading: historyLoading } = getPatientsEncounters(params?.id as string);
    const [allergyAssessments, setAllergyAssessments] = useState<{ paragraph: string; time: string }[]>([]);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    useEffect(() => {
        if (!historyLoading && historicData) {
            const allergiesEncounters = historicData?.filter(
                (item) => item.encounter_type.uuid === encounters.ALLERGIES
            );

            const formattedAssessments: { paragraph: string; time: string }[] = [];

            allergiesEncounters?.forEach(encounter => {
                const obs = encounter.obs;
                const allergyNames: string[] = [];
                let assessmentTime = isValidDate(encounter.encounter_datetime)
                    ? encounter.encounter_datetime
                    : new Date().toISOString();

                obs?.forEach(item => {
                    item.children?.forEach((child: any) => {
                        if (child.value && !allergyNames.includes(child.value)) {
                            allergyNames.push(child.value);
                        }
                    });
                });

                if (allergyNames.length > 0) {
                    formattedAssessments.push({
                        paragraph: `Allergies noted: ${allergyNames.join(', ')}.`,
                        time: assessmentTime
                    });
                } else {
                    formattedAssessments.push({
                        paragraph: "No known allergies documented.",
                        time: assessmentTime
                    });
                }
            });

            setAllergyAssessments(formattedAssessments);
        }
    }, [historicData, historyLoading]);

    if (historyLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Allergies Notes
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <CircularProgress size={40} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Allergies
            </Typography>
            {allergyAssessments.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No allergy history available.
                </Typography>
            ) : (
                allergyAssessments.map((data, index) => (
                    <Box key={index} sx={{ mb: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "primary.main", mb: 1 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                            {data.paragraph}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
}

export default AllergiesNotes;