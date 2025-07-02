"use client";
import {
  BackButton,
  FormContainer,
  FormikInit,
  PatientInfoTab,
} from "@/components";
import { Box, Typography } from "@mui/material";
import { SoapForm } from "./components/soapForm";

export default function Page() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <Box sx={{ ml: 2, mr: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BackButton />
          </Box>
          <Typography variant="h4">SOAPIER</Typography>
          <br />
          <SoapForm />
        </Box>
      </FormContainer>
    </>
  );
}
