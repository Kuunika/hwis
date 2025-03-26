"use client";
import {
  BackButton,
  FormContainer,
  NextButton,
  PatientInfoTab,
} from "@/components";
import React from "react";
import { concepts } from "@/constants";

import DiagnosisForm from "../consultation/components/diagnosisForm";
import { useParameters } from "@/hooks";

export default function FinalDiagnosis() {
  const { params } = useParameters();
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <BackButton />

        <DiagnosisForm conceptType={concepts.FINAL_DIAGNOSIS} />
        <NextButton
          size="medium"
          sx={{ fontSize: "12px", mr: "1px", mt: "1ch", float: "right" }}
          title={"Proceed to Patient Management Plan"}
          url={`/patient/${params.id}/patient-management-plan`}
        />
      </FormContainer>
    </>
  );
}
