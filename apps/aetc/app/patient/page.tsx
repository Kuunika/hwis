"use client";
import { MainGrid, NavigationBar, WrapperBox } from "shared-ui/src";
import {
  AllergiesCard,
  PersonalDetailsCard,
  TemplateFormsCard,
} from "./components/cards";
import { VisitsBar } from "./components";

export default function PatientProfile() {
  return (
    <>
      <NavigationBar />
      <MainGrid container spacing={1} mt={"2ch"} ml={"9ch"}>
        <MainGrid item lg={2}>
          <PersonalDetailsCard />
          <br />
          <AllergiesCard />
          <br />
          <TemplateFormsCard />
        </MainGrid>
        <MainGrid item lg={7}>
          <VisitsBar />
        </MainGrid>
        <MainGrid item lg={2}></MainGrid>
      </MainGrid>
    </>
  );
}
