"use client";
import { FormContainer } from "@/components";
import { PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { MedicalInPatientFlow } from "./";

function MedicalInPatientPage() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <MedicalInPatientFlow />
      </FormContainer>
    </>
  );
}
export default AuthGuard(MedicalInPatientPage, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
]);
