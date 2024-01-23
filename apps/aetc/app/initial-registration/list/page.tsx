"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { InitialRegistrationList } from "../components";
import { MainGrid } from "shared-ui/src";
import {
  RegistrationCard,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "@/app/registration/components/common";
import { Navigation } from "@/app/registration/scanner/page";

export default function InitialList() {
  return (
    <>
      <Navigation title="Patients waiting prescreening" link="/" />
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
            Patients waiting for prescreening
          </RegistrationMainHeader>
          <RegistrationDescriptionText>
            This is a list of all patients that went through initial
            registration successfully and waiting for prescreening.
          </RegistrationDescriptionText>
          <RegistrationCard sx={{ p: 0 }}>
            <InitialRegistrationList />
          </RegistrationCard>
        </MainGrid>
        <MainGrid lg={2} item></MainGrid>
      </MainGrid>
    </>
  );
}
