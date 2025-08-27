"use client";

import { ClientWaitingForAssessment } from "./components";
import { MainGrid } from "../../components";
import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
} from "../registration/components/common";
import { Navigation } from "../components/navigation";
import AuthGuard from "@/helpers/authguard";
import { roles } from "@/constants";

function AssessmentPage() {
  return (
    <>
      <Navigation title="Waiting For Assessment" link="/dashboard" />

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
            Patients Waiting For Assessments
          </RegistrationMainHeader>
          <RegistrationDescriptionText>
            This is a list of all patients that went through triage successfully
            and waiting for assessments.
          </RegistrationDescriptionText>
          <RegistrationCard sx={{ mx: 1, p: 0 }}>
            <ClientWaitingForAssessment />
          </RegistrationCard>
        </MainGrid>
        <MainGrid xs={0} lg={0} item></MainGrid>
      </MainGrid>
    </>
  );
}

export default AuthGuard(AssessmentPage, [
  roles.ADMIN,
  roles.CLINICIAN,
  roles.NURSE,
  roles.STUDENT_CLINICIAN,
]);
