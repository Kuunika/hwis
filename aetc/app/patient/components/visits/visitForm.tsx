import {Box, Typography, Divider, Paper} from "@mui/material";

interface VisitDataProps {
  data: any[];
}

export const VisitForm = ({ data }: VisitDataProps) => {
  return (
      <Paper elevation={1} sx={{ padding: 2, borderRadius: 2 }}>
          {data.map((item, index) => {
              console.log("item", item)
              const name = item.names || "Unknown";
              console.log("tittle", name )
              const value = item.value || "No value provided";
              const date = item.obs_datetime ? new Date(item.obs_datetime).toLocaleString() : "Invalid Date";

              return (
                  <Box key={item.obs_id || index} sx={{ marginBottom: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "primary.main" }}>
                          {name}
                      </Typography>
                      <Typography variant="body1" sx={{ marginLeft: 2, color: "text.primary" }}>
                          {value}
                      </Typography>
                      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                  </Box>
              );
          })}
      </Paper>
  );
};