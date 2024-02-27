"use client";

import { SearchContainer } from "../components";
import {
  MainPaper,
  MainTypography,
  WrapperBox,
  defaultTheme,
} from "shared-ui/src";

import { useEffect, useState } from "react";
import { useNavigation, useParameters } from "@/hooks";

import { getPatientsWaitingForRegistrations } from "@/hooks/patientReg";
import { Navigation } from "@/app/components/navigation";

export default function RegistrationSearch() {
  const [searchResults, setSetResults] = useState<Array<any>>([]);
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const [searchName, setSearchName] = useState("");
  const { data: patients } = getPatientsWaitingForRegistrations();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const found = patients?.find((p) => p.uuid == params.id);

    if (found) {
      setSearch(`${found.given_name} ${found.family_name}`);
    }
  }, []);

  return (
    <>
      <Navigation title="Search Patient" link="/" />
      <WrapperBox
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
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
          <SearchContainer
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
              {/* <AddPatientButton /> */}
            </MainPaper>
          )}
        </WrapperBox>
      </WrapperBox>
    </>
  );
}

// export const AddPatientButton = () => (
//   <WrapperBox
//     onClick={() => {}}
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
