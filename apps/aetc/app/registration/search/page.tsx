"use client";

import { SearchContainer } from "./components";
import {
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
  defaultTheme,
} from "shared-ui/src";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useNavigation } from "@/hooks";
import plus from "../../../icons/plus.svg";
import Image from "next/image";
import { PatientNationalIdCheck } from "../components";
import { Navigation } from "../scanner/page";
import { SearchForm } from "./components/searchForm";
import { SearchResults } from "./components/searchResults";

export default function RegistrationSearch() {
  const searchParams = useSearchParams();
  const [searchResults, setSetResults] = useState<Array<any>>([]);
  const search = searchParams.get("s");
  const { navigateTo } = useNavigation();
  const [searchName, setSearchName] = useState("");

  return (
    <>
      <Navigation title="Search Patient" link="/" />
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
          <SearchForm onSubmit={() => {}} />
          {/* <SearchContainer
            getResult={(results) => setSetResults(results)}
            initialSearch={search ? search : ""}
            initialValue={search ? search : ""}
            getSearch={(result) => setSearchName(result)}
          />
          {searchResults.length == 0 && (
            <MainPaper sx={{ p: "1ch", mt: "1ch", width: "100%" }}>
              <WrapperBox
                sx={{
                  border: "1px dashed #B3B3B3",
                  py: "1ch",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <MainTypography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "24px",
                    letterSpacing: "0em",
                    textAlign: "left",
                    color: "#636363",
                  }}
                >
                  No {`${searchName}`} patient in the system
                </MainTypography>
              </WrapperBox>
              <AddPatientButton />
            </MainPaper>
          )} */}
        </WrapperBox>
        <br />
        <SearchResults />
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
