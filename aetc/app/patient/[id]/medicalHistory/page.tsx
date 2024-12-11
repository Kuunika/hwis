"use client";
import { FormContainer } from "@/components";
import { MedicalHistoryFlow } from "./components";
import { PatientInfoTab } from "@/components";

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