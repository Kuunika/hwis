"use client";
import { PrescreeningForm } from "../components/preScreeningForm";
import { useNavigation, useParameters } from "@/hooks";
import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
} from "@/app/registration/components/common";

import { MainGrid } from "@/components";
import {
  addEncounter,
  fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { concepts, encounters } from "@/constants";
import { getPatientsWaitingForPrescreening } from "@/hooks/patientReg";
import { getDateTime } from "@/helpers/dateTime";
import { closeCurrentVisit } from "@/hooks/visit";
import { useFormLoading } from "@/hooks/formLoading";
import { OperationSuccess } from "@/components/operationSuccess";
import { FormError } from "@/components/formError";
import { CustomizedProgressBars } from "@/components/loader";
import { useEffect } from "react";
import { Navigation } from "@/app/components/navigation";

export default function ScreeningPage() {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const { data } = getPatientsWaitingForPrescreening();
  const {
    mutate: createEncounter,
    isPending,
    isSuccess,
  } = fetchConceptAndCreateEncounter();
  const { mutate: closeVisit, isSuccess: visitClosed } = closeCurrentVisit();
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

  useEffect(() => {
    if (isSuccess) {
      setCompleted(1);
      setLoading(false);
    }
  }, [isSuccess]);

  const handleSubmit = (values: any) => {
    setShowForm(false);
    const patient = data?.find((d) => d.uuid == params.id);
    setLoading(true);
    setMessage("add Screening data... ");

    createEncounter({
      encounterType: encounters.SCREENING_ENCOUNTER,
      visit: patient?.visit_uuid,
      patient: params.id,
      encounterDatetime: getDateTime(),
      obs: [
        {
          concept: concepts.IS_PATIENT_REFERRED,
          value: values[concepts.IS_PATIENT_REFERRED],
          obsDatetime: getDateTime(),
          coded: true,
        },
        {
          concept: concepts.IS_SITUATION_URGENT,
          value: values[concepts.IS_SITUATION_URGENT],
          obsDatetime: getDateTime(),
          coded: true,
        },
        {
          concept: concepts.PATIENT_REFERRED_TO,
          value: values[concepts.PATIENT_REFERRED_TO],
          obsDatetime: getDateTime(),
        },
      ],
    });

    if (Boolean(values[concepts.PATIENT_REFERRED_TO])) {
      patient && closeVisit(patient?.visit_uuid);
    }
  };
  return (
    <>
      <Navigation title="Prescreening" link="/initial-registration/list" />
      <MainGrid container>
        <MainGrid xs={1} lg={3} item></MainGrid>
        <MainGrid
          xs={10}
          lg={6}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          item
        >
          <br />
          <br />
          <RegistrationMainHeader>Screening</RegistrationMainHeader>
          <RegistrationDescriptionText>
            This is a list of all patients that went through initial
            registration successfully and waiting for prescreening.
          </RegistrationDescriptionText>
          {showForm && (
            <RegistrationCard>
              <PrescreeningForm onSubmit={handleSubmit} />
            </RegistrationCard>
          )}
          {completed == 1 && (
            <OperationSuccess
              title="Patient Screened Successfully"
              primaryActionText="screen more"
              secondaryActionText="Go Home"
              onPrimaryAction={() => {
                navigateTo("/initial-registration/list");
                setShowForm(true);
                setCompleted(0);
              }}
              onSecondaryAction={() => {
                navigateTo("/dashboard");
              }}
            />
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
                progress={(completed / 1) * 100}
              />
            </>
          )}
        </MainGrid>
        <MainGrid xs={1} lg={3} item></MainGrid>
      </MainGrid>
    </>
  );
}
