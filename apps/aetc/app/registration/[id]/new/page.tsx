"use client";

import AuthGuard from "@/helpers/authguard";
import { NewRegistrationFlow } from "../../components/newRegistration";
import { roles } from "@/constants";

function Page() {
  return <NewRegistrationFlow />;
}
export default AuthGuard(Page, [roles.ADMIN, roles.CLINICIAN, roles.REGISTRATION_CLERK, roles.NURSE])