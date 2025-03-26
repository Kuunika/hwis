import { BackButton, FormContainer, PatientInfoTab } from "@/components";
import React from "react";
import { concepts } from "@/constants";

import DiagnosisForm from "../consultation/components/diagnosisForm";


export default function DifferentialDiagnosis() {
    return <>
        <PatientInfoTab />
        <FormContainer>
            <BackButton />

            <DiagnosisForm conceptType={concepts.DIFFERENTIAL_DIAGNOSIS} />

        </FormContainer>
    </>
}