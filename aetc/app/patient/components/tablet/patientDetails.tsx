import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { FaVoicemail, FaPhone } from "react-icons/fa";
import { getActivePatientDetails, useVitals } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { calculateAge } from "@/helpers/dateTime";

export const PatientDetailsTablet = () => {
  const { patientId } = getActivePatientDetails();
  const { data: patient, isLoading } = getOnePatient(patientId as string);
  const { vitals } = useVitals();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "#f9fbfc",
      }}
    >
      {/* Top Section: Avatar and Patient Details */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Avatar and Details */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            sx={{
              width: 80,
              height: 80,
              border: "2px solid #ddd",
              boxShadow: 1,
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              {`${patient?.given_name} ${patient?.family_name}`}
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              {`${patient?.gender} | ${patient?.birthdate} (Age ${
                patient?.birthdate && calculateAge(patient?.birthdate)
              })`}
            </Typography>
          </Box>
        </Box>

        {/* Edit Button */}
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#1976d2",
            color: "#fff",
            textTransform: "capitalize",
            boxShadow: 1,
          }}
        >
          Edit
        </Button>
      </Box>

      {/* Health Stats Section */}
      <Grid container spacing={1}>
        {vitals.map((vital: any) => (
          <Grid item xs={6} sm={3} key={vital.label}>
            <Box
              sx={{
                p: 1,
                textAlign: "center",
                bgcolor: "#fff",
                borderRadius: 1,
                // border: "1px solid #ddd",
                height: "100px", // Set a uniform height
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "#555" }}>
                {vital.name}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                {vital.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
