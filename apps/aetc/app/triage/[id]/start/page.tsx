"use client";

import { PatientInfoTab } from "@/components";
import TriageWorkFlow from "../../components/triageWorkFlow";
import { FormContainer } from "shared-ui/src";
export default function Triage() {
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <TriageWorkFlow />
      </FormContainer>
    </>
  );
}
