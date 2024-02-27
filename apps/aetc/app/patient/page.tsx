"use client";
import { MainGrid, MainPaper, NavigationBar, WrapperBox } from "shared-ui/src";
import {
  AllergiesCard,
  ConsultationCard,
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
import { DesktopView, TabletView } from "./components/profile";

export default function PatientProfile() {
  return (
    <>
      <DesktopView />
      <TabletView />
    </>
  );
}
