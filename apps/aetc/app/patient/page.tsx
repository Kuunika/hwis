"use client";
import { MainGrid, MainPaper, NavigationBar, WrapperBox } from "shared-ui/src";
import {
  AllergiesCard,
  PersonalDetailsCard,
  TemplateFormsCard,
} from "./components/cards";
import { VisitsBar } from "./components";
import {
  ClinicalNotes,
  Dispositions,
  Investigations,
  Medications,
  Results,
} from "./components/panels";

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
          <MainPaper elevation={0} sx={{ padding: "2ch", mt: "1ch" }}>
            <WrapperBox>
              <WrapperBox sx={{ display: "flex" }}>
                <ClinicalNotes />
                <Investigations />
              </WrapperBox>
              <WrapperBox sx={{ display: "flex" }}>
                <Medications />
                <Results />
                <Dispositions />
              </WrapperBox>
            </WrapperBox>
          </MainPaper>
        </MainGrid>
        <MainGrid item lg={2}></MainGrid>
      </MainGrid>
    </>
  );
}
