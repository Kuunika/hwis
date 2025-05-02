import { FormContainer, PatientInfoTab } from "@/components";
import React from "react";
import { GyneacologyFlow } from "./components/gyneacologyFlow";


export default function GyneacologyAssessment() {
    return <>
        <PatientInfoTab />
        <FormContainer>

            <GyneacologyFlow />

        </FormContainer>
    </>
}