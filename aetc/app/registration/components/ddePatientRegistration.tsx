import {
  EditDemographicsForm,
  EditFinancingForm,
  EditLocation,
  EditRelationshipForm,
  EditSocialHistory,
} from "@/app/patient/components";
import { EditReferralForm } from "@/app/patient/components/editReferral";
import { GenericDialog, MainButton } from "@/components";
import { OverlayLoader } from "@/components/backdrop";
import { PatientBarcodePrinter } from "@/components/patientBarcodePrinter";
import { concepts, encounters } from "@/constants";
import { getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { useNavigation, useParameters } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import {
  getPatientsWaitingForRegistrations,
  merge,
  patchPatient,
} from "@/hooks/patientReg";
import { addPerson, addRelationship } from "@/hooks/people";
import { Person } from "@/interfaces";
import { Box, Paper, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

type IProps = {
  patient: Person;
  open: boolean;
  onClose: () => void;
};

export const DDEPatientRegistration = ({ patient, open, onClose }: IProps) => {
  const {navigateTo}=useNavigation()
  const [active, setActive] = useState(0);
  const [updatedPatient, setUpdatedPatient]=useState<Person>({} as Person)



  return (
    <GenericDialog onClose={onClose} open={open} title="Remote Patient">
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >

        <Box sx={{ width: { sm: "100%", lg: "40%" } }}>
          {active == 0 && (
            <PatientDetails patient={patient} next={() => setActive(1)} />
          )}
          {active == 1 && <EditDemographics setUpdatedPatient={setUpdatedPatient} person={patient} next={() => setActive(2)} />}
          {active == 2 && <SocialForm next={() => setActive(3)} />}
          {active == 3 && <RelationshipForm next={() => setActive(4)} />}
          {active == 4 && <GuardianForm next={() => setActive(5)} />}
          {active == 5 && <ReferralForm next={() => setActive(6)} />}
          {active == 6 && <FinanceForm next={() => setActive(7)} />}
          {active == 7 && <>
            <PatientBarcodePrinter firstName={updatedPatient.given_name} lastName={updatedPatient.family_name} addresses={Boolean(updatedPatient?.addresses) ? updatedPatient?.addresses : [] } identifiers={updatedPatient.identifiers} />
            <br />
            <MainButton title="Register More" sx={{mr:"1px"}} onClick={()=>navigateTo("/registration/list")} />
            <MainButton title="Home" onClick={()=>navigateTo("/dashboard")}  />
          </>
          }
          
        </Box>
      </Box>
    </GenericDialog>
  );
};

const PatientDetails = ({
  patient,
  next,
}: {
  patient: Person;
  next: () => void;
}) => {
  const {params}=useParameters()
  const [demographics, setDemographics] = useState<any>({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    birthDateEstimated: "",
  });
  const [homeLocationAddress, setHomeLocationAddress] = useState({
    nationality: "",
    district: "",
    village: "",
    traditionalAuthority: "",
  });
  const [currentLocationAddress, setCurrentLocationAddress] = useState({
    district: "",
    traditionalAuthority: "",
    village: "",
    closeLandMark: "",
  });

  const mapHomeLocation = (patient: Person) => {
    if (!patient) return;
    setHomeLocationAddress({
      nationality: patient?.addresses[0]?.country ?? "",
      district: patient?.addresses[0]?.address1 ?? "",
      village: patient?.addresses[0]?.address2 ?? "",
      traditionalAuthority: patient?.addresses[0]?.county_district ?? "",
    });
  };

  const mapCurrentLocation = (patient: Person) => {
    if (!patient) return;
    setCurrentLocationAddress({
      district: patient?.addresses[0]?.current_district ?? "",
      traditionalAuthority:
        patient?.addresses[0]?.current_traditional_authority ?? "",
      village: patient?.addresses[1]?.address1 ?? "",
      closeLandMark: patient?.addresses[1]?.address2 ?? "",
    });
  };

  const mapPatientDemographics = (patient: Person) => {
    if (!patient) return;
    setDemographics({
      firstName: patient?.given_name,
      lastName: patient?.family_name,
      birthDate: patient?.birthdate,
      gender: patient?.gender,
      birthDateEstimated: Boolean(patient?.birthdateEstimated),
    });
  };

  const {mutate, isPending, isSuccess, data:mergeResponse}=merge();



  const handleMerge = ()=>{
    mutate(
      {
        primary: {
          patient_id: params?.id
        },
        secondary: [{
          doc_id: patient.uuid, 
        }]
      }
    )
  }

useEffect(()=>{
  if(isSuccess){
    next();
  }

},[isSuccess])

  useEffect(() => {
    mapPatientDemographics(patient);
    mapHomeLocation(patient);
    mapCurrentLocation(patient);
  }, [patient]);


  return (
    <Box>
      <ContainerCard>
        <Typography variant="h5">Demographics</Typography>
        <br />
        <LabelValue label="First Name" value={demographics.firstName} />
        <LabelValue label="Last Name" value={demographics.lastName} />
        <LabelValue label="Gender" value={demographics.gender} />
        <LabelValue label="Date of birth" value={demographics.birthDate} />
      </ContainerCard>
      <ContainerCard>
        <Typography variant="h5">Home Location</Typography>
        <br />
        <LabelValue label="Country" value={homeLocationAddress.nationality} />
        <LabelValue
          label="Home District"
          value={homeLocationAddress.district}
        />
        <LabelValue
          label="Home Traditional Authority"
          value={homeLocationAddress.traditionalAuthority}
        />
        <LabelValue label="Home Village" value={homeLocationAddress.village} />
      </ContainerCard>
      <ContainerCard>
        <Typography variant="h5">Current Location</Typography>
        <br />
        <LabelValue
          label="Current District"
          value={currentLocationAddress.district}
        />
        <LabelValue
          label="Current Traditional Authority"
          value={currentLocationAddress.traditionalAuthority}
        />
        <LabelValue
          label="Current Village"
          value={currentLocationAddress.village}
        />
        <LabelValue
          label="Close Land Mark"
          value={currentLocationAddress.closeLandMark}
        />
      </ContainerCard>
      <MainButton
        sx={{ width: "100%", borderRadius: "1ch" }}
        title={"Merge"}
        onClick={handleMerge}
      />
    </Box>
  );
};

const EditDemographics = ({ next, person, setUpdatedPatient }: { next: () => void, person: Person, setUpdatedPatient:(patient:any)=>void }) => {
  const {
    mutate: updatePatient,
    isPending,
    isSuccess,
    data: updatedPatient,
  } = patchPatient();
  const {
    mutate: updatePatientLocation,
    isPending:locationPending,
    isSuccess: locationUpdated,
    data
  } = patchPatient();
  const { params } = useParameters();
  const [homeLocation, setHomeLocation] = useState<any>({});
  const [currentLocation, setCurrentLocation] = useState<any>({});

  const [demographicsContext, setDemographicsContext] = useState<any>();
  const [homeLocationContext, setHomeLocationContext] = useState<any>();
  const [currentLocationContext, setCurrentLocationContext] = useState<any>();
  const [locations, setLocation] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      next();
    }
  }, [isSuccess]);

  const updateDemographics = (demographics: any) => {

    const identifiers = !Boolean(demographics.identificationNumber) ? []: [
      {
        identifier: demographics.identificationNumber,
        identifierType: concepts.NATIONAL_ID_IDENTIFIER_TYPE,
        preferred: true,
      },
    ]
    const mappedPatient = {
      identifiers,
      names: [
        {
          givenName: demographics.firstName,
          familyName: demographics.lastName,
        },
      ],
      gender: demographics.gender,
      birthdateEstimated: demographics.birthdateEstimated,
      birthdate: demographics.birthDate,
    };

    updatePatient({ id: params?.id, data: mappedPatient });
  };

  const handleLocationSubmit = () => {
    const addresses = [
      {
        address1: homeLocation?.district,
        address2: homeLocation?.village,
        address3: currentLocation?.district,
        stateProvince: currentLocation?.traditionalAuthority,
        countyDistrict: homeLocation?.traditionalAuthority,
        cityVillage: homeLocation?.traditionalAuthority,
        country: homeLocation?.nationality,
        preferred: true,
      },
      {
        address1: currentLocation?.village,
        address2: currentLocation?.closeLandMark,
        countryDistrict: currentLocation?.district,
        cityVillage: currentLocation?.traditionalAuthority,
        preferred: false,
      },
    ];
    updatePatientLocation({ id: params?.id, data: { addresses } });
  };

  useEffect(() => {
    if (
      Object.keys(homeLocation).length == 0 ||
      Object.keys(currentLocation).length == 0
    )return;

    handleLocationSubmit();
  }, [homeLocation, currentLocation]);

  useEffect(()=>{
    if(locationUpdated){
      setUpdatedPatient(data?.patient)
next()
    }
  },[locationUpdated])

  const handleSubmit = () => {
    const { submitForm, errors, isValid, touched, dirty } = demographicsContext;
    const {
      submitForm: hLSubmit,
      errors: hLErrors,
      isValid: hLIsValid,
      touched: hLTouched,
      dirty: hLDirty,
    } = homeLocationContext;
    const {
      submitForm: cLSubmit,
      errors: cLErrors,
      isValid: cLIsValid,
      touched: cLTouched,
      dirty: cLDirty,
    } = currentLocationContext;
    submitForm();
    hLSubmit();
    cLSubmit();

    if (isValid && hLIsValid && cLIsValid) {
      // move next
      // next();
    }
  };

 const nationalId = person.identifiers.find(identifier=>identifier?.identifier_type?.uuid==concepts.NATIONAL_ID_IDENTIFIER_TYPE)?.identifier;

  return (
    <>
      <OverlayLoader open={isPending} />
      <ContainerCard>
        <Typography variant="h5">Edit Demographics</Typography>
        <br />
        <EditDemographicsForm
        
          setContext={setDemographicsContext}
          submitButton={false}
          initialValues={{
            identificationNumber:nationalId,
          firstName: person.given_name,
          lastName: person.family_name,
          gender: person.gender,
          birthDate: person.birthdate,
          birthdateEstimated:false,
          }}
          onSubmit={(values) => {
            updateDemographics(values);
          }}
        />
      </ContainerCard>
      <ContainerCard>
        <Typography variant="h5">Home Location</Typography>
        <br />
        <EditLocation
          setContext={setHomeLocationContext}
          initialValues={{
            nationality: person?.addresses[0]?.country ?? "",
            district: person?.addresses[0]?.address1 ?? "",
            village: person?.addresses[0]?.address2 ?? "",
            traditionalAuthority: person?.addresses[0]?.county_district ?? "",
          }}
          onSubmit={setHomeLocation}
          submitButton={false}
        />
      </ContainerCard>
      <ContainerCard>
        <Typography variant="h5">Current Location</Typography>
        <br />
        <EditLocation
          currentLocation={true}
          setContext={setCurrentLocationContext}
          initialValues={{
            district: person?.addresses[0]?.current_district ?? "",
            traditionalAuthority: person?.addresses[0]?.current_traditional_authority ?? "",
            village: person?.addresses[1]?.address1 ?? "",
            closeLandMark: person?.addresses[1]?.address2 ?? "",
          }}
          onSubmit={setCurrentLocation}
          submitButton={false}
        />
      </ContainerCard>
      <MainButton
        sx={{ width: "100%", borderRadius: "1ch" }}
        title={"submit"}
        onClick={handleSubmit}
      />
    </>
  );
};

