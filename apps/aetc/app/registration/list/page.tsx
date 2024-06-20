"use client";

import { WaitingRegistrationList } from "../components";
import { MainGrid } from "@/components";

import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
} from "../components/common";
import { Navigation } from "@/app/components/navigation";

export default function List() {
  return (
    <>
      <Navigation title="Patients waiting registration" link="/dashboard" />
      <MainGrid container>
        <MainGrid xs={1} lg={1} item></MainGrid>
        <MainGrid
          xs={10}
          lg={10}
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
        <MainGrid xs={1} lg={1} item></MainGrid>
      </MainGrid>
    </>
  );
}
