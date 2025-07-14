"use client";
import {
  BackButton,
  FormContainer,
  PatientInfoTab,
  NextButton,
} from "@/components";
import React from "react";
import { concepts } from "@/constants";

import DiagnosisForm from "../consultation/components/diagnosisForm";
import { useParameters } from "@/hooks";

export default function DifferentialDiagnosis() {
  const { params } = useParameters();
  return (
    <>
      <PatientInfoTab />
      <FormContainer>
        <BackButton />
        <DiagnosisForm conceptType={concepts.DIFFERENTIAL_DIAGNOSIS} />
        <NextButton
          size="medium"
          sx={{ fontSize: "12px", mr: "1px", mt: "1ch", float: "right" }}
          title={"Proceed to Investigation"}
          url={`/patient/${params?.id}/investigations`}
        />
      </FormContainer>
    </>
  );
}
