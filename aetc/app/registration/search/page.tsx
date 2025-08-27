"use client";

import { ResultBox, SearchContainer } from "./components";
import {
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
  defaultTheme,
} from "@/components";
import { useEffect, useState } from "react";

import { Navigation } from "@/app/components/navigation";
import { searchPatients } from "@/hooks/people";
import { OverlayLoader } from "@/components/backdrop";
import { Person } from "@/interfaces";
import { DemographicsSearch, NPIDSearch } from "../components/searchComponents";
import { SearchTab } from "../components/searchTabs";

export default function RegistrationSearch() {
  const [patientData, setPatientData] = useState();
  const { refetch, isFetching, isSuccess, data } = searchPatients(patientData);
  // search.

  useEffect(() => {
    if (!patientData) return;
    refetch();
  }, [patientData]);

  return (
    <>
      <Navigation title="Search Patient" link="/dashboard" />
      <WrapperBox
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          mt: "10ch",
          // justifyContent: "center",
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
            width: "40%",
            position: "relative",
          }}
        >
          <SearchTab
            demographics={
              <DemographicsSearch genericSearch={true} patient={{} as Person} />
            }
            npid={<NPIDSearch genericSearch={true} />}
          />
        </WrapperBox>
        <OverlayLoader open={isFetching} />
      </WrapperBox>
    </>
  );
}
