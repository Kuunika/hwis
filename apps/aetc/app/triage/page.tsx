"use client";
import { MiddlePageLayout } from "@/components/layouts";

import { ClientWaitingForTriage } from "./components";

export default function Triage() {
  return (
    <MiddlePageLayout title="Patient Waiting For Triage" middleGridSize={8}>
      <ClientWaitingForTriage />
    </MiddlePageLayout>
  );
}
