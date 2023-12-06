"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { InitialRegistrationForm } from "./components";
import { useNavigation } from "@/hooks";

export default function InitialRegistration() {
  const { navigateTo } = useNavigation();
  const initialValues = { firstName: "", lastName: "" };

  const handleSubmit = (values: any) => {
    console.log({ values });
    navigateTo("/initial-registration/list");
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
