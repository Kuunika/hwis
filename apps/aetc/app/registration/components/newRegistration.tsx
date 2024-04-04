"use client";
import { useState, ReactNode, useEffect, useRef, useContext } from "react";
import {
  MainButton,
  MainGrid,
  MainTypography,
  WrapperBox,
} from "shared-ui/src";
import {
  DemographicsForm,
  FinancingForm,
  ReferralForm,
  ShowFormErrors,
  SocialHistoryForm,
} from "../components";
import { useNavigation, useParameters } from "@/hooks";

import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { getObservations, successDialog } from "@/helpers";
import {
  getPatientsWaitingForRegistrations,
  registerPatient,
  searchByDemographics,
} from "@/hooks/patientReg";
import { addPerson, addRelationship } from "@/hooks/people";
import { addEncounter } from "@/hooks/encounter";
import { concepts, encounters } from "@/constants";
import { getDateTime } from "@/helpers/dateTime";
import { OperationSuccess } from "@/components/operationSuccess";
import { CustomizedProgressBars } from "@/components/loader";
import { FormError } from "@/components/formError";
import { SearchPotentialDuplicates } from "./searchPontentialDuplicates";
import { OverlayLoader } from "@/components/backdrop";
import { SearchRegistrationContext, SearchRegistrationContextType } from "@/contexts";
import { FaPrint } from "react-icons/fa6";
import { BarcodeComponent } from "@/components/barcode";
import { PatientUpdateResponse } from "@/interfaces";

