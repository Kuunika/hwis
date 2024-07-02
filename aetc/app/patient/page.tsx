"use client";


import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { DesktopView, TabletView } from "./components/profile";

function PatientProfile() {
  return (
    <>
      <DesktopView />
      <TabletView />
    </>
  );
}

export default AuthGuard(PatientProfile, [roles.CLINICIAN, roles.NURSE])
