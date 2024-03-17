
import { useContext, useEffect, useState } from "react";
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
import { GenericDialog } from "@/components";
import { getOnePatient, merge } from "@/hooks/patientReg";
import { OverlayLoader } from "@/components/backdrop";


export const SearchResults = ({

  searchedPatient,
  searchResults,
}: {

  searchedPatient: any;
  searchResults: DDESearch
}) => {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const [open, setOpen] = useState(false);
  const { setRegistrationType, setPatient } = useContext(SearchRegistrationContext) as SearchRegistrationContextType

  const { setPatient: setRegisterPatient } = useContext(
    SearchRegistrationContext
  ) as SearchRegistrationContextType;

  const handleNewRecord = () => {
    setRegisterPatient(searchedPatient);
    navigateTo(`/registration/${params.id}/new`);
  };

  const selectPatient = (person: Person, registrationType: 'local' | 'remote') => {
    setPatient(person);
    setOpen(true);
    setRegistrationType(registrationType)
  }

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
            return <ResultBox setOpen={(person: Person) => selectPatient(person, 'local')} type="Local" key={patient.uuid} person={patient} />
          })
        }
        {
          searchResults.remotes.map(patient => {
            return <ResultBox setOpen={(person: Person) => selectPatient(person, 'remote')} type="Remote" key={patient.uuid} person={patient} />
          })
        }
      </WrapperBox>
      <ConfirmationDialog open={open} onClose={() => setOpen(false)} />
    </WrapperBox>
  );
};


export const ResultBox = ({ person, type, setOpen }: { person: Person, type: string, setOpen: (person: Person) => void }) => {

  const identifier = person.identifiers.find(i => i.identifier_type.name == 'National id');

  return <MainPaper onClick={() => setOpen(person)} sx={{ display: "flex", padding: 2, width: "100%", my: 1, cursor: "pointer" }}>
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
        <Label label="Home district" value={person.addresses[0]?.address1} />
        <Label label="Home traditional authority" value={person.addresses[0]?.cityVillage} />
        <Label label="Home village" value={person.addresses[0]?.address2} />
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


const ConfirmationDialog = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const { params } = useParameters();
  const { navigateTo } = useNavigation()
  const { mutate, isPending, isSuccess, data } = merge();
  // const { setPatient } = useContext(SearchRegistrationContext) as SearchRegistrationContextType

  const { registrationType, initialRegisteredPatient, patient, setPatient } = useContext(SearchRegistrationContext) as SearchRegistrationContextType



  const identifier = patient?.identifiers?.find(id => id.identifier_type.name == "DDE person document ID");


  useEffect(() => {

    if (isSuccess) {

      setPatient(data);
      navigateTo(`/registration/${params.id}/new`)
    }

  }, [isSuccess])


  return <GenericDialog maxWidth="sm" title="Confirmation" open={open} onClose={onClose}>
    <MainTypography> {registrationType == "local" ? "Are you sure you want to continue registration with the local record?" : "Are you sure you want to continue registration with the remote record?"}</MainTypography>
    <MainButton sx={{ mr: 0.5 }} title={"Yes"} onClick={() => {

      if (identifier) {
        mutate({
          primary: { patient_id: initialRegisteredPatient.patient_id },
          secondary: [{
            "doc_id": identifier?.identifier
          }]
        })
      } else {
        navigateTo(`/registration/${params.id}/new`)
      }
    }} />
    <MainButton variant="secondary" title={"No"} onClick={onClose} />
    <OverlayLoader open={isPending} />
  </GenericDialog>
}