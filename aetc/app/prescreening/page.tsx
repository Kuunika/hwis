"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { PrescreeningForm } from "./components/preScreeningForm";
import { useNavigation, useParameters } from "@/hooks";

export default function Prescreening() {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const initialValues = {};



  const handleSubmit = (values: any) => {
    console.log({ values });
  };
  return (
    <>
      <MiddlePageLayout title="Prescreening">
        <PrescreeningForm onSubmit={handleSubmit} />
      </MiddlePageLayout>
    </>
  );
}