export const NewRegistrationFlow = () => {
  const [active, setActive] = useState(4);
  const { navigateTo } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [showForm, setShowForm] = useState(true); //TODO: change to true
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const { registrationType } = useContext(SearchRegistrationContext) as SearchRegistrationContextType;
  const [formError, setFormError] = useState<{ hasError: boolean, errors: any }>({ hasError: false, errors: '' })



  const [demographicsContext, setDemographicsContext] = useState<any>();
  const [socialHistoryContext, setSocialHistoryContext] = useState<any>();
  const [referralContext, setReferralContext] = useState<any>();
  const [financingFormContext, setFinancingFormContext] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [patientValues, setPatientValues] = useState({
    firstName: '', lastName: '', gender: '', birthdate: '',
    homeVillage: '',
    homeTA: '',
    homeDistrict: ''
  })

  const { refetch, isFetching, isSuccess, data: ddePatients } = searchByDemographics(patientValues.firstName, patientValues.lastName, patientValues.gender, patientValues.birthdate, patientValues.homeVillage, patientValues.homeTA, patientValues.homeDistrict)
  const { data: initialRegistrationList } =
    getPatientsWaitingForRegistrations();
  const { params } = useParameters();
  const {
    mutate: createPatient,
    isPending: creatingPatient,
    isSuccess: patientCreated,
    isError: patientError,
    data: patient,
  } = registerPatient();


  const {
    mutate: createNextOfKin,
    isPending: creatingNextOfKin,
    isSuccess: nextOfKinCreated,
    isError: nextOfKinError,
    data: nextOfKin,
  } = addPerson();

  const {
    mutate: createGuardian,
    isPending: creatingGuardian,
    isSuccess: guardianCreated,
    isError: guardianError,
    data: guardian,
  } = addPerson();

  const {
    mutate: createSocialHistory,
    isSuccess: socialHistoryCreated,
    isPending: creatingSocialHistory,
    isError: socialHistoryError,
  } = addEncounter();

  const {
    mutate: createReferral,
    isSuccess: referralCreated,
    isPending: creatingReferral,
    isError: referralError,
  } = addEncounter();

  const {
    mutate: createFinancing,
    isSuccess: financingCreated,
    isPending: creatingFinancing,
    isError: financingError,
  } = addEncounter();

  const {
    mutate: createRelationship,
    isPending: creatingRelationship,
    isSuccess: relationshipCreated,
    data: relationship,
    isError: relationshipError,
  } = addRelationship();


  const {
    mutate: createGuardianRelationship,
    isPending: creatingGuardianRelationship,
    isSuccess: guardianRelationshipCreated,
    data: guardianRelationship,
    isError: guardianRelationshipError,
  } = addRelationship();

  const trigger = () => <MainButton variant="text" sx={{ color: "#000", ml: 0.5, fontSize: "2em" }} title={<FaPrint />} onClick={() => { }} />


  useEffect(() => {

    if (!Boolean(patientValues.firstName)) return

    if (registrationType != 'remote') {

      refetch()
    }

  }, [patientValues])

  // patient created
  useEffect(() => {
    if (patientCreated) {
      setCompleted(1);
      setMessage("creating next of kin...");
      createNextOfKin(formData.demographics);
    }
  }, [patientCreated]);

  useEffect(() => {
    if (nextOfKinCreated && nextOfKin && patient) {
      setCompleted(2);
      setMessage("adding relationship...");
      createRelationship({
        patient: patient?.uuid,
        person: nextOfKin?.uuid,
        nextOfKinRelationship: formData.demographics.nextOfKinRelationship,
      });
    }
  }, [nextOfKinCreated]);


  //create socialHistory
  useEffect(() => {
    if (relationshipCreated) {
      setCompleted(3);
      setMessage("adding social history...");
      const patient = initialRegistrationList?.find((d) => d.uuid == params.id);
      const dateTime = getDateTime();
      createSocialHistory({
        encounterType: encounters.SOCIAL_HISTORY,
        visit: patient?.visit_uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: getObservations(formData.socialHistory, dateTime),
      });
    }
  }, [relationshipCreated]);

  // create referral
  useEffect(() => {
    if (socialHistoryCreated) {
      setCompleted(4);
      setMessage("adding referral...");
      const patient = initialRegistrationList?.find((d) => d.uuid == params.id);
      const dateTime = getDateTime();
      createReferral({
        encounterType: encounters.REFERRAL,
        visit: patient?.visit_uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: getObservations(formData.referral, dateTime),
      });
    }
  }, [socialHistoryCreated]);

  // create financing
  useEffect(() => {
    if (referralCreated) {
      setCompleted(5);
      setMessage("adding financing data...");
      const patient = initialRegistrationList?.find((d) => d.uuid == params.id);
      const dateTime = getDateTime();

      const payments = formData.financing[concepts.PAYMENT_OPTIONS]

      const paymentObs = payments.filter((pay: any) => pay.value).map((p: any) => {
        return {
          concept: concepts.PAYMENT_OPTIONS,
          value: p.key,
          obsDatetime: dateTime,
        }
      })


      delete formData.financing[concepts.PAYMENT_OPTIONS]

      createFinancing({
        encounterType: encounters.FINANCING,
        visit: patient?.visit_uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: [...getObservations(formData.financing, dateTime), ...paymentObs],
      });
    }
  }, [referralCreated]);


  useEffect(() => {
    if (financingCreated) {
      setCompleted(6);
      setMessage("creating guardian...");
      createGuardian({
        nextOfKinFirstName: formData.demographics.guardianFirstName,
        nextOfKinLastName: formData.demographics.guardianLastName,
      });
    }
  }, [financingCreated]);


  useEffect(() => {
    if (guardianCreated && guardian && patient) {
      setCompleted(7);
      setMessage("adding guardian relationship...");
      createGuardianRelationship({
        patient: patient?.uuid,
        person: guardian?.uuid,
        nextOfKinRelationship: concepts.GUARDIAN,
      });
    }
  }, [guardianCreated]);


  useEffect(() => {
    if (guardianRelationshipCreated) {
      setLoading(false);
      setCompleted(8);
    }
  }, [guardianRelationshipCreated]);





  const formatErrorsToList = (errors: any) => {

    const errorKeys = Object.keys(errors);

    if (errorKeys.length == 0) {
      return;
    }

    const errorList = <WrapperBox sx={{ display: "flex", flexDirection: "column" }}>
      {errorKeys.map(key => {
        return <MainTypography color={"#800000"} variant="subtitle2" key={key}>{errors[key]}</MainTypography>
      })}
    </WrapperBox>

    setFormError({
      hasError: true,
      errors: errorList
    })


  }


  const changeActive = async (step: number) => {
    if (active == 1) {
      const { submitForm, errors, isValid, touched, dirty } =
        demographicsContext;
      submitForm();

      formatErrorsToList(errors)


      if (isValid && dirty) {
        setActive(active + 1);
      }
    }
    if (active == 2) {
      const { submitForm, errors, isValid, touched, dirty } =
        socialHistoryContext;
      submitForm();
      formatErrorsToList(errors)

      if (isValid && dirty) {
        setActive(active + 1);
      }
    }
    if (active == 3) {
      const { submitForm, errors, isValid, touched, dirty } = referralContext;
      submitForm();
      formatErrorsToList(errors)

      if (isValid) {
        setActive(active + 1);
      }
    }
    if (active == 4) {
      const { submitForm, errors, isValid, touched, dirty } =
        financingFormContext;
      submitForm();
      formatErrorsToList(errors)

      if (isValid && dirty) {
        // setActive(active + 1);
      }
    }
  };

  const handleSubmitFinancing = (values: any) => {
    formData["financing"] = values;
    triggerSubmission();
  };

  const triggerSubmission = () => {
    setMessage("adding demographics...");
    setLoading(true);
    setShowForm(false);

    createPatient({ ...formData.demographics, id: params.id });
  };

  useEffect(() => {
    const error =
      patientError ||
      socialHistoryError ||
      referralError ||
      relationshipError ||
      financingError ||
      nextOfKinError ||
      guardianRelationshipError

    setError(error);
  }, [
    patientError,
    socialHistoryError,
    referralError,
    relationshipError,
    financingError,
    nextOfKinError,
    guardianRelationshipError
  ]);


  const getPatientId = (patient: PatientUpdateResponse) => {

    if (!patient) return '';

    const identifiers = patient.patient.identifiers.find(ide => ide.identifier_type.name == 'National id')

    if (!identifiers) return '';

    return identifiers.identifier;

  }



  return (
    <>
      <OverlayLoader open={isFetching} />
      <SearchPotentialDuplicates close={() => setDialogOpen(false)} open={isSuccess && dialogOpen} ddePatients={ddePatients ? ddePatients : []} />
      <MainGrid sx={{ height: "95vh", position: "relative", overflowY: "auto" }} container>
        <MainGrid item xs={1} sm={2} md={3} lg={4}></MainGrid>
        <MainGrid
          item
          xs={10}
          md={6}
          sm={8}
          lg={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "90vh",
            overflowY: "auto"

          }}
        >
          {showForm && (
            <>

              <ShowFormErrors open={formError.hasError} onClose={() => setFormError({ hasError: false, errors: "" })}>
                {formError.errors}
              </ShowFormErrors>
              <br />
              <br />
              {active == 1 && (
                <DemographicsForm
                  setContext={setDemographicsContext}
                  onSubmit={(values: any) => {
                    formData["demographics"] = values;
                    setPatientValues({
                      ...values,
                      homeDistrict: values.homeDistrict,
                      homeTA: values.homeTraditionalAuthority,
                      homeVillage: values.homeVillage,
                      birthdate: values.birthDate
                    })

                    if (registrationType != 'remote') {
                      setDialogOpen(true)
                    }

                  }
                  }
                />
              )}
              {active == 2 && (
                <SocialHistoryForm
                  setContext={setSocialHistoryContext}
                  onSubmit={(values: any) =>
                    (formData["socialHistory"] = values)
                  }
                />
              )}
              {active == 3 && (
                <ReferralForm
                  setContext={setReferralContext}
                  initialValues={{}}
                  onSubmit={(values: any) => (formData["referral"] = values)}
                />
              )}
              {active == 4 && (
                <FinancingForm
                  setContext={setFinancingFormContext}
                  initialValues={{}}
                  onSubmit={handleSubmitFinancing}
                />
              )}
            </>
          )}

          {completed == 8 && ( //TODO: change to completed == 6 
            <>
              <br />
              <br />
              <br />
              <OperationSuccess
                title="Patient Created Successful"
                primaryActionText="Register More Patient"
                secondaryActionText="Go Home"
                onPrimaryAction={() => {
                  navigateTo("/registration/list");
                  // setCompleted(0);
                }}
                onSecondaryAction={() => {
                  navigateTo("/dashboard");
                }}

                printButton={<BarcodeComponent trigger={trigger} value={getPatientId(patient)} display={``} />}
              />
            </>
          )}

          {error && (
            <FormError
              error={message}
              onPrimaryAction={() => {
                setError(false);
                setCompleted(0);
                triggerSubmission();
              }}
              onSecondaryAction={() => {
                setCompleted(0);
                setActive(1);
                setShowForm(true);
                setLoading(false);
                setError(false);
              }}
            />
          )}
          {loading && !error && (
            <>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <CustomizedProgressBars
                message={message}
                progress={(completed / 8) * 100}
              />
            </>
          )}
        </MainGrid>
        <MainGrid item xs={1} sm={2} md={3} lg={4}></MainGrid>
        {showForm && (
          <RegistrationNavigation active={active} setActive={changeActive} />
        )}
      </MainGrid>
    </>
  );
};

