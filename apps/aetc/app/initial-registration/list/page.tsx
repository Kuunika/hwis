"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { InitialRegistrationList } from "../components";
import { MainGrid } from "shared-ui/src";
import {
  RegistrationCard,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "@/app/registration/components/common";
import { Navigation } from "@/app/components/navigation";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
function InitialList() {
  return (
    <>
      <Navigation title="Patients waiting prescreening" link="/dashboard" />
      <MainGrid container>
        <MainGrid xs={0} lg={2} item></MainGrid>
        <MainGrid
          xs={12}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          item
        >
          <br />
          <br />
          <RegistrationMainHeader>
            Patients waiting for Screening
          </RegistrationMainHeader>
          <RegistrationDescriptionText>
            This is a list of all patients that went through initial
            registration successfully and waiting for prescreening.
          </RegistrationDescriptionText>
          <RegistrationCard sx={{ p: 0, mx: "1ch" }}>
            <InitialRegistrationList />
          </RegistrationCard>
        </MainGrid>
        <MainGrid xs={0} lg={2} item></MainGrid>
      </MainGrid>
    </>
  );
}

export default AuthGuard(InitialList, [roles.ADMIN, roles.CLINICIAN, roles.REGISTRATION_CLERK, roles.NURSE])