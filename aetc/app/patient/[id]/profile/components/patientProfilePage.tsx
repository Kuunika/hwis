"use client";

import { DesktopView } from "@/app/patient/components/profile";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";

function PatientProfilePage() {
  return (
    <>
      <DesktopView />
    </>
  );
}
export default AuthGuard(PatientProfilePage, [
  roles.CLINICIAN,
  roles.ADMIN,
  roles.NURSE,
]);
