"use client";
import { useEffect, useState } from "react";
import { NewStepperContainer } from "@/components";
import { ObservationsForm } from "./observations";
import { InterventionsForm } from "./interventions";
import { MedicationsForm } from "./medications";

import { concepts, encounters, triageResult } from "@/constants";
import { useNavigation, useParameters } from "@/hooks";
import {
  addEncounter,
  fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { getObservations } from "@/helpers";
import { useFormLoading } from "@/hooks/formLoading";
import { Alert, Snackbar } from "@mui/material";

export const MonitoringChart = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { params } = useParameters();
  const { mutate } = addEncounter();
  const { navigateTo, navigateBack } = useNavigation();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    "error" | "success" | null
  >(null);
  const dateTime = getDateTime();
  const [vitalsSubmitting, setVitalsSubmitting] = useState<boolean>(false);

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

  useEffect(() => {
    if (vitalsError) {
      setAlertMessage(`Error submitting vitals encounter`);
      setAlertSeverity("error");
    }

    if (interventionsError) {
      setAlertMessage(`Error submitting interventions`);
      setAlertSeverity("error");
    }

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

    setVitalsSubmitting(creatingVitals);
  }, [
    vitalsError,
    interventionsError,
    vitalsCreated,
    interventionsCreated,
    creatingVitals,
  ]);

  const handleObservationsSubmit = async (values: any) => {
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
    const airwayKey = concepts.AIRWAY_OPENING_INTERVENTIONS;
    const otherKey = `${airwayKey}_Other`;

    for (const [key, value] of Object.entries(values)) {
      if (key === "fluidEntries") {
        if (Array.isArray(value)) {
          const fluidObs = value.map((entry) => [
            {
              concept: concepts.INTAKE_FLUIDS,
              value: entry.intakeFluidType[0].value,
            },
            {
              concept: concepts.INTAKE_FLUID_AMOUNT,
              value: entry.intakeFluidAmount,
            },
            {
              concept: concepts.OUTPUT_FLUID_TYPE,
              value: entry.outputFluidType[0].id,
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
        key === otherKey ||
        !value ||
        (Array.isArray(value) && value.length === 0)
      ) {
        continue;
      }
      
      let obsObject;
      if(key === "Circulation Interventions"){
        obsObject = (value as any[]).reduce((acc, item) => {
          acc[item.label] = true;
          return acc;
        }, {} as Record<string, boolean>);
      } 
      else{
        obsObject = (value as any[]).reduce((acc, item) => {
          acc[item.id] = true;
          return acc;
        }, {} as Record<string, boolean>);
      }

      
      const obs = getObservations(obsObject, dateTime);
      obs.forEach((element) => {
        if (element.concept === concepts.OTHER_AIRWAY_INTERVENTION) {
          element.value = values[otherKey];
        }
      });
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
