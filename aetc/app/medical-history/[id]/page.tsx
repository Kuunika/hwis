"use client";
import { FormContainer } from "@/components";
import { MedicalHistoryFlow } from "../components";
import { PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";

function SampleHistory() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <MedicalHistoryFlow />
      </FormContainer>
    </>
  );
}


export default SampleHistory;