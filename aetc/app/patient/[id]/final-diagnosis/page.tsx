import { FormContainer, PatientInfoTab } from "@/components";
import React from "react";
import { concepts } from "@/constants";

import DiagnosisForm from "../consultation/components/diagnosisForm";


export default function FinalDiagnosis() {
    return <>
        <PatientInfoTab />
        <FormContainer>
            <DiagnosisForm conceptType={concepts.FINAL_DIAGNOSIS} />

        </FormContainer>
    </>
}