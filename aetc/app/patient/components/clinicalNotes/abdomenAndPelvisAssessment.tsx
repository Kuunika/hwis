import { Typography, Box } from "@mui/material";
import { useComponentNotes } from "@/hooks/useComponentNotes";
import { encounters } from "@/constants";

export const AbdomenAndPelvisAssessment = () => {
    const { notes, isLoading } = useComponentNotes(encounters.ABDOMEN_AND_PELVIS_ASSESSMENT);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Abdomen and Pelvis
            </Typography>
            {notes.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No abdomen and pelvis assessment data available.
                </Typography>
            ) : (
                notes.map((data, index) => (
                    <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "primary.main", mb: 1 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", mb: 1 }}>
                            {data.paragraph}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                textAlign: 'right',
                                color: 'text.secondary',
                                fontStyle: 'italic',
                                mt: 1
                            }}
                        >
                            ~{data.creator}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
};