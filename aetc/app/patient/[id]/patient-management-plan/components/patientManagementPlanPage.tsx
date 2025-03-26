"use client";

import { FormContainer } from "@/components";
import { PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { PatientManagementFlow } from "./patientManagementFlow";

function PatientManagementPlanPage() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <PatientManagementFlow />
      </FormContainer>
    </>
  );
}

export default AuthGuard(PatientManagementPlanPage, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
]);
