"use client";

import { FormContainer } from "@/components";
import { PatientInfoTab } from "@/components";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { PatientManagementFlow } from "./components/patientManagementFlow";

function PatientManagementPlan() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <PatientManagementFlow />
      </FormContainer>
    </>
  );
}

export default AuthGuard(PatientManagementPlan, [roles.CLINICIAN, roles.NURSE, roles.ADMIN]);
