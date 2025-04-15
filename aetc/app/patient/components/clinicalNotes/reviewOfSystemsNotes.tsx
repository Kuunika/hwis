import { Typography, Box } from "@mui/material";
import { useComponentNotes } from "@/hooks/useComponentNotes";
import { encounters } from "@/constants";

export const ReviewOfSystems = () => {
  const { notes, isLoading } = useComponentNotes(encounters.REVIEW_OF_SYSTEMS);

  const isValidDate = (dateString: string) => {
    return !isNaN(new Date(dateString).getTime());
  };

  // Safeguard sort (though the hook should already be sorting)
  const sortedNotes = [...notes].sort((a, b) => b.rawTime - a.rawTime);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
          Review of Systems
        </Typography>
        {sortedNotes.length === 0 ? (
            <Typography variant="body2" sx={{ fontStyle: "italic", color: "secondary.main" }}>
              No systems review recorded.
            </Typography>
        ) : (
            sortedNotes.map((data, index) => (
                <Box key={index} sx={{ mb: 2, position: 'relative' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
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