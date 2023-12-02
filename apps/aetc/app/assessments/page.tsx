"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { ClientWaitingForAssessment } from "./components";

export default function AssessmentPage() {
  return (
    <MiddlePageLayout
      leftGridSize={1}
      middleGridSize={9}
      title="Patients Waiting For Assessments"
    >
      <ClientWaitingForAssessment />
    </MiddlePageLayout>
  );
}
