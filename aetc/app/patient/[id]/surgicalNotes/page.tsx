import { FormContainer, PatientInfoTab } from "@/components";
import React from "react";
import SurgicalNotesTemplate from "./components/surgicalNotes";


export default function SurgicalNotesAssessment() {
    return <>
        <PatientInfoTab />
        <FormContainer>
            <SurgicalNotesTemplate />
        </FormContainer>
    </>
}

export function generateStaticParams() {
    return [];
  }