"use client";
import { MiddlePageLayout } from "@/components/layouts";
import TriageWorkFlow from "./components/triageWorkFlow";
import { FormContainer } from "shared-ui/src";
import { ClientWaitingForTriage } from "./components";

export default function Triage() {
  return (
    <MiddlePageLayout title="Client Waiting For Triage" middleGridSize={8}>
      <ClientWaitingForTriage />
    </MiddlePageLayout>
  );
}
