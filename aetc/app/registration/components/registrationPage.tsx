"use client";

import AuthGuard from "@/helpers/authguard";
import { NewRegistrationFlow } from "./newRegistration";
import { roles } from "@/constants";

function RegistrationPage() {
  return <NewRegistrationFlow />;
}
export default AuthGuard(RegistrationPage, [
  roles.ADMIN,
  roles.REGISTRATION_CLERK,
  roles.CLINICIAN,
]);
