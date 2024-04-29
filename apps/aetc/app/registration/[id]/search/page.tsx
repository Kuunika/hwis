"use client";

import {

  MainTypography,
  WrapperBox,

} from "shared-ui/src";

import { useContext, useEffect, useState } from "react";
import { useParameters } from "@/hooks";

import { SearchForm } from "../../search/components/searchForm";
import { SearchResults } from "../../search/components/searchResults";
import {
  getPatientsWaitingForRegistrations, searchDDEPatient, searchPotentialDuplicates,

} from "@/hooks/patientReg";
import { SearchTab } from "../../components/searchTabs";
import { SearchNPIDForm } from "../../search/components/searchNpid";
import { Navigation } from "@/app/components/navigation";
import { OverlayLoader } from "@/components/backdrop";
import { roles } from "@/constants";
import AuthGuard from "@/helpers/authguard";
import { SearchRegistrationContext, SearchRegistrationContextType } from "@/contexts";
import { Person } from "@/interfaces";
import { searchRegPatients } from "@/hooks/people";

function RegistrationSearch() {
  const { params } = useParameters();
  const { setInitialRegisteredPatient, setRegistrationType } = useContext(SearchRegistrationContext) as SearchRegistrationContextType
  const { data } = getPatientsWaitingForRegistrations();

  const patient = data?.find((p) => p.uuid == params.id);


  useEffect(() => {
    setRegistrationType('')
  }, [])



  useEffect(() => {
    if (patient) {
      setInitialRegisteredPatient(patient);
    }
  }, [patient])

  return (
    <>
      <Navigation title="Search Patient" link="/dashboard" />
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
            demographics={<DemographicsSearch patient={patient ? patient : {} as Person} />}
            npid={<NPIDSearch />}
          />
        </WrapperBox>
      </WrapperBox>
    </>
  );
}

const DemographicsSearch = ({ patient }: { patient: Person }) => {

  const { setSearchedPatient: setSearchedPatientContext } = useContext(SearchRegistrationContext) as SearchRegistrationContextType
  const [search, setSearch] = useState({ firstName: "", lastName: "", gender: "" })


  // const { refetch, isFetching, isSuccess: searchComplete, data, isError } = searchDDEPatient(search.firstName, search.lastName, search.gender)
  const [searchedPatient, setSearchedPatient] = useState({});


  const { refetch, isFetching, isSuccess: searchComplete, data, isError } = searchRegPatients(search)


  useEffect(() => {
    if (!Boolean(search.firstName)) return;
    refetch();

  }, [search])



  const handleSubmit = (values: any) => {
    setSearchedPatient(values);
    setSearch({
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender
    })

    setSearchedPatientContext({
      patient_id: patient.patient_id,
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender
    })


  };


  return (
    <>
      <SearchForm
        init={{
          firstName: patient?.given_name,
          lastName: patient?.family_name,
        }}
        onSubmit={handleSubmit}
        fullForm={false}
      />
      <br />
      <OverlayLoader open={isFetching} />
      {(searchComplete || isError) && <SearchResults
        searchResults={data ? { remotes: [], locals: data } : { remotes: [], locals: [] }}
        searchedPatient={searchedPatient}
      />
      }

    </>
  );
};

const NPIDSearch = () => {
  return <SearchNPIDForm onSubmit={() => { }} />;
};

export default AuthGuard(RegistrationSearch, [roles.ADMIN, roles.CLINICIAN, roles.REGISTRATION_CLERK, roles.NURSE])