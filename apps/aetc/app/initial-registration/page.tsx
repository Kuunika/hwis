"use client";

import { InitialRegistrationForm } from "./components";
import { addPatient } from "@/hooks/patientReg";
import { successDialog } from "@/helpers";
import { MainGrid } from "shared-ui/src";
import {
  RegistrationCard,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "../registration/components/common";
import { Navigation } from "../registration/scanner/page";
import { addVisit } from "@/hooks/visit";
import { useEffect } from "react";
import { AETC_VISIT_TYPE, concepts, encounters } from "@/constants";
import { addEncounter } from "@/hooks/encounter";
import { useNavigation } from "@/hooks";
import { getVisitNum } from "@/hooks/visitNumber";
// import { createPatient } from "@/services/patient";

export default function InitialRegistration() {
  const { navigateTo } = useNavigation();
  const initialValues = { firstName: "", lastName: "" };
  const {
    mutate: createPatient,
    isPending,
    data: createdUser,
    isSuccess,
  } = addPatient();

  const {
    mutate: createVisit,
    isPending: creatingVisit,
    isSuccess: visitCreated,
    data: visit,
  } = addVisit();

  const {
    mutate: createEncounter,
    isPending: creatingEncounter,
    isSuccess: encounterCreated,
  } = addEncounter();

  const {
    data: visitNumberResponse,
    isSuccess: visitNumberGenerated,
    isPending: generatingVisitNumber,
    refetch: generateVisitNumber,
  } = getVisitNum();

  console.log({ generatingVisitNumber, visitNumberGenerated });

  // after patient registration create a visit
  useEffect(() => {
    if (isSuccess) {
      console.log({ createdUser });
      const uuid = createdUser?.uuid;
      createVisit({
        patient: uuid,
        visitType: AETC_VISIT_TYPE,
        startDatetime: new Date().toISOString(),
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!visitCreated) return;
    generateVisitNumber();
  }, [creatingVisit]);

  // after creating a visit create an encounter

  useEffect(() => {
    if (!visitNumberGenerated) return;

    const dateTime = new Date().toISOString();
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
  }, [generatingVisitNumber]);

  const handleSubmit = async (values: any, options: any) => {
    // options.resetForm();
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

    successDialog({
      title: "Patient Added successfully",
      text: "Patient Added to prescreening list",
      icon: "success",
      onConfirm: () => {},
      confirmButtonText: "Register More Patients",
      cancelButtonText: "Home",
      onDismiss: () => navigateTo("/"),
    });
  };
  return (
    <>
      <Navigation title="Initial Registration" link="/" />
      <MainGrid container>
        <MainGrid lg={4} item></MainGrid>
        <MainGrid
          lg={4}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          item
        >
          <br />
          <br />
          <RegistrationMainHeader>Initial Registration</RegistrationMainHeader>
          <RegistrationDescriptionText>
            The demographics form has been thoughtfully crafted to collect
            patient information, including personal details, contact information
          </RegistrationDescriptionText>
          <RegistrationCard>
            <InitialRegistrationForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
            />
          </RegistrationCard>
        </MainGrid>
        <MainGrid lg={4} item></MainGrid>
      </MainGrid>
    </>
  );
}
