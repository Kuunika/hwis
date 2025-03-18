"use client";
import { MainGrid, WrapperBox } from "@/components";
import { ConsultationCard, PersonalDetailsCard } from ".";

import React from "react";

import Image from "next/image";

import { VitalsPanel } from "./panels/vitalsDetails";

import { checkPatientIfOnWaitingAssessment, useParameters } from "@/hooks";

import FlowStarter from "./flowStarter";

import { ConsultationContext, ConsultationContextType } from "@/contexts";

import { TabsContainer } from "./tabsContainer";
import { Charts } from "./charts";

export const DesktopView = () => {
  const { params } = useParameters();
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string);

  const { setActiveStep } = React.useContext(
    ConsultationContext
  ) as ConsultationContextType;

  return (
    <MainGrid
      container
      style={{ justifyContent: "center", marginTop: "10px", gap: "10px" }}
    >
      <MainGrid item lg={2} sm={2}>
        <PersonalDetailsCard />
      </MainGrid>
      <MainGrid item lg={9} sm={9}>
        <VitalsPanel />
        <TabsContainer />
      </MainGrid>
    </MainGrid>
  );
};
