"use client";

import { DesktopView, TabletView } from "../../components/profile";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";

export default function PatientProfile() {
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  return (
    <>
      <DesktopView />
      <TabletView />
    </>
  );
}
