"use client";

import {
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
  defaultTheme,
} from "shared-ui/src";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useNavigation, useParameters } from "@/hooks";
import plus from "../../../icons/plus.svg";
import Image from "next/image";
import { PatientNationalIdCheck } from "../../components";
import { Navigation } from "../../scanner/page";
import { SearchForm } from "../../search/components/searchForm";
import { SearchResults } from "../../search/components/searchResults";
import {
  getPatientsWaitingForRegistrations,
  searchPotentialDuplicates,
} from "@/hooks/patientReg";
import { SearchTab } from "../../components/searchTabs";
import { SearchNPIDForm } from "../../search/components/searchNpid";

export default function RegistrationSearch() {
  const { params } = useParameters();
  const { data } = getPatientsWaitingForRegistrations();

  const patient = data?.find((p) => p.uuid == params.id);

  console.log({ patient });

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
          <SearchTab
            demographics={<DemographicsSearch patient={patient} />}
            npid={<NPIDSearch />}
          />
        </WrapperBox>
      </WrapperBox>
    </>
  );
}

const DemographicsSearch = ({ patient }: { patient: any }) => {
  const { mutate, isPending, isSuccess } = searchPotentialDuplicates();
  const [searchedPatient, setSearchedPatient] = useState({});

  const handleSubmit = (values: any) => {
    setSearchedPatient(values);
    // mutate({
    //   given_name: values.firstName,
    //   family_name: values.lastName,
    //   gender: values.gender,
    //   birthdate: values.birthdate,
    //   attributes: {
    //     home_village: values.homeVillage,
    //     home_traditional_authority: values.homeTraditionalAuthority,
    //     home_district: values.homeDistrict,
    //   },
    // });
  };
  return (
    <>
      <SearchForm
        init={{
          firstName: patient?.given_name,
          lastName: patient?.family_name,
        }}
        onSubmit={handleSubmit}
      />
      <br />
      {(isPending || true) && (
        <SearchResults
          loading={isPending}
          searchResults={{}}
          searchedPatient={searchedPatient}
        />
      )}
    </>
  );
};

const NPIDSearch = () => {
  return <SearchNPIDForm onSubmit={() => {}} />;
};