const SocialForm = ({ next }: { next: () => void }) => {
  const { data: initialRegistrationList } =
    getPatientsWaitingForRegistrations();
  const { params } = useParameters();
  const {
    mutate: createSocialHistory,
    isSuccess: socialHistoryCreated,
    isPending: creatingSocialHistory,
    isError: socialHistoryError,
  } = addEncounter();
  const [context, setContext] = useState<any>();
  const patient = initialRegistrationList?.find((d) => d.uuid == params?.id);

  useEffect(() => {
    if (socialHistoryCreated) {
      next();
    }
  }, [socialHistoryCreated]);

  const handleSubmit = () => {
    const { submitForm, errors, isValid, touched, dirty } = context;
    submitForm();
  };
  return (
    <>
      <ContainerCard>
        <OverlayLoader open={creatingSocialHistory} />
        <EditSocialHistory
          submitButton={false}
          setContext={setContext}
          initialValues={{}}
          onSubmit={(values) => {
            const dateTime = getDateTime();
            createSocialHistory({
              encounterType: encounters.SOCIAL_HISTORY,
              visit: patient?.visit_uuid,
              patient: params.id,
              encounterDatetime: dateTime,
              obs: getObservations(values, dateTime),
            });
          }}
        />
      </ContainerCard>
      <MainButton
        sx={{ width: "100%", borderRadius: "1ch" }}
        title={"submit"}
        onClick={handleSubmit}
      />
    </>
  );
};

