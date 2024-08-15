"use client";
import React from "react";
import { useState } from "react";
import { NewStepperContainer } from "@/components";
import { ObservationsForm } from "./observations";
import { InterventionsForm } from "./interventions";

import { encounters } from "@/constants";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";

export const MonitoringChart = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { mutate } = addEncounter();
  const { navigateTo, navigateBack } = useNavigation();

  const steps = [
    { id: 1, label: "Observations" },
    { id: 2, label: "Interventions" },
  ];

  const handleObservationsSubmit = (values: any) => {
    console.log(values);
  };
  const handleInterventionsSubmit = (values: any) => {

  };

  const handleCirculationSubmit = (values: any) => {
    mutate({ encounter: encounters.CIRCULATION_ASSESSMENT, obs: values });
    setActiveStep(3);
  };
  const handleDisabilitySubmit = (values: any) => {
    mutate({ encounter: encounters.DISABILITY_ASSESSMENT, obs: values });
    setActiveStep(4);
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
        <ObservationsForm onSubmit={handleObservationsSubmit}/>
        <InterventionsForm onSubmit={handleInterventionsSubmit}/>
      </NewStepperContainer >
    </>
  );
};
