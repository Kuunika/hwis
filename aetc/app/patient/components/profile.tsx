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
import { ListVisitDates } from "./listVisitDates";
import { VisitDatesProvider } from "@/contexts/visitDatesContext";

export const DesktopView = () => {
  const { params } = useParameters();
  const { isOnList } = checkPatientIfOnWaitingAssessment(params?.id as string);

  const { setActiveStep } = React.useContext(
    ConsultationContext
  ) as ConsultationContextType;

  return (
    <VisitDatesProvider>
      <MainGrid
        container
        style={{ justifyContent: "center", marginTop: "15px", gap: "15px" }}
      >
        <MainGrid item lg={2.2} sm={2.2}>
          <PersonalDetailsCard />
          <br />
          <ListVisitDates />
        </MainGrid>
        <MainGrid item lg={8.5} sm={8.5}>
          <VitalsPanel />
          <TabsContainer />
        </MainGrid>
      </MainGrid>
    </VisitDatesProvider>
  );
};
