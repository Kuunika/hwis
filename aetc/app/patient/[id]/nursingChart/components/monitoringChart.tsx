"use client";;
import { useState } from "react";
import { NewStepperContainer } from "@/components";
import { ObservationsForm } from "./observations";
import { InterventionsForm } from "./interventions";

import { encounters } from "@/constants";
import { useNavigation, useParameters } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import { getDateTime } from "@/helpers/dateTime";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { getObservations } from "@/helpers";
import { useFormLoading } from "@/hooks/formLoading";


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
  const dateTime = getDateTime();

  const { data: patientVisits, isLoading, isSuccess } = getPatientVisitTypes(params?.id as string);
  const activeVisit = patientVisits?.find(d => !Boolean(d.date_stopped));

  const steps = [
    { id: 0, label: "Observations" },
    { id: 1, label: "Interventions" },
  ];


  const {
    mutate: createVitals,
    isSuccess: vitalsCreated,
    isPending: creatingVitals,
    isError: vitalsError,
  } = addEncounter();

  const handleObservationsSubmit = (values: any) => {
    createVitals({
        encounterType: encounters.VITALS,
        visit: activeVisit?.uuid,
        patient: params.id,
        encounterDatetime: dateTime,
        obs: getObservations(values, dateTime),
      });
      
      setActiveStep(1);
  };


  const handleInterventionsSubmit = (values: any) => {

  };


  return (
    <>
      <NewStepperContainer
        setActive={setActiveStep}
        title="Monitoring Chart"
        steps={steps}
        active={activeStep}
        onBack={() => navigateBack()}
      >
        <ObservationsForm onSubmit={handleObservationsSubmit} />
       <InterventionsForm onSubmit={handleInterventionsSubmit} />
      </NewStepperContainer>
    </>
  );
};


