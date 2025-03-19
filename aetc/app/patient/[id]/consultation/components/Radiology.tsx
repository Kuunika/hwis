import { RadiologyAdultImage } from "@/components/svgImages/radiologyAdult";
import { Box, Typography } from "@mui/material";

export const Radiology = () => {
  return (
    <Box>
      <Typography variant="h5">Radiology</Typography>
      <RadiologyAdultImage onValueChange={() => {}} />
    </Box>
  );
};
