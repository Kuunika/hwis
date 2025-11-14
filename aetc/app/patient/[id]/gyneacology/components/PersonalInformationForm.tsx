"use client";
import React, { useState, useEffect } from "react";
import {
  FormikInit,
  WrapperBox,
  FormFieldContainer,
  FormFieldContainerLayout,
  TextInputField,
} from "@/components";

import * as Yup from "yup";
import { useServerTime } from "@/contexts/serverTimeContext";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { Visit } from "@/interfaces";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

//add concepts: address, traditional Authority, District, sero status, Next of kin(nok), contact,

//concepts available: PATIENT_EDUCATION, RELIGION, MARITAL_STATUS,  OCCUPATION , VDRL,  RELATIONSHIP_TO_PATIENT   IS_PATIENT_REFERRED ,  REFERRED_FROM ,  REASON_FOR_REQUEST
const validationSchema = Yup.object({});

export const PersonalInformationForm = ({ onSubmit, onSkip }: Prop) => {
  const { params } = useParameters();
  const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
  const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
  const { data: patientVisits } = getPatientVisitTypes(params.id as string);
   const { ServerTime } = useServerTime();

  useEffect(() => {
    if (patientVisits) {
      const active = patientVisits.find((visit) => !visit.date_stopped);
      if (active) {
        setActiveVisit(active as unknown as Visit);
      }
    }
  }, [patientVisits]);

  const handleSubmit = async (values: any) => {
   
    const currentDateTime = ServerTime.getServerTimeString();

    // Construct observations from all values (replace with actual concept mappings if needed)
    const obs = Object.entries(values).map(([key, value]) => ({
      concept: key, // You can replace this with actual concept codes e.g., concepts.EDUCATION_LEVEL
      value,
      obsDatetime: currentDateTime,
    }));

    const payload = {
      encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM, // Replace if you have a custom type
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: currentDateTime,
      obs,
    };

    try {
      await submitEncounter(payload);
      console.log("Personal Information submitted successfully!");
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting Personal Information:", error);
    }
  };

  return (
    <FormikInit
      initialValues={{
        educationLevel: "",
        address: "",
        ta: "",
        district: "",
        religion: "",
        maritalStatus: "",
        occupation: "",
        seroStatus: "",
        vdrl: "",
        nok: "",
        relationship: "",
        contact: "",
        referred: "",
        referralReason: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <FormFieldContainer direction="column">
        <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
          <FormFieldContainerLayout title="Personal Information">
            <TextInputField
              name="educationLevel"
              label="Education Level"
              type="text"
              id={""}
            />
            <TextInputField
              name="address"
              label="Address"
              type="text"
              id={""}
            />
            <TextInputField name="ta" label="T/A" type="text" id={""} />
            <TextInputField
              name="district"
              label="District"
              type="text"
              id={""}
            />
            <TextInputField
              name="religion"
              label="Religion"
              type="text"
              id={""}
            />
            <TextInputField
              name="maritalStatus"
              label="Marital Status"
              type="text"
              id={""}
            />
            <TextInputField
              name="occupation"
              label="Occupation"
              type="text"
              id={""}
            />
            <TextInputField
              name="seroStatus"
              label="Sero Status"
              type="text"
              id={""}
            />
            <TextInputField name="vdrl" label="VDRL" type="text" id={""} />
            <TextInputField
              name="nok"
              label="Next of Kin"
              type="text"
              id={""}
            />
            <TextInputField
              name="relationship"
              label="Relationship"
              type="text"
              id={""}
            />
            <TextInputField
              name="contact"
              label="Contact"
              type="text"
              id={""}
            />
            <TextInputField
              name="referred"
              label="Referred"
              type="text"
              id={""}
            />
            <TextInputField
              name="referralReason"
              label="Reason for Referral"
              type="text"
              id={""}
            />
          </FormFieldContainerLayout>
        </WrapperBox>
      </FormFieldContainer>
    </FormikInit>
  );
};
