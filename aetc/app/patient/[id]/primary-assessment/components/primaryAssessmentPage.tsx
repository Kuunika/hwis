"use client";
import { FormContainer } from "@/components";
import { PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { PrimaryAssessmentFlow } from ".";

function PrimaryAssessmentPage() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <PrimaryAssessmentFlow />
      </FormContainer>
    </>
  );
}
export default AuthGuard(PrimaryAssessmentPage, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
]);
