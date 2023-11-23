"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { ClientWaitingForAssessment } from "./components";

export default function AssessmentPage() {
  return (
    <MiddlePageLayout title="Patients Waiting For Assessments">
      <ClientWaitingForAssessment />
    </MiddlePageLayout>
  );
}
