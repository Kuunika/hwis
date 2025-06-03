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
