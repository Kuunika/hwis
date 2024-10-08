"use client";
import React from "react";
import { useState } from "react";
import { encounters } from "@/constants";
import { useNavigation } from "@/hooks";
import { addEncounter } from "@/hooks/encounter";
import { MedicalHistoryForm } from ".";

export const MedicalHistoryFlow = () => {

  const { mutate } = addEncounter();
  const { navigateTo, navigateBack } = useNavigation();

  

  const handleHistorySubmit = (values: any) => {
    mutate({ encounter: encounters.AIRWAY_ASSESSMENT, obs: values });

  };

  return (
    <>
        <MedicalHistoryForm onSubmit={handleHistorySubmit} />
    </>
  );
};
