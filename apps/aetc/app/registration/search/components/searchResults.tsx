

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
import { DDESearch, Encounter, Person } from "@/interfaces";
import { GenericDialog } from "@/components";
import { getOnePatient, getPatientsWaitingForRegistrations, merge } from "@/hooks/patientReg";
import { OverlayLoader } from "@/components/backdrop";
import { ViewPatient } from "@/app/patient/components/viewPatient";
import { addEncounter, getPatientsEncounters } from "@/hooks/encounter";
import { addVisit, closeCurrentVisit } from "@/hooks/visit";
import { AETC_VISIT_TYPE, concepts, encounters } from "@/constants";
import { getObservation, getObservationValue } from "@/helpers/emr";
import { DisplayFinancing, DisplaySocialHistory } from "@/app/patient/[id]/view/page";


export const SearchResults = ({

  searchedPatient,
  searchResults,

}: {

  searchedPatient: any;
  searchResults: DDESearch,

}) => {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const [open, setOpen] = useState(false);
  const { setRegistrationType, setPatient, patient } = useContext(SearchRegistrationContext) as SearchRegistrationContextType

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

  const resultNotFound = (searchResults.locals.length == 0 && searchResults.remotes.length == 0)


  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <MainTypography variant="h5">Search Results</MainTypography>

      {
        resultNotFound && (
          <WrapperBox sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <br />
            <MainTypography variant="body2">No patient with similar demographics found</MainTypography>
            <br />
            <MainButton
              sx={{ mr: "0.2ch", borderRadius: "1px" }}
              variant="secondary"
              title="add new record"
              onClick={handleNewRecord}
            />
          </WrapperBox>
        )
      }
      <br />
      {!resultNotFound && <WrapperBox sx={{ width: "100%" }}>
        <MainButton
          sx={{ mr: "0.2ch", borderRadius: "1px" }}
          variant="secondary"
          title="add new record"
          onClick={handleNewRecord}
        />
      </WrapperBox>}
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
      <ViewPatientDialog patient={patient ? patient : {} as Person} onClose={() => setOpen(false)} open={open} />
      {/* <ConfirmationDialog open={open} onClose={() => setOpen(false)} /> */}
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
        <Label label="Gender" value={person.gender} />
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
    <MainTypography variant="subtitle2" color={"#C0C0C0"} sx={{ mr: 0.5 }}>{label}</MainTypography><MainTypography variant="subtitle2" color={"#585858"} >{value ? value.toString() : ''}</MainTypography>
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


const ViewPatientDialog = ({ patient, onClose, open }: { patient: Person, onClose: () => void, open: boolean }) => {
  const { params } = useParameters();

  // encounters for the patient registered during the initial registration
  const { data: patientEncounters } = getPatientsEncounters(params?.id as string);

  // encounters for patient that was found in the system
  const { data: existingPatientEncounters, isPending } = getPatientsEncounters(patient.uuid);
  const { mutate: closeVisit, isSuccess: visitClosed } = closeCurrentVisit();
  const { isLoading, data: patients } = getPatientsWaitingForRegistrations();

  const {
    mutate: createEncounter,
    isPending: creatingEncounter,
    isSuccess: encounterCreated,
    isError: encounterError,
  } = addEncounter();

  const {
    mutate: createScreeningEncounter,
    isPending: creatingScreeningEncounter,
    isSuccess: screeningEncounterCreated,
    isError: screeningEncounterErrored,
  } = addEncounter();

  const {
    mutate: createVisit,
    isPending: creatingVisit,
    isSuccess: visitCreated,
    data: visit,
    isError: visitError,
  } = addVisit();


  useEffect(() => {
    if (!visitCreated) return

    const initialRegistration = patientEncounters?.find(p => p.encounter_type.uuid == encounters.INITIAL_REGISTRATION);

    createEncounter({
      encounterType: encounters.INITIAL_REGISTRATION,
      visit: visit?.uuid,
      patient: patient?.uuid,
      encounterDatetime: initialRegistration?.encounter_datetime,
      obs: [
        {
          concept: concepts.VISIT_NUMBER,
          value: initialRegistration?.obs[0].value,
          obsDatetime: initialRegistration?.obs[0].obs_datetime,
        },
      ],
      includeAll: true,
    });
  }, [visitCreated]);


  useEffect(() => {
    if (encounterCreated) {
      const screening = patientEncounters?.find(p => p.encounter_type.uuid == encounters.SCREENING_ENCOUNTER);
      const isReferred = getObservation(screening?.obs, concepts.IS_PATIENT_REFERRED);
      const isUrgent = getObservation(screening?.obs, concepts.IS_SITUATION_URGENT);

      createScreeningEncounter({
        encounterType: encounters.SCREENING_ENCOUNTER,
        visit: visit?.uuid,
        patient: patient.uuid,
        encounterDatetime: screening?.encounter_datetime,
        obs: [
          {
            concept: concepts.IS_PATIENT_REFERRED,
            value: isReferred?.value_coded_uuid,
            obsDatetime: isReferred?.obs_datetime,
          },
          {
            concept: concepts.IS_SITUATION_URGENT,
            value: isUrgent?.value_coded_uuid,
            obsDatetime: isUrgent?.obs_datetime,
          },

        ],
      });
    }

  }, [encounterCreated])


  // close patient visit
  useEffect(() => {
    const patient = patients?.find(p => p.uuid == params?.id);
    if (screeningEncounterCreated && patient) {

      closeVisit(patient.visit_uuid);
    }

  }, [screeningEncounterCreated])


  const handleContinue = () => {
    const initialRegistration = patientEncounters?.find(p => p.encounter_type.uuid == encounters.INITIAL_REGISTRATION);
    const uuid = patient?.uuid;
    createVisit({
      patient: uuid,
      visitType: AETC_VISIT_TYPE,
      startDatetime: initialRegistration?.encounter_datetime
    });
  }

  const financing = existingPatientEncounters?.find(p => p.encounter_type.uuid == encounters.FINANCING);
  const socialHistory = existingPatientEncounters?.find(p => p.encounter_type.uuid == encounters.SOCIAL_HISTORY);




  return <GenericDialog onClose={onClose} open={open} title="view patient">
    <MainTypography variant="h4">{`${patient.given_name} ${patient.family_name}`}</MainTypography>
    <MainButton title={"continue"} onClick={handleContinue} />
    <ViewPatient patient={patient} />
    <br />
    <WrapperBox display={"flex"}>
      <DisplaySocialHistory loading={isPending} socialHistory={socialHistory ? socialHistory : {} as Encounter} />
      <DisplayFinancing loading={isPending} financing={financing ? financing : {} as Encounter} />
    </WrapperBox>
  </GenericDialog>
}

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

      // patient available in DDE and merge with Local
      if (identifier) {
        mutate({
          primary: { patient_id: initialRegisteredPatient.patient_id },
          secondary: [{
            "doc_id": identifier?.identifier
          }]
        })
      } else {
        if (registrationType == "local") {
          mutate({
            primary: { patient_id: initialRegisteredPatient.patient_id },
            secondary: [{
              "patient_id": patient.uuid
            }]
          })

        } else {
          navigateTo(`/registration/${params.id}/new`)
        }
      }
    }} />
    <MainButton variant="secondary" title={"No"} onClick={onClose} />
    <OverlayLoader open={isPending} />
  </GenericDialog>
}