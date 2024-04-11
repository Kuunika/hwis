"use client";

import { InitialRegistrationForm } from "./components";
import { initialPatientRegistration, searchDDEPatientByNpid } from "@/hooks/patientReg";



import { MainGrid, MainTypography, WrapperBox } from "shared-ui/src";
import {
  RegistrationCard,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "../registration/components/common";
import { addVisit } from "@/hooks/visit";
import { useEffect, useState } from "react";
import { AETC_VISIT_TYPE, concepts, encounters, roles } from "@/constants";
import { addEncounter } from "@/hooks/encounter";
import { useNavigation } from "@/hooks";
import { getVisitNum } from "@/hooks/visitNumber";
import { CustomizedProgressBars } from "@/components/loader";
import { OperationSuccess } from "@/components/operationSuccess";
import { useFormLoading } from "@/hooks/formLoading";
import { FormError } from "@/components/formError";
import { Navigation } from "../components/navigation";
import AuthGuard from "@/helpers/authguard";
import { BarcodeDialog } from "./components/barcodeScanner";
import { getDateTime } from "@/helpers/dateTime";
import { FaBarcode } from "react-icons/fa6";



function InitialRegistration() {
  const [showDialog, setShowDialog] = useState(false)
  const [npid, setNpid] = useState('')
  const { refresh, navigateTo } = useNavigation();
  const [initialValues, setInitialValues] = useState({ firstName: '', lastName: '' });


  const {
    loading,
    setLoading,
    completed,
    setCompleted,
    message,
    setMessage,
    showForm,
    setShowForm,
    error,
    setError,
  } = useFormLoading();

  const {
    mutate: createPatient,
    isPending,
    data: createdUser,
    isSuccess,
    isError: patientError,
  } = initialPatientRegistration();

  const {
    mutate: createVisit,
    isPending: creatingVisit,
    isSuccess: visitCreated,
    data: visit,
    isError: visitError,
  } = addVisit();

  const {
    mutate: createEncounter,
    isPending: creatingEncounter,
    isSuccess: encounterCreated,
    isError: encounterError,
  } = addEncounter();

  const {
    data: visitNumberResponse,
    isSuccess: visitNumberGenerated,
    isPending: generatingVisitNumber,
    refetch: generateVisitNumber,
    isFetching: fetchingVisitNumber,
    isError: visitNumberError,
  } = getVisitNum();

  const { refetch, isRefetching, data: foundPatients } = searchDDEPatientByNpid(npid);


  const formatScanSearch = () => {

    const defaultInitial = { firstName: "", lastName: "" };

    if (!foundPatients) return defaultInitial;

    if (foundPatients?.locals.length > 0) {
      return {
        firstName: foundPatients.locals[0].given_name,
        lastName: foundPatients.locals[0].family_name,
      }
    }

    if (foundPatients?.remotes.length > 0) {
      return {
        firstName: foundPatients.remotes[0].given_name,
        lastName: foundPatients.remotes[0].family_name,
      }
    }

    setShowDialog(false);

    return defaultInitial
  }

  useEffect(() => {
    setInitialValues(formatScanSearch());

  }, [foundPatients])


  //handle scan data
  useEffect(() => {
    if (npid == '') return
    refetch()

  }, [npid])

  // after patient registration create a visit
  useEffect(() => {
    if (isSuccess) {
      setCompleted(1);
      setMessage("creating visit");
      const uuid = createdUser?.uuid;
      createVisit({
        patient: uuid,
        visitType: AETC_VISIT_TYPE,
        startDatetime: new Date().toISOString(),
      });
    }
  }, [isPending]);

  useEffect(() => {
    if (!visitCreated) return;
    setCompleted(2);
    setMessage("generating visit number...");
    generateVisitNumber();
  }, [creatingVisit]);

  // after creating a visit create an encounter
  useEffect(() => {
    if (!visit) return
    if (!visitNumberGenerated) return;

    setCompleted(3);
    setMessage("creating an encounter...");

    const dateTime = getDateTime();
    createEncounter({
      encounterType: encounters.INITIAL_REGISTRATION,
      visit: visit?.uuid,
      patient: createdUser?.uuid,
      encounterDatetime: dateTime,
      obs: [
        {
          concept: concepts.VISIT_NUMBER,
          value: visitNumberResponse?.next_visit_number,
          obsDatetime: dateTime,
        },
      ],
      includeAll: true,
    });
  }, [fetchingVisitNumber]);

  useEffect(() => {
    if (encounterCreated) {
      setCompleted(4);
      setLoading(false);
      setMessage("done");
    }
  }, [encounterCreated]);

  useEffect(() => {
    const error =
      patientError || visitError || visitNumberError || encounterError;

    setError(error);
  }, [patientError, visitError, visitNumberError, encounterError]);

  const handleSubmit = async (values: any, options: any) => {
    // options.resetForm();
    setMessage("creating patient");
    setShowForm(false);
    setLoading(true);

    const patient = await createPatient({
      identifiers: [
        {
          identifier: "103VWY7",
          identifierType: "ba2f7018-8d80-11d8-abbb-0024217bb78e",
          preferred: true,
        },
      ],
      person: {
        gender: "N/A",
        birthdate: "1970-01-01T00:00:00.000+01000",
        names: [
          {
            givenName: values.firstName,
            familyName: values.lastName,
          },
        ],
        addresses: [],
      },
    });
  };


  return (
    <>
      <Navigation title="Patient Arrival" link="/dashboard" />
      <MainGrid container>
        <MainGrid xs={2} md={3} lg={4} item></MainGrid>
        <MainGrid
          md={6}
          lg={4}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          item
        >
          <br />
          <br />

          <RegistrationMainHeader>Patient Arrival</RegistrationMainHeader>
          <RegistrationDescriptionText>
            The demographics form has been thoughtfully crafted to collect
            patient information, including personal details, contact information
          </RegistrationDescriptionText>
          {completed == 4 && (
            <OperationSuccess
              title={`Patient Created With Visit Number ${visitNumberResponse?.next_visit_number}`}
              primaryActionText="Register More Patient"
              secondaryActionText="Go Home"
              onPrimaryAction={() => {
                setShowForm(true);
                setCompleted(0);
                refresh();
              }}
              onSecondaryAction={() => {
                navigateTo("/dashboard")
              }}
            />
          )}
          {showForm && (
            <>

              <RegistrationCard >
                {/* <MainButton variant="secondary" title={"Scan Barcode"} onClick={() => { }} /> */}
                <br />
                <BarcodeDialog isLoading={isRefetching} onBarcodeScan={(value: any) => setNpid(value)} open={showDialog} onClose={() => setShowDialog(false)} />
                <MainTypography onClick={() => setShowDialog(true)} sx={{ cursor: "pointer", width: "10%", }} variant="h4">
                  <FaBarcode />
                </MainTypography>
                <br />
                <InitialRegistrationForm
                  initialValues={initialValues}
                  onSubmit={handleSubmit}

                />
              </RegistrationCard>
            </>
          )}
          {error && (
            <FormError
              error={message}
              onPrimaryAction={() => {
                setError(false);
                setCompleted(0);
                setLoading(false);
                setShowForm(true);
              }}
              onSecondaryAction={() => {
                setCompleted(0);
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
              <CustomizedProgressBars
                message={message}
                progress={(completed / 4) * 100}
              />
            </>
          )}
        </MainGrid>
        <MainGrid xs={2} md={3} lg={4} item></MainGrid>
      </MainGrid>
    </>
  );
}





export default AuthGuard(InitialRegistration, [roles.ADMIN, roles.CLINICIAN, roles.REGISTRATION_CLERK, roles.NURSE, roles.INITIAL_REGISTRATION_CLERK])