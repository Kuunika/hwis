"use client";
import { FormContainer } from "@/components";
import { PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { MedicalInPatientFlow } from "./components";

function PrimaryAssessment() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <MedicalInPatientFlow />
      </FormContainer>
    </>
  );
}
export default AuthGuard(PrimaryAssessment, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
]);
