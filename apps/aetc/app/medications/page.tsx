"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { MedicationForm } from "./components";

export default function Medications() {
  const initialValues = {};

  const handleSubmit = () => {};
  return (
    <MiddlePageLayout title="Medications">
      <MedicationForm initialValues={initialValues} onSubmit={handleSubmit} />
    </MiddlePageLayout>
  );
}
