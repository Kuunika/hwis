"use client";

import { ClientWaitingForTriage } from "./components";
import { MainGrid } from "@/components";

import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
} from "../registration/components/common";
import { Navigation } from "../components/navigation";
import AuthGuard from "@/helpers/authguard";
import { roles } from "@/constants";
import Link from "next/link";

function Triage() {
  return (
    <>
      <Navigation title="Patients waiting for Triage" link="/dashboard" />
      <MainGrid container>
        <MainGrid xs={0} lg={0} item></MainGrid>
        <MainGrid
          xs={12}
          lg={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: "2ch",
          }}
          item
        >
          <br />
          <br />
          <RegistrationMainHeader>
            Patients waiting for Triage
          </RegistrationMainHeader>
          <RegistrationDescriptionText>
            This is a list of all patients that went through registration
            successfully and waiting for triage.
          </RegistrationDescriptionText>
          <RegistrationCard sx={{ p: 0 }}>
            {/* <Link href="/triage/b5f1fcf8-0a36-4527-87ac-ac0d969934b1/start">
              move to triage
            </Link> */}
            <ClientWaitingForTriage />
          </RegistrationCard>
        </MainGrid>
        <MainGrid lg={0} item></MainGrid>
      </MainGrid>
    </>
  );
}

export default AuthGuard(Triage, [
  roles.CLINICIAN,
  roles.NURSE,
  roles.ADMIN,
  roles.STUDENT_CLINICIAN,
]);
