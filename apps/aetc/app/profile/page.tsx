"use client";
import { Grid, Typography } from "@mui/material";
import { MainCard } from "shared-ui/src";
import PreviousVisits from "./components/previousVisits";
import TemplateForms from "./components/templateForms";
import { AdminNav } from "./components/adminNav";
import { PatientDetails } from "./components/patientDetails";
import PatientNav from "./components/patientNav";

export default function Profile() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={2} md={4} lg={3}>
        <MainCard elevation={3} sx={{ border:1, marginBottom: 2, padding: 2 }}>
          <PreviousVisits />
        </MainCard>
        <MainCard elevation={3} sx={{ border:1, marginBottom: 2, padding: 2 }}>
          <TemplateForms />
        </MainCard>
      </Grid>
      <Grid item xs={3} md={8} lg={9}>
        <MainCard elevation={3} sx={{ display: "flex", alignItems: "flex-end", border: 1, marginBottom: 1}}>
          <AdminNav username="John Doe" />
        </MainCard>
        <MainCard elevation={3} sx={{ border:"none", marginBottom: 2 }}>
          <PatientDetails name="James Doe" />
        </MainCard>
        {<PatientNav />}
        <MainCard elevation={3} sx={{ border:1 }}>
          <Typography>Clinal Notes</Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
