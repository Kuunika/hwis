import { Box, Typography } from "@mui/material";
import { useComponentNotes } from "@/hooks/useComponentNotes";
import { encounters } from "@/constants";
import { getHumanReadableDateTime } from "@/helpers/dateTime";

export const GeneralClinicalNotes = () => {
    const { notes, isLoading } = useComponentNotes(encounters.CLINICAL_NOTES);

    if (isLoading) {
        return <Typography>Loading clinical notes...</Typography>;
    }

    return (
        <Box sx={{
            overflow: "scroll",
            maxHeight: "40ch",
            pl: "2ch",
        }}>
            {notes.length === 0 ? (
                <Typography>No clinical notes available</Typography>
            ) : (
                notes.map((data, index) => (
                    <Box
                        key={`${data.time}-${index}`}
                        sx={{
                            my: "1ch",
                            py: "1ch",
                            borderBottom: "1px solid #E0E0E0",
                        }}
                    >
                        <Typography variant="body1" sx={{ color: "text.primary", mb: 0 }}>
                            {data.paragraph}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="caption">
                                ~ {data.creator}
                            </Typography>
                            <Typography variant="caption">
                                {getHumanReadableDateTime(data.time)}
                            </Typography>
                        </Box>
                    </Box>
                ))
            )}
        </Box>
    );
};