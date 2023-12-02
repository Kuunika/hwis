"use client";
import { MainGrid, MainPaper, NavigationBar, WrapperBox } from "shared-ui/src";
import {
  AllergiesCard,
  PersonalDetailsCard,
  TemplateFormsCard,
} from "./components/cards";
import { VisitsBar } from "./components";
import {
  BasicAccordion,
  ClinicalNotes,
  Dispositions,
  Investigations,
  Medications,
  Results,
} from "./components/panels";

export default function PatientProfile() {
  return (
    <>
      <MainGrid container spacing={1} mt={"2ch"} ml={"9ch"}>
        <MainGrid item lg={2}>
          <PersonalDetailsCard />
          <br />
          <BasicAccordion />
        </MainGrid>
        <MainGrid item lg={8}>
          <MainPaper elevation={0} sx={{ pb: "5ch" }}>
            <VisitsBar />
            <WrapperBox mx={"2ch"}>
              <WrapperBox sx={{ display: "flex" }}>
                <ClinicalNotes />
                <Investigations />
              </WrapperBox>
              <WrapperBox sx={{ display: "flex" }}>
                <Medications />
                <Results />
                {/* <Dispositions /> */}
              </WrapperBox>
              {/* <WrapperBox>
              </WrapperBox> */}
            </WrapperBox>
          </MainPaper>
        </MainGrid>
        <MainGrid item lg={2}></MainGrid>
      </MainGrid>
    </>
  );
}
