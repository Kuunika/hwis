"use client";

import { MiddlePageLayout } from "@/components/layouts";
import { WaitingRegistrationList } from "../components";
import { MainGrid } from "shared-ui/src";
import { InitialRegistrationList } from "@/app/initial-registration/components";
import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
} from "../components/common";
import { Navigation } from "../scanner/page";

export default function List() {
  return (
    <>
      <Navigation title="Patients waiting registration" link="/" />
      <MainGrid container>
        <MainGrid lg={2} item></MainGrid>
        <MainGrid
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
            Patients waiting for Registration
          </RegistrationMainHeader>
          <RegistrationDescriptionText>
            This is a list of all patients that went through prescreening
            successfully and waiting for registration.
          </RegistrationDescriptionText>
          <RegistrationCard sx={{ p: 0 }}>
            <WaitingRegistrationList />
          </RegistrationCard>
        </MainGrid>
        <MainGrid lg={2} item></MainGrid>
      </MainGrid>
    </>
  );
}
