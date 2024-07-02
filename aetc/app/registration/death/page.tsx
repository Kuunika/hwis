"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { BroughtDeadForm } from "../components";

export default function BroughtDead() {
  return (
    <>
      <MiddlePageLayout title="Brought Dead ">
        <BroughtDeadForm />
      </MiddlePageLayout>
    </>
  );
}