const RegistrationNavigation = ({
  active,
  setActive,
}: {
  active: number;
  setActive: (step: number) => void;
}) => {
  const { navigateTo } = useNavigation();
  const buttonStyles = {
    width: "126px",
    height: "44px",
    padding: "10px 18px",
    borderRadius: "8px",
    gap: "8px",
  };

  const scrollToComponent = (id: number) => {
    const element = document.getElementById(id.toString());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return (
    <WrapperBox
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        position: "absolute",
        zIndex: "10",
        bottom: 0,
        backgroundColor: "#fff",
        borderTop: "1px #E6E6E6 solid",
        py: { md: "1ch" },
        px: { sm: "1ch" },
        mb: "2ch",
      }}
    >
      <MainButton
        icon={<FaArrowLeftLong />}
        sx={{
          ...buttonStyles,
          backgroundColor: "#636363",
          "&:hover": { backgroundColor: "#636363" },
        }}
        title={"previous"}
        onClick={() => {
          if (active == 1) return;
          setActive(active - 1);
          scrollToComponent(active - 1)
        }}
      />
      <WrapperBox
        sx={{ display: "flex", alignItems: "center", color: "#00190E" }}
      >
        <NavBox onClick={() => setActive(1)} active={active == 1}>
          Demographics
        </NavBox>
        <FaArrowRightLong />
        <NavBox onClick={() => setActive(2)} active={active == 2}>
          Social History
        </NavBox>
        <FaArrowRightLong />
        <NavBox onClick={() => setActive(3)} active={active == 3}>
          Referral
        </NavBox>
        <FaArrowRightLong />
        <NavBox onClick={() => setActive(4)} active={active == 4}>
          Financing
        </NavBox>
      </WrapperBox>
      <MainButton
        iconRight={<FaArrowRightLong />}
        sx={buttonStyles}
        title={"next"}
        onClick={() => {
          // if (active == 3) {
          //   successDialog({
          //     title: "Registration Completed",
          //     text: "",
          //     icon: "success",
          //     onConfirm: () => navigateTo("/registration/list"),
          //     confirmButtonText: "Register More Patients",
          //     cancelButtonText: "Home",
          //     onDismiss: () => navigateTo("/"),
          //   });

          //   return;
          // }
          setActive(active + 1);
          scrollToComponent(active + 1)
        }}
      />
    </WrapperBox>
  );
};

const NavBox = ({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <WrapperBox
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "1ch",
        borderBottom: active ? "solid 1px #00190E" : "",
        mx: "2ch",
        color: !active ? "#636363" : "",
        cursor: "pointer",
      }}
    >
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 400,
          letterSpacing: "0em",
        }}
      >
        {children}
      </MainTypography>
    </WrapperBox>
  );
};
