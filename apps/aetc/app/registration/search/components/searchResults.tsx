import { useContext, useState } from "react";
import {
  BaseTable,
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
  defaultTheme,
} from "shared-ui/src";
import plus from "../../../../icons/plus.svg";
import Image from "next/image";
import { PatientNationalIdCheck } from "../../components";
import { useNavigation, useParameters } from "@/hooks";
import { FaUser } from "react-icons/fa6"

import {
  SearchRegistrationContext,
  SearchRegistrationContextType,
} from "@/contexts";
import { DDESearch, Person } from "@/interfaces";


export const SearchResults = ({

  searchedPatient,
  searchResults,
}: {

  searchedPatient: any;
  searchResults: DDESearch
}) => {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();

  const { setPatient: setRegisterPatient } = useContext(
    SearchRegistrationContext
  ) as SearchRegistrationContextType;

  const handleNewRecord = () => {
    setRegisterPatient(searchedPatient);
    navigateTo(`/registration/${params.id}/new`);
  };

  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <MainTypography variant="h5">Search Results</MainTypography>
      <br />
      <WrapperBox sx={{ width: "100%" }}>
        <MainButton
          sx={{ mr: "0.2ch", borderRadius: "1px" }}
          variant="secondary"
          title="add new record"
          onClick={handleNewRecord}
        />
      </WrapperBox>
      <br />
      <WrapperBox sx={{ width: "100%", height: "50ch", overflow: "scroll" }}>
        {
          searchResults.locals.map(patient => {
            return <ResultBox type="Local" key={patient.uuid} person={patient} />
          })
        }
        {
          searchResults.remotes.map(patient => {
            return <ResultBox type="Remote" key={patient.uuid} person={patient} />
          })
        }
      </WrapperBox>
    </WrapperBox>
  );
};


export const ResultBox = ({ person, type }: { person: Person, type: string }) => {
  const identifier = person.identifiers.find(i => i.identifier_type.name == 'National id');
  return <MainPaper sx={{ display: "flex", padding: 2, width: "100%", my: 1, cursor: "pointer" }}>
    <WrapperBox sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20%", backgroundColor: "#F5F5F5", mr: 1 }}>
      <MainTypography color={defaultTheme.primary} variant="h1"><FaUser /></MainTypography>
    </WrapperBox>
    <WrapperBox>
      <WrapperBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <MainTypography variant="h5">{person.given_name} {person.family_name}</MainTypography>
        <MainTypography>{type}</MainTypography>
      </WrapperBox>
      <WrapperBox sx={{ display: "flex" }}>
        <MainTypography color={"GrayText"} sx={{ mr: 1 }}>NPID:</MainTypography><MainTypography color={"GrayText"} >{identifier?.identifier}</MainTypography>
      </WrapperBox>
      <br />
      <WrapperBox sx={{ display: "flex", mb: 1 }}>
        <Label label="Date of birth" value={person.birthdate} />
        <Label label="Gender" value="Male" />
      </WrapperBox>
      <WrapperBox sx={{ display: "flex" }}>
        <Label label="Home district" value={person.addresses[0].address1} />
        <Label label="Home traditional authority" value={person.addresses[0].cityVillage} />
        <Label label="Home village" value={person.addresses[0].address2} />
      </WrapperBox>
    </WrapperBox>
  </MainPaper>
}


const Label = ({ label, value }: { label: string, value: string | undefined | Date }) => {
  return <WrapperBox sx={{ display: "flex", flexDirection: "column", mr: 1 }}>
    <MainTypography variant="subtitle2" color={"#C0C0C0"} sx={{ mr: 0.5 }}>{label}</MainTypography><MainTypography variant="subtitle2" color={"#585858"} >{value ? value : ''}</MainTypography>
  </WrapperBox>
}



export const AddPatientButton = () => {
  const { params } = useParameters();
  return (
    <WrapperBox
      onClick={() => PatientNationalIdCheck(params.id)}
      sx={{ display: "flex", mt: "1ch", cursor: "pointer" }}
    >
      <Image src={plus} alt="plus" />
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "17px",
          letterSpacing: "0em",
          textAlign: "left",
          color: defaultTheme.primary,
          borderBottom: `1px solid ${defaultTheme.primary}`,
          ml: "1ch",
        }}
      >
        Add new patient
      </MainTypography>
    </WrapperBox>
  );
};
