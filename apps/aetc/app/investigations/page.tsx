"use client";
import { MainGrid, MainPaper, MainTypography } from "shared-ui/src";
import { InvestigationsForm } from "./components";
import { BackButton } from "@/components/buttons";
import { MiddlePageLayout } from "@/components/layouts";

export default function Investigations() {
  const initialValues = {};

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
