"use client";

import { InvestigationsForm } from "./components";

import { MiddlePageLayout } from "@/components/layouts";

export default function Investigations() {
  const initialValues = {
    sample: "",
    sampleType: "",
  };

  const handleSubmit = () => {};

  return (
    <MiddlePageLayout title="Investigation">
      <InvestigationsForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </MiddlePageLayout>
  );
}