const ReferralForm = ({ next }: { next: () => void }) => {
  const [context, setContext] = useState<any>();
  const { params } = useParameters();
  const { data: initialRegistrationList } =
    getPatientsWaitingForRegistrations();
  const patient = initialRegistrationList?.find((d) => d.uuid == params?.id);

  const {
    mutate: createReferral,
    isSuccess: referralCreated,
    isPending: creatingReferral,
    isError: referralError,
  } = addEncounter();

  const handleSubmit = () => {
    const { submitForm, errors, isValid, touched, dirty } = context;
    submitForm();
    next();
  };
  return (
    <>
      <ContainerCard>
        <EditReferralForm
          setContext={setContext}
          submitButton={false}
          onSubmit={(values) => {
            const patient = initialRegistrationList?.find(
              (d) => d.uuid == params.id
            );
            const dateTime = getDateTime();
            createReferral({
              encounterType: encounters.REFERRAL,
              visit: patient?.visit_uuid,
              patient: params.id,
              encounterDatetime: dateTime,
              obs: getObservations(values, dateTime),
            });
          }}
        />
      </ContainerCard>
      <MainButton
        sx={{ width: "100%", borderRadius: "1ch" }}
        title={"submit"}
        onClick={handleSubmit}
      />
    </>
  );
};
const FinanceForm = ({ next }: { next: () => void }) => {
  const [context, setContext] = useState<any>();
  const { params } = useParameters();
  const { data: initialRegistrationList } =
    getPatientsWaitingForRegistrations();
  const patient = initialRegistrationList?.find((d) => d.uuid == params?.id);
  const {
    mutate: createFinancing,
    isSuccess: financingCreated,
    isPending: creatingFinancing,
    isError: financingError,
  } = addEncounter();

  useEffect(() => {
    if (financingCreated) {
      next();
    }
  }, [financingCreated]);

  const handleSubmit = () => {
    const { submitForm, errors, isValid, touched, dirty } = context;
    submitForm();
    next();
  };
  return (
    <>
      <ContainerCard>
        <EditFinancingForm
          initialValues={{}}
          setContext={setContext}
          submitButton={false}
          onSubmit={(values) => {
            const dateTime = getDateTime();

            const payments = values[concepts.PAYMENT_OPTIONS];

            const paymentObs = payments
              .filter((pay: any) => pay.value)
              .map((p: any) => {
                return {
                  concept: concepts.PAYMENT_OPTIONS,
                  value: p.key,
                  obsDatetime: dateTime,
                };
              });
            createFinancing({
              encounterType: encounters.FINANCING,
              visit: patient?.visit_uuid,
              patient: params.id,
              encounterDatetime: dateTime,
              obs: [...getObservations(values, dateTime), ...paymentObs],
            });
          }}
        />
      </ContainerCard>
      <MainButton
        sx={{ width: "100%", borderRadius: "1ch" }}
        title={"submit"}
        onClick={handleSubmit}
      />
    </>
  );
};

