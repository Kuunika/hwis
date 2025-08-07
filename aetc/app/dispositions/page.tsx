"use client";

import { ClientsAwaitingDisposition } from "./components";
import { MainGrid } from "../../components";
import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
} from "../registration/components/common";
import { Navigation } from "../components/navigation";
import AuthGuard from "@/helpers/authguard";
import { roles } from "@/constants";

function DispositionPage() {
  return (
    <>
      <Navigation title="Disposition/Specialty" link="/dashboard" />
      <MainGrid container>
        <MainGrid xs={0} lg={0} item></MainGrid>
        <MainGrid
          xs={12}
          lg={12}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          item
        >
          <br />
          <br />
          <RegistrationMainHeader>
            Disposition List{" "}
          </RegistrationMainHeader>
          <RegistrationDescriptionText>
            This is a list of all patients who have completed assessments and
            are waiting for Specialty.
          </RegistrationDescriptionText>
          <RegistrationCard sx={{ mx: 1, p: 0 }}>
            <ClientsAwaitingDisposition />
          </RegistrationCard>
        </MainGrid>
        <MainGrid xs={0} lg={0} item></MainGrid>
      </MainGrid>
    </>
  );
}

export default AuthGuard(DispositionPage, [roles.ADMIN, roles.CLINICIAN, roles.NURSE]);
