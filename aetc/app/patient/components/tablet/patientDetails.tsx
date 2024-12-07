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
import { getActivePatientDetails } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";
import { calculateAge } from "@/helpers/dateTime";

export const PatientDetailsTablet = () => {
  const { patientId } = getActivePatientDetails();
  const { data: patient, isLoading } = getOnePatient(patientId as string);

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
        {[
          { label: "BMI", value: "22.4", trend: "▼10" },
          { label: "Weight", value: "92 kg", trend: "▼10 kg" },
          { label: "Height", value: "175 cm" },
          { label: "Blood Pressure", value: "124/80", trend: "▲10" },
          { label: "Blood Pressure", value: "124/80", trend: "▲10" },
          { label: "Blood Pressure", value: "124/80", trend: "▲10" },
          { label: "Blood Pressure", value: "124/80", trend: "▲10" },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
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
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "#555" }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                {stat.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
