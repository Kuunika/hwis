"use client";

import { MiddlePageLayout } from "@/components/layouts";
import { WaitingRegistrationList } from "../components";

export default function List() {
  return (
    <MiddlePageLayout title="Patients Waiting Registration">
      <WaitingRegistrationList />
    </MiddlePageLayout>
  );
}
