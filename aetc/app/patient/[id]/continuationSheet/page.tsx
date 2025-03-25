import { BackButton, FormContainer, PatientInfoTab } from "@/components";
import { Box, Typography } from "@mui/material";
import { ContinuationSheetForm } from "./components/continuationSheetForm";

export default function Page() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BackButton />
          </Box>
          <Typography variant="h4">Continuation Sheet</Typography>
          <br />
          <ContinuationSheetForm />
        </Box>
      </FormContainer>
    </>
  );
}

export function generateStaticParams() {
  return [];
}
