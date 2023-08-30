import React from "react";
import { Box } from "@mui/material";
import { MainButton, defaultTheme } from "shared-ui/src";

export default function PatientNav() {
  let titles = [
    "Clinical Notes",
    "Investigations",
    "Results",
    "Medications",
    "Dispositions",
  ];

  return (
    <Box sx={{ marginBottom: 2 }}>
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
    </Box>
  );
}
