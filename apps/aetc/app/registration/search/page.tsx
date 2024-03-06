"use client";

import { ResultBox, SearchContainer } from "./components";
import {
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
  defaultTheme,
} from "shared-ui/src";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useNavigation } from "@/hooks";
import plus from "../../../icons/plus.svg";
import Image from "next/image";

import { SearchForm } from "./components/searchForm";
import { SearchResults } from "./components/searchResults";
import { Navigation } from "@/app/components/navigation";
import { searchPatients } from "@/hooks/people";

export default function RegistrationSearch() {
  const [patientData, setPatientData] = useState()
  const { refetch } = searchPatients(patientData)
  // search.


  useEffect(() => {


    if (!patientData) return;

    refetch();

  }, [patientData])


  const searchPatient = (searchData: any) => {
    setPatientData(searchData)
  }

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
          <SearchForm onSubmit={searchPatient} />
          <br />
          <ResultBox searchResults={[]} />
        </WrapperBox>
      </WrapperBox>
    </>
  );
}

// export const AddPatientButton = () => (
//   <WrapperBox
//     onClick={() => PatientNationalIdCheck()}
//     sx={{ display: "flex", mt: "1ch", cursor: "pointer" }}
//   >
//     <Image src={plus} alt="plus" />
//     <MainTypography
//       sx={{
//         fontFamily: "Inter",
//         fontSize: "14px",
//         fontWeight: 500,
//         lineHeight: "17px",
//         letterSpacing: "0em",
//         textAlign: "left",
//         color: defaultTheme.primary,
//         borderBottom: `1px solid ${defaultTheme.primary}`,
//         ml: "1ch",
//       }}
//     >
//       Add new patient
//     </MainTypography>
//   </WrapperBox>
// );
