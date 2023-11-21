"use client";
import { MiddlePageLayout } from "@/components/layouts";
import TriageWorkFlow from "./components/triageWorkFlow";

export default function Triage() {
  return (
    <MiddlePageLayout title="Triage" middleGridSize={8}>
      <TriageWorkFlow />
    </MiddlePageLayout>
  );
}
