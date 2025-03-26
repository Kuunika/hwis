import { FormContainer, PatientInfoTab } from "@/components";
import React from "react";
import SurgicalNotesTemplate from "./components/surgicalNotes";
import { SurgicalNotesFlow } from "./components/surgicalNotesFlow";


export default function SurgicalNotesAssessment() {
    return <>
        <PatientInfoTab />
        <FormContainer>
            <SurgicalNotesFlow />

            {/* <SurgicalNotesTemplate /> */}
        </FormContainer>
    </>
}