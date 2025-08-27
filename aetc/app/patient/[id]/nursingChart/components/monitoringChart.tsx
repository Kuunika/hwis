"use client";
import { useEffect, useState } from "react";
import { NewStepperContainer } from "@/components";
import { ObservationsForm } from "./observations";
import { InterventionsForm } from "./interventions";
import { MedicationsForm } from "./medications";

import { concepts, encounters } from "@/constants";
import { useNavigation, useParameters } from "@/hooks";
import {
  addEncounter,
  fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { getObservations } from "@/helpers";
import { Alert, Snackbar } from "@mui/material";
import { useServerTime } from "@/contexts/serverTimeContext";

export const MonitoringChart = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { params } = useParameters();
  const { navigateBack } = useNavigation();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    "error" | "success" | null
  >(null);
  let dateTime: string;
  const [vitalsSubmitting, setVitalsSubmitting] = useState<boolean>(false);
  const { init, ServerTime } = useServerTime();

  const {
    data: patientVisits,
    isLoading,
    isSuccess,
  } = getPatientVisitTypes(params?.id as string);
  const activeVisit = patientVisits?.find((d) => !Boolean(d.date_stopped));

  const steps = [
    { id: 0, label: "Observations" },
    { id: 1, label: "Interventions" },
    { id: 2, label: "Medications" },
  ];

  const {
    mutate: createVitals,
    isSuccess: vitalsCreated,
    isPending: creatingVitals,
    isError: vitalsError,
  } = fetchConceptAndCreateEncounter();

  const {
    mutateAsync: createInterventions,
    isSuccess: interventionsCreated,
    isPending: creatingInterventions,
    isError: interventionsError,
  } = fetchConceptAndCreateEncounter();

  // const {
  //   mutate: createNursingNotes,
  //   isSuccess: nursingNotesCreated,
  //   isPending: creatingNursingNotes,
  //   isError: nursingNotesError,
  // } = fetchConceptAndCreateEncounter();

  useEffect(() => {
    if (vitalsError) {
      setAlertMessage(`Error submitting vitals encounter`);
      setAlertSeverity("error");
    }

    if (interventionsError) {
      setAlertMessage(`Error submitting interventions`);
      setAlertSeverity("error");
    }

    // if (nursingNotesError) {
    //   setAlertMessage(`Error submitting nursing notes`);
    //   setAlertSeverity("error");
    // }

    if (vitalsCreated) {
      setAlertMessage(`Vitals submitted successfully`);
      setAlertSeverity("success");
      handleSkip();
    }

    if (interventionsCreated) {
      setAlertMessage(`All encounters submitted successfully`);
      setAlertSeverity("success");
      handleSkip();
    }
    // if (nursingNotesCreated) {
    //   setAlertMessage(`All encounters submitted successfully`);
    //   setAlertSeverity("success");
    //   setTimeout(() => {
    //     navigateBack();
    //   }, 5000);
    //}

    setVitalsSubmitting(creatingVitals);
  }, [
    vitalsError,
    interventionsError,
    //nursingNotesError,
    vitalsCreated,
    interventionsCreated,
    //nursingNotesCreated,
    creatingVitals,
  ]);

  const handleObservationsSubmit = async (values: any) => {
    dateTime = ServerTime.getServerTimeString();
    if (values["Triage Result"] === "No Score") {
      setAlertMessage(values["Triage Result"]);
      setAlertSeverity("error");
      return;
    }

    const forGroupMembers = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => key !== concepts.TRIAGE_RESULT
      )
    );

    const groupMemberObs = getObservations(forGroupMembers, dateTime);
    const filteredVitals = groupMemberObs.filter((item) => item.value !== "");

    const observations = [
      {
        concept: concepts.TRIAGE_RESULT,
        obsDatetime: dateTime,
        value: values[concepts.TRIAGE_RESULT],
        groupMembers: filteredVitals,
      },
    ];

    createVitals({
      encounterType: encounters.VITALS,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: observations,
    });
  };

  const handleInterventionsSubmit = (values: any) => {
    dateTime = ServerTime.getServerTimeString();
    for (const [key, value] of Object.entries(values)) {
      if (key === "fluidEntries") {
        if (Array.isArray(value)) {
          const validFluidEntries = value.filter((entry) => {
            return (
              entry.intakeFluidType?.[0]?.value ||
              entry.intakeFluidAmount ||
              entry.outputFluidType?.[0]?.id ||
              entry.outputFluidAmount ||
              entry.balance
            );
          });

          if (validFluidEntries.length === 0) {
            continue;
          }

          const fluidObs = value.map((entry) => [
            {
              concept: concepts.INTAKE_FLUIDS,
              value: entry.intakeFluidType[0]?.value,
            },
            {
              concept: concepts.INTAKE_FLUID_AMOUNT,
              value: entry.intakeFluidAmount,
            },
            {
              concept: concepts.OUTPUT_FLUID_TYPE,
              value: entry.outputFluidType[0]?.id,
            },
            {
              concept: concepts.OUTPUT_FLUID_AMOUNT,
              value: entry.outputFluidAmount,
            },
            { concept: concepts.FLUID_BALANCE, value: entry.balance },
          ]);

          fluidObs.forEach((groupMembersObj) => {
            const observations = [
              {
                concept: concepts.FLUID_BALANCE_CHART,
                obsDatetime: dateTime,
                value: true,
                groupMembers: groupMembersObj,
              },
            ];

            createInterventions({
              encounterType: encounters.PROCEDURES_DONE,
              visit: activeVisit?.uuid,
              patient: params.id,
              encounterDatetime: dateTime,
              obs: observations,
            });
          });
        }
        continue;
      }

      if (
        key.endsWith("_Other") ||
        !value ||
        (Array.isArray(value) && value.length === 0)
      ) {
        continue;
      }

      if (Array.isArray(value) && value.length > 0) {
        let obsObject = {};

        if (
          key === "Circulation Interventions" ||
          key === "Disability Interventions" ||
          key === "Exposure Interventions"
        ) {
          obsObject = value.reduce((acc, item) => {
            acc[item.label] = true;
            return acc;
          }, {});
        } else {
          obsObject = value.reduce((acc, item) => {
            const itemKey = item.id || item.label;
            acc[itemKey] = true;
            return acc;
          }, {});
        }

        const obs = getObservations(obsObject, dateTime);

        const otherKey = `${key}_Other`;
        if (values[otherKey]) {
          obs.forEach((element) => {
            const elementConcept = String(element.concept || "");
            const isOtherField =
              elementConcept.toLowerCase().includes("other") ||
              (element.concept &&
                element.concept.toLowerCase().includes("other"));

            if (isOtherField) {
              element.value = values[otherKey];
            }
          });
        }

        const observations = [
          {
            concept: key,
            obsDatetime: dateTime,
            value: true,
            groupMembers: obs,
          },
        ];

        createInterventions({
          encounterType: encounters.PROCEDURES_DONE,
          visit: activeVisit?.uuid,
          patient: params.id,
          encounterDatetime: dateTime,
          obs: observations,
        });
      }
    }
  };

  const handleMedicationsSubmit = (values: any) => {
    console.log("Medications:", values);
    setActiveStep(3);
  };

  const handleSkip = () => {
    const nextStep = activeStep + 1;

    if (nextStep < steps.length) {
      setActiveStep(nextStep);
    } else {
      navigateBack();
    }
  };

  return (
    <>
      <Snackbar
        open={Boolean(alertMessage)}
        autoHideDuration={5000}
        onClose={() => setAlertMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity={alertSeverity || "success"}
          onClose={() => setAlertMessage(null)}
          style={{ opacity: 0.8 }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Monitoring Chart"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <ObservationsForm
          onSubmit={handleObservationsSubmit}
          onSkip={handleSkip}
          submitting={vitalsSubmitting}
        />
        <InterventionsForm
          onSubmit={handleInterventionsSubmit}
          onSkip={handleSkip}
        />
        <MedicationsForm
          onSubmit={handleMedicationsSubmit}
          onSkip={handleSkip}
        />
      </NewStepperContainer>
    </>
  );
};
