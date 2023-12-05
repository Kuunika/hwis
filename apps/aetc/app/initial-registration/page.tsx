"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { InitialRegistrationForm } from "./components";

export default function InitialRegistration() {
  const initialValues = { firstName: "", lastName: "" };

  const handleSubmit = (values: any) => {
    console.log({ values });
  };
  return (
    <MiddlePageLayout title="Initial Registration">
      <InitialRegistrationForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </MiddlePageLayout>
  );
}
