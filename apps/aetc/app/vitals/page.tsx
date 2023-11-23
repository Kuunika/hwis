"use client";
import { MiddlePageLayout } from "@/components/layouts";

import { VitalsForm } from "@/app/vitals/components/vitalsForm";

export default function Vitals() {
  const handleSubmit = () => {
    console.log("Form submitted!");
  };
  const initialValues = {};

  return (
    <MiddlePageLayout title="Vitals">
      <VitalsForm initialValues={initialValues} onSubmit={handleSubmit} />
    </MiddlePageLayout>
  );
}