// TODO: START FROM HERE
const RelationshipForm = ({ next }: { next: () => void }) => {
  const [context, setContext] = useState<any>();
  const [relationshipName, setRelationshipName] = useState("");
  const { params } = useParameters();
  const { data: initialRegistrationList } =
    getPatientsWaitingForRegistrations();
  const patient = initialRegistrationList?.find((d) => d.uuid == params?.id);

  const {
    mutate: createRelationship,
    isPending: creatingRelationship,
    isSuccess: relationshipCreated,
    data: relationship,
    isError: relationshipError,
  } = addRelationship();

  const {
    mutate: createNextOfKin,
    isPending: creatingNextOfKin,
    isSuccess: nextOfKinCreated,
    isError: nextOfKinError,
    data: nextOfKin,
  } = addPerson();

  useEffect(() => {
    if (nextOfKinCreated) {
      const patient = initialRegistrationList?.find((d) => d.uuid == params.id);
      const dateTime = getDateTime();
      createRelationship({
        patient: patient?.uuid,
        person: nextOfKin?.uuid,
        nextOfKinRelationship: relationshipName,
      });
    }
  }, [nextOfKinCreated]);

  useEffect(() => {
    if (relationshipCreated) {
      next();
    }
  }, [relationshipCreated]);

  const handleSubmit = () => {
    const { submitForm, errors, isValid, touched, dirty } = context;
    submitForm();
    // next()
  };
  return (
    <>
      <ContainerCard>
        <EditRelationshipForm
          initialValues={{}}
          setContext={setContext}
          submitButton={false}
          onSubmit={(values) => {
            createNextOfKin(values);
            setRelationshipName(values.relationship);
          }}
        />
      </ContainerCard>
      <MainButton
        sx={{ width: "100%", borderRadius: "1ch" }}
        title={"submit"}
        onClick={handleSubmit}
      />
    </>
  );
};
const GuardianForm = ({ next }: { next: () => void }) => {
  const { params } = useParameters();
  const [context, setContext] = useState<any>();
  const {
    mutate: createGuardian,
    isPending: creatingGuardian,
    isSuccess: guardianCreated,
    isError: guardianError,
    data: guardian,
  } = addPerson();
  const {
    mutate: createGuardianRelationship,
    isPending: creatingGuardianRelationship,
    isSuccess: guardianRelationshipCreated,
    data: guardianRelationship,
    isError: guardianRelationshipError,
  } = addRelationship();

  useEffect(() => {
    if (guardianCreated) {
      createGuardianRelationship({
        patient: params?.id,
        person: guardian?.uuid,
        nextOfKinRelationship:  concepts.GUARDIAN,
      });
    }
  }, [guardianCreated]);


  useEffect(()=>{
    if(guardianRelationshipCreated) {
      next();
    }
  },[guardianRelationshipCreated])


  const handleSubmit = () => {
    const { submitForm, errors, isValid, touched, dirty } = context;
    submitForm();
    console.log(errors)
  };


  return (
    <>
      <ContainerCard>
        <EditRelationshipForm
          isGuardian={true}
          initialValues={{given_name:"", family_name:"", relationship: concepts.GUARDIAN}}
          setContext={setContext}
          submitButton={false}
          onSubmit={(values) => {
            console.log({values})
            createGuardian({
              nextOfKinFirstName: values.given_name,
              nextOfKinLastName: values.family_name,
            });
          }}
        />
      </ContainerCard>
      <MainButton
        sx={{ width: "100%", borderRadius: "1ch" }}
        title={"submit"}
        onClick={handleSubmit}
      />
    </>
  );
};

const ContainerCard = ({ children }: { children: ReactNode }) => {
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: "1ch",
        flex: 1,
        my: "1ch",
      }}
    >
      {children}
    </Paper>
  );
};

const LabelValue = ({ label, value }: { label: string; value: any }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        py: "0.5ch",
        mb: "0.5ch",
        borderBottom: "#D8D8D8 solid 1px",
      }}
    >
      <Typography width={"20ch"} sx={{ fontSize: "0.8rem" }}>
        {label}
      </Typography>
      <Typography
        fontWeight={"900"}
        sx={{ fontSize: "0.8rem", textTransform: "capitalize" }}
      >
        {value}
      </Typography>
    </Box>
  );
};
