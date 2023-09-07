import React from "react";
import { Box, Typography} from "@mui/material";
import { MainCard, MainButton, defaultTheme } from "shared-ui/src";

export default function PatientNav() {
  let titles = [
    "Clinical Notes",
    "Investigations",
    "Results",
    "Medications",
    "Dispositions",
  ];

  return (
    <MainCard elevation={1}>
       <Box sx={{ marginBottom: 2}}>
      {titles.map((title, index) => {
        return (
          <MainButton
            key={index}
            variant="primary"
            title={title}
            onClick={() => {}}
            sx={{
              backgroundColor: defaultTheme.buttonColor,
              marginLeft: 0.5,
              color: defaultTheme.buttonTextColor,
              "&:hover": {
                backgroundColor: defaultTheme.buttonHoverColor,
                color: defaultTheme.white,
              },
            }}
          />
        );
      })}
    <Typography sx={{marginLeft: 1}}>Clinal Notes</Typography>
    </Box>
  </MainCard>
  );
}
