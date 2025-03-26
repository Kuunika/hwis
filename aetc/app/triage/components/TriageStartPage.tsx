"use client";

import { PatientInfoTab } from "@/components";
import TriageWorkFlow from "./triageWorkFlow";
import { FormContainer } from "@/components";
import AuthGuard from "@/helpers/authguard";
import { roles } from "@/constants";
function TriageStartPage() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <TriageWorkFlow />
      </FormContainer>
    </>
  );
}

export default AuthGuard(TriageStartPage, [roles.CLINICIAN, roles.NURSE, roles.ADMIN])