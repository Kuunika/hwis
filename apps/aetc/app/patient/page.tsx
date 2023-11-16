"use client";
import { MainGrid, NavigationBar, WrapperBox } from "shared-ui/src";
import { AllergiesCard, PersonalDetailsCard } from "./components";

export default function PatientProfile() {
  return (
    <>
      <NavigationBar />
      <MainGrid container spacing={1} mt={"2ch"} ml={"9ch"}>
        <MainGrid item lg={2}>
          <PersonalDetailsCard />
          <br />
          <AllergiesCard />
        </MainGrid>
        <MainGrid item lg={6}></MainGrid>
        <MainGrid item lg={2}></MainGrid>
      </MainGrid>
    </>
  );
}
