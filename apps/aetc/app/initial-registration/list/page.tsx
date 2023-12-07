"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { InitialRegistrationList } from "../components";

export default function InitialList() {
  return (
    <MiddlePageLayout middleGridSize={8} title="Patients waiting prescreening">
      <InitialRegistrationList />
    </MiddlePageLayout>
  );
}
