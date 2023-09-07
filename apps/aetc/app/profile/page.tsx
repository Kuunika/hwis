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
    <Grid container spacing={4} >
      <Grid item xs={1} md={2} lg={2}>
          <PreviousVisits />
          <TemplateForms />
      </Grid>
      <Grid item xs={3} md={9} lg={9}>
          <AdminNav username="John Doe" />
          <PatientDetails name="James Doe" />
          <PatientNav/>
      </Grid>
    </Grid>
  );
}
