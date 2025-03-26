import { BackButton, FormContainer, PatientInfoTab } from "@/components";
import React from "react";
import { concepts } from "@/constants";
import { TestAccordion } from "../consultation/components/testAccordion";

import DiagnosisForm from "../consultation/components/diagnosisForm";


export default function FinalDiagnosis() {
    return <>
        <PatientInfoTab />
        <FormContainer>
            <BackButton />

            <TestAccordion />

        </FormContainer>
    </>
}