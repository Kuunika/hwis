"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { PrescreeningForm } from "./components/preScreeningForm";

export default function Prescreening() {
  const initialValues = {};

  const handleSubmit = (values: any) => {
    console.log({ values });
  };
  return (
    <>
      <MiddlePageLayout title="Prescreening">
        <PrescreeningForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={undefined}
        />
      </MiddlePageLayout>
    </>
  );
}
