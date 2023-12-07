"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { PrescreeningForm } from "../components/preScreeningForm";
import { successDialog } from "@/helpers";
import { useNavigation } from "@/hooks";

export default function Prescreening() {
  const { navigateTo } = useNavigation();
  const handleSubmit = (values: any) => {
    successDialog({
      title: "Prescreening Completed",
      text: "",
      icon: "success",
      onConfirm: () => navigateTo("/initial-registration/list"),
      confirmButtonText: "Prescreen More Patients",
      cancelButtonText: "Home",
      onDismiss: () => navigateTo("/"),
    });
  };
  return (
    <>
      <MiddlePageLayout title="Prescreening">
        <PrescreeningForm onSubmit={handleSubmit} />
      </MiddlePageLayout>
    </>
  );
}
