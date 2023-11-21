"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { RegistrationFlow } from "./components";

export default function Registration() {
  return (
    <MiddlePageLayout title="Registration">
      <RegistrationFlow />
    </MiddlePageLayout>
  );
}
