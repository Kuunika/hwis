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
        <MainCard elevation={3}>
          <PreviousVisits />
        </MainCard>
        <MainCard elevation={3}>
          <TemplateForms />
        </MainCard>
      </Grid>
      <Grid item xs={3} md={7} lg={9}>
        <MainCard sx={{ justifyContent: "right" }}>
          <AdminNav username="John Doe" />
        </MainCard>
        <MainCard sx={{ border: "none" }}>
          <PatientDetails name="James Doe" />
        </MainCard>

        {<PatientNav />}
        <MainCard marginTop="5dp">
          <Typography>Clinal Notes</Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
