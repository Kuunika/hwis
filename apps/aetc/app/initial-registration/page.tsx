"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { InitialRegistrationForm } from "./components";
import { useNavigation } from "@/hooks";
import { successDialog } from "@/helpers";

export default function InitialRegistration() {
  const { navigateTo } = useNavigation();
  const initialValues = { firstName: "", lastName: "" };

  const handleSubmit = (values: any, options: any) => {
    options.resetForm();

    successDialog({
      title: "Patient Added successfully",
      text: "Patient Added to prescreening list",
      icon: "success",
      onConfirm: () => {},
      confirmButtonText: "Register More Patients",
      cancelButtonText: "Home",
      onDismiss: () => navigateTo("/"),
    });
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
