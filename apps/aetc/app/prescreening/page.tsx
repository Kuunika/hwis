"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { PrescreeningForm } from "./components/preScreeningForm";
import { useNavigation } from "@/hooks";

export default function Prescreening() {
  const { navigateTo } = useNavigation();
  const initialValues = {};

  const handleSubmit = (values: any) => {
    console.log({ values });
  };
  return (
    <>
      <MiddlePageLayout title="Prescreening">
        <PrescreeningForm
          onProceed={() => navigateTo("/registration")}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={undefined}
        />
      </MiddlePageLayout>
    </>
  );
}
