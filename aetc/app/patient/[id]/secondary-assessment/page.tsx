import { FormContainer, PatientInfoTab } from "@/components";
import React from "react";
import { SecondaryAssessmentFlow } from "./components";


export default function SecondaryAssessment(){
    return <>
    <PatientInfoTab />
    <FormContainer>
       <SecondaryAssessmentFlow />
    </FormContainer>
    </>
}