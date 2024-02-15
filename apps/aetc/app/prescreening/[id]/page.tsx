"use client";
import { MiddlePageLayout } from "@/components/layouts";
import { PrescreeningForm } from "../components/preScreeningForm";
import { successDialog } from "@/helpers";
import { useNavigation, useParameters } from "@/hooks";
import {
  RegistrationMainHeader,
  RegistrationDescriptionText,
  RegistrationCard,
} from "@/app/registration/components/common";
import { Navigation } from "@/app/registration/scanner/page";
import { MainGrid } from "shared-ui/src";
import { addEncounter } from "@/hooks/encounter";
import { concepts, encounters } from "@/constants";
import { getInitialRegisteredPatients } from "@/hooks/patientReg";
import { getDateTime } from "@/helpers/dateTime";
import { closeCurrentVisit } from "@/hooks/visit";

export default function Prescreening() {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();
  const { data } = getInitialRegisteredPatients();
  const { mutate: createEncounter, isPending, isSuccess } = addEncounter();
  const { mutate: closeVisit, isSuccess: visitClosed } = closeCurrentVisit();

  const handleSubmit = (values: any) => {
    const patient = data?.find((d) => d.id == params.id);
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
        },
        {
          concept: concepts.IS_SITUATION_URGENT,
          value: values[concepts.IS_SITUATION_URGENT],
          obsDatetime: getDateTime(),
        },
        {
          concept: concepts.PATIENT_REFERRED_TO,
          value: values[concepts.PATIENT_REFERRED_TO],
          obsDatetime: getDateTime(),
        },
      ],
    });

    console.log(Boolean(values[concepts.PATIENT_REFERRED_TO]));
    if (Boolean(values[concepts.PATIENT_REFERRED_TO])) {
      closeVisit(patient?.visit_uuid);
    }
    // console.log({ values });
    successDialog({
      title: "Prescreening Completed",
      text: "",
      icon: "success",
      onConfirm: () => navigateTo("/initial-registration/list"),
      confirmButtonText: "Prescreen More Patients",
      cancelButtonText: "Home",
      onDismiss: () => navigateTo("/"),
    });
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
          <RegistrationCard>
            <PrescreeningForm onSubmit={handleSubmit} />
          </RegistrationCard>
        </MainGrid>
        <MainGrid xs={1} lg={3} item></MainGrid>
      </MainGrid>
    </>
  );
}
