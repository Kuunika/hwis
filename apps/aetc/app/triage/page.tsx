"use client";
import { MiddlePageLayout } from "@/components/layouts";
import TriageWorkFlow from "./components/triageWorkFlow";
import { FormContainer } from "shared-ui/src";

export default function Triage() {
  return (
    <FormContainer>
      <TriageWorkFlow />
    </FormContainer>
  );
}
