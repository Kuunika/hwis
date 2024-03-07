"use client";

import AuthGuard from "@/helpers/authguard";
import { NewRegistrationFlow } from "../../components/newRegistration";

function Page() {
  return <NewRegistrationFlow />;
}
export default AuthGuard(Page)