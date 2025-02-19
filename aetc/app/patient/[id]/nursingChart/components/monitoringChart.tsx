"use client";
import { useEffect, useState } from "react";
import { NewStepperContainer } from "@/components";
import { ObservationsForm } from "./observations";
import { InterventionsForm } from "./interventions";
import { MedicationsForm } from "./medications";

import { concepts, encounters } from "@/constants";
import { useNavigation, useParameters } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { getObservations } from "@/helpers";
import { useFormLoading } from "@/hooks/formLoading";
import { NursingNotesForm } from "./nursingNotes";
import { Alert, Snackbar } from "@mui/material";


export const MonitoringChart = () => {
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

  const [activeStep, setActiveStep] = useState<number>(0);
  const { params } = useParameters();
  const { mutate } = addEncounter();
  const { navigateTo, navigateBack } = useNavigation();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | null>(null);
  const dateTime = getDateTime();

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
    { id: 3, label: "Nursing Notes" },
  ];

  const {
    mutate: createVitals,
    isSuccess: vitalsCreated,
    isPending: creatingVitals,
    isError: vitalsError,
  } = addEncounter();

  const {
    mutate: createInterventions,
    isSuccess: interventionsCreated,
    isPending: creatingInterventions,
    isError: interventionsError,
  } = addEncounter();

  const {
    mutate: createNursingNotes,
    isSuccess: nursingNotesCreated,
    isPending: creatingNursingNotes,
    isError: nursingNotesError,
  } = addEncounter();


  useEffect(() => {
    if (vitalsError) {
      setAlertMessage(`Error submitting vitals encounter`);
      setAlertSeverity("error");
    } 
    
    if (interventionsError) {
      setAlertMessage(`Error submitting interventions`);
      setAlertSeverity("error");
    } 

    if (nursingNotesError) {
      setAlertMessage(`Error submitting nursing notes`);
      setAlertSeverity("error");
    }

    if(vitalsCreated) {
      setAlertMessage(`Vitals submitted successfully`);
      setAlertSeverity("success");
      setActiveStep(1);
    }

    if(interventionsCreated) {
      setAlertMessage(`All encounters submitted successfully`);
      setAlertSeverity("success");
    }
    if(nursingNotesCreated) {
      setAlertMessage(`All encounters submitted successfully`);
      setAlertSeverity("success");
    }


  }, [vitalsError, interventionsError, nursingNotesError, vitalsCreated, interventionsCreated, nursingNotesCreated]);

  const handleObservationsSubmit = async (values: any) => {

      const forGroupMembers = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => key !== concepts.TRIAGE_RESULT)
      );

      const groupMemberObs = getObservations(forGroupMembers, dateTime);

      const observations = [
        {
          concept: concepts.TRIAGE_RESULT,
          obsDatetime: dateTime,
          value: values[concepts.TRIAGE_RESULT],
          group_members: groupMemberObs,
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

    if (values[airwayKey]) {
      values[airwayKey] = values[airwayKey]?.map((item: any) => {
        if (item.id === concepts.OTHER_AIRWAY_INTERVENTION) {
          const newLabel = values[otherKey];
          delete values[otherKey];
          return {
            id: concepts.OTHER_AIRWAY_INTERVENTION,
            label: newLabel,
          };
        }
        return item;
      });
    }

    if (values.fluidEntries) {
      values[concepts.INTAKE_FLUIDS] = values.fluidEntries;
      delete values.fluidEntries;
    }

    createInterventions({
      encounterType: encounters.PROCEDURES_DONE,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: getObservations(values, dateTime),
    });

    setActiveStep(2);
  };

  const handleMedicationsSubmit = (values: any) => {
    console.log("Medications:", values);
    setActiveStep(3);
  };

  const handleNursingNotesSubmit = (values: any) => {
    const objectiveKey = concepts.OBJECTIVE_DATA;
    const investigationsKey = concepts.BEDSIDE_INVESTIGATIONS;

    if (values.objective) {
      values[objectiveKey] = values.objective;
      delete values.objective;
    }

    if (values.investigations) {
      values[investigationsKey] = values.investigations;
      delete values.investigations;
    }

    createNursingNotes({
      encounterType: encounters.NURSING_NOTES,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: dateTime,
      obs: getObservations(values, dateTime),
    });
    navigateBack();
  };

  const handleSkip = () => {
    switch (activeStep) {
      case 0:
        setActiveStep(1);
        return;
      case 1:
        setActiveStep(2);
        return;
      case 2:
        setActiveStep(3);
        return;
      case 3:
        navigateBack();
        return;
      default:
        return;
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
          severity={alertSeverity||"success"}
          onClose={() => setAlertMessage(null)}
          style={{opacity: 0.8}}
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
        />
        <InterventionsForm
          onSubmit={handleInterventionsSubmit}
          onSkip={handleSkip}
        />
        <MedicationsForm
          onSubmit={handleMedicationsSubmit}
          onSkip={handleSkip}
        />
        <NursingNotesForm
          onSubmit={handleNursingNotesSubmit}
          onSkip={handleSkip}
        />
      </NewStepperContainer>
    </>
  );
};
