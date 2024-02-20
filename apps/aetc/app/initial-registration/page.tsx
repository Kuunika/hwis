"use client";

import { InitialRegistrationForm } from "./components";
import { addPatient, initialPatientRegistration } from "@/hooks/patientReg";
import { successDialog } from "@/helpers";
import { MainGrid } from "shared-ui/src";
import {
  RegistrationCard,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "../registration/components/common";
import { Navigation } from "../registration/scanner/page";
import { addVisit } from "@/hooks/visit";
import { useEffect, useState } from "react";
import { AETC_VISIT_TYPE, concepts, encounters } from "@/constants";
import { addEncounter } from "@/hooks/encounter";
import { useNavigation } from "@/hooks";
import { getVisitNum } from "@/hooks/visitNumber";
import CircularDeterminate, {
  CustomizedProgressBars,
} from "@/components/loader";
import { OperationSuccess } from "@/components/operationSuccess";

export default function InitialRegistration() {
  const { refresh } = useNavigation();
  const initialValues = { firstName: "", lastName: "" };
  const {
    mutate: createPatient,
    isPending,
    data: createdUser,
    isSuccess,
  } = initialPatientRegistration();

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
    isFetching: fetchingVisitNumber,
  } = getVisitNum();

  const [completed, setCompleted] = useState(0);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(true);

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
    if (!visitNumberGenerated) return;

    setCompleted(3);
    setMessage("creating an encounter...");

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
  }, [fetchingVisitNumber]);

  useEffect(() => {
    if (encounterCreated) {
      setCompleted(4);
      setMessage("done");
    }
  }, [encounterCreated]);

  const handleSubmit = async (values: any, options: any) => {
    // options.resetForm();

    setMessage("creating patient");
    setShowForm(false);
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

  const processing =
    isPending || creatingEncounter || creatingVisit || fetchingVisitNumber;

  const successful =
    encounterCreated && isSuccess && visitCreated && visitNumberGenerated;

  return (
    <>
      <Navigation title="Initial Registration" link="/" />
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
          <RegistrationMainHeader>Initial Registration</RegistrationMainHeader>
          <RegistrationDescriptionText>
            The demographics form has been thoughtfully crafted to collect
            patient information, including personal details, contact information
          </RegistrationDescriptionText>
          {successful && !showForm && (
            <OperationSuccess
              title="Patient Created Successful"
              primaryActionText="Register More Patient"
              secondaryActionText="Go Home"
              onPrimaryAction={() => {
                setShowForm(true);
                setCompleted(0);
                refresh();
              }}
              onSecondaryAction={() => {}}
            />
          )}
          {showForm && (
            <RegistrationCard>
              <InitialRegistrationForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
              />
            </RegistrationCard>
          )}
          {processing && (
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
