"use client";

import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { DesktopView, TabletView } from "../../components/profile";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";

function PatientProfile() {
  // const { params } = useParameters();
  // const { data, isLoading } = getPatientsEncounters(params?.id as string);
  return (
    <>
      <DesktopView />
      <TabletView />
    </>
  );
}
export default AuthGuard(PatientProfile, [roles.CLINICIAN, roles.ADMIN]);
