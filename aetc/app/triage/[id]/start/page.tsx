"use client";

import { PatientInfoTab } from "@/components";
import TriageWorkFlow from "../../components/triageWorkFlow";
import { FormContainer } from "@/components";
import AuthGuard from "@/helpers/authguard";
import { roles } from "@/constants";
function Triage() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <TriageWorkFlow />
      </FormContainer>
    </>
  );
}

export default AuthGuard(Triage, [roles.CLINICIAN, roles.NURSE, roles.ADMIN])