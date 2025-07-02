"use client";

import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { DesktopView } from "../../components/profile";

function PatientProfile() {
  return (
    <>
      <DesktopView />
    </>
  );
}
export default AuthGuard(PatientProfile, [
  roles.CLINICIAN,
  roles.ADMIN,
  roles.NURSE,
  roles.STUDENT_CLINICIAN,
]);
