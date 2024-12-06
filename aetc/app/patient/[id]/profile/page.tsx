"use client";

import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { DesktopView } from "../../components/profile";
import { TabletView } from "../../components/tabletView";
function PatientProfile() {
  return (
    <>
      <DesktopView />
      <TabletView />
    </>
  );
}
export default AuthGuard(PatientProfile, [roles.CLINICIAN, roles.ADMIN]);
