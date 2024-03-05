"use client";

import { ClientWaitingForAssessment } from "./components";
import { MainGrid } from "shared-ui/src";
import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
} from "../registration/components/common";
import { Navigation } from "../components/navigation";

export default function AssessmentPage() {
  return (
    <>
      <Navigation title="Patients Waiting For Assessments" link="/dashboard" />
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
            Patients Waiting For Assessments
          </RegistrationMainHeader>
          <RegistrationDescriptionText>
            This is a list of all patients that went through triage successfully
            and waiting for assessments.
          </RegistrationDescriptionText>
          <RegistrationCard sx={{ p: 0 }}>
            <ClientWaitingForAssessment />
          </RegistrationCard>
        </MainGrid>
        <MainGrid xs={1} lg={1} item></MainGrid>
      </MainGrid>
    </>
  );
}
