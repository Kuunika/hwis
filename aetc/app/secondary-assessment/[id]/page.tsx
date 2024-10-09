import { FormContainer, PatientInfoTab } from "@/components";
import React from "react";
import { SecondaryAssessmentFlow } from "../components/secondaryAssessmentFlow";

export default function SecondaryAssessment(){
    return <>
    <PatientInfoTab />
    <FormContainer>
       <SecondaryAssessmentFlow />
    </FormContainer>
    </>
}