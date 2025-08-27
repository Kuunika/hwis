import { Typography, Box, CircularProgress } from "@mui/material";
import { useComponentNotes } from "@/hooks/useComponentNotes";
import { encounters } from "@/constants";

export const LastMealNotes = () => {
    const { notes, isLoading } = useComponentNotes(encounters.SUMMARY_ASSESSMENT);

    const isValidDate = (dateString: string) => {
        return !isNaN(new Date(dateString).getTime());
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Last Meal
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
                Last Meal
            </Typography>
            {notes.length > 0 ? (
                notes.map((data, index) => (
                    <Box key={index} sx={{ mb: 0, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 0 }}>
                            {isValidDate(data.time) ? new Date(data.time).toLocaleString() : "Invalid Date"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", mb: 0 }}>
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
                            ~ {data.creator}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
                    No Last Meal data available.
                </Typography>
            )}
        </Box>
    );
};