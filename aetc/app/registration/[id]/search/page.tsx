"use client";

import { MainTypography, WrapperBox } from "@/components";

import { useContext, useEffect, useState } from "react";
import { getActivePatientDetails, useParameters } from "@/hooks";

import { getPatientsWaitingForRegistrations } from "@/hooks/patientReg";
import { SearchTab } from "../../components/searchTabs";
import { Navigation } from "@/app/components/navigation";

import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import {
  SearchRegistrationContext,
  SearchRegistrationContextType,
} from "@/contexts";
import { Person } from "@/interfaces";

import {
  DemographicsSearch,
  NPIDSearch,
} from "../../components/searchComponents";

function RegistrationSearch() {
  const { params } = useParameters();
  const { patient } = getActivePatientDetails();
  const { setInitialRegisteredPatient, setRegistrationType } = useContext(
    SearchRegistrationContext
  ) as SearchRegistrationContextType;

  useEffect(() => {
    setRegistrationType("");
  }, []);

  useEffect(() => {
    if (patient) {
      setInitialRegisteredPatient(patient);
    }
  }, [patient]);

  return (
    <>
      <Navigation title="Search Patient" link="/registration/list" />
      <WrapperBox
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          alignItems: "center",
        }}
      >
        <MainTypography
          variant="h1"
          sx={{
            fontFamily: "Inter",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "29px",
            letterSpacing: "0em",
            textAlign: "left",
          }}
        >
          Search your patient profile
        </MainTypography>
        <MainTypography
          variant="body1"
          sx={{
            fontFamily: "Inter",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "19px",
            letterSpacing: "0em",
            textAlign: "center",
            color: "#00190E",
            opacity: "50%",
            width: "327px",
          }}
        >
          Use search bar below to find your patient profile and start the triage
        </MainTypography>
        <br />
        <br />

        <WrapperBox
          sx={{
            width: { sm: "70%", lg: "40%" },
            position: "relative",
          }}
        >
          <SearchTab
            demographics={
              <DemographicsSearch
                patient={patient ? patient : ({} as Person)}
              />
            }
            npid={<NPIDSearch genericSearch={false} />}
          />
        </WrapperBox>
      </WrapperBox>
    </>
  );
}

export default AuthGuard(RegistrationSearch, [
  roles.ADMIN,
  roles.CLINICIAN,
  roles.REGISTRATION_CLERK,
  roles.NURSE,
]);
