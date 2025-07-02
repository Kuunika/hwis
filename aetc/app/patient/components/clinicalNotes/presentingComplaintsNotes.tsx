import { Typography, Box, CircularProgress } from "@mui/material";
import { useComponentNotes } from "@/hooks/useComponentNotes";
import { encounters } from "@/constants";
import { useVisitDates } from "@/contexts/visitDatesContext";

export const PresentingComplaintsNotes = () => {
  const { notes, isLoading } = useComponentNotes(encounters.PRESENTING_COMPLAINTS);
  const { visitDate } = useVisitDates();

  if (isLoading) {
    return (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
            Presenting Complaints
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
          Presenting Complaints
        </Typography>
        {notes.length === 0 ? (
            <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
              No presenting complaints available.
            </Typography>
        ) : (
            notes.map((data, index) => (
                <Box key={index} sx={{ mb: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 0 }}>
                    {new Date(data.time).toLocaleString()}
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
                        mt: 0
                      }}
                  >
                    ~ {data.creator}
                  </Typography>
                </Box>
            ))
        )}
      </Box>
  );
};