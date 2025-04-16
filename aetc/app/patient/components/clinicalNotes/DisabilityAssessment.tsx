import { Typography, Box } from "@mui/material";
import { useComponentNotes } from "@/hooks/useComponentNotes";
import { encounters } from "@/constants";

export const DisabilityAssessment = () => {
  const { notes, isLoading } = useComponentNotes(encounters.DISABILITY_ASSESSMENT);
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
          Disability Assessment
        </Typography>
        {notes.length === 0 ? (
            <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
              No disability assessment data available.
            </Typography>
        ) : (
            notes.map((data, index) => (
                <Box key={index} sx={{ mb: 2, position: 'relative' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                    {new Date(data.time).toLocaleString()}
                  </Typography>
                  <Typography
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        mb: 0,
                        whiteSpace: 'pre-line' // Preserves line breaks
                      }}
                  >
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
                    ~{data.creator}
                  </Typography>
                </Box>
            ))
        )}
      </Box>
  );
};