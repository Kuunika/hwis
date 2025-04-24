"use client";
import { MainGrid } from "@/components";
import { PersonalDetailsCard } from ".";

import React from "react";
import { VitalsPanel } from "./panels/vitalsDetails";

import { TabsContainer } from "./tabsContainer";

import { ListVisitDates } from "./listVisitDates";
import { VisitDatesProvider } from "@/contexts/visitDatesContext";

export const DesktopView = () => {
  return (
    <VisitDatesProvider>
      <MainGrid
        container
        style={{
          justifyContent: "center",
          marginTop: "15px",
          gap: "15px",
          margin: "5px",
          width: "unset",
        }}
      >
        <MainGrid item lg={2.2} sm={12}>
          <PersonalDetailsCard />
          <br />
          <ListVisitDates />
        </MainGrid>
        <MainGrid item lg={8.5} sm={12} style={{ minWidth: "300px" }}>
          <VitalsPanel />
          <TabsContainer />
        </MainGrid>
      </MainGrid>
    </VisitDatesProvider>
  );
};
