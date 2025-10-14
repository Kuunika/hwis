"use client";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  FormikInit,
  WrapperBox,
  FormFieldContainer,
  TextInputField,
  FormFieldContainerLayout,
  RadioGroupInput,
} from "@/components";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import {
  addEncounter,
  fetchConceptAndCreateEncounter,
} from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

// Validation schema
const schema = Yup.object().shape({
  doYouSmoke: Yup.string().required("Please select an option"),
  cigarettesPerDay: Yup.string().when("doYouSmoke", {
    is: "Yes",
    then: (schema) =>
      schema.required("Please enter how many you smoke per day"),
    otherwise: (schema) => schema.notRequired(),
  }),
  smokingHistory: Yup.string().when("doYouSmoke", {
    is: "No",
    then: (schema) =>
      schema.required("Please select if you quit or never smoked"),
    otherwise: (schema) => schema.notRequired(),
  }),
  alcoholIntake: Yup.string().required("Please enter daily alcohol intake"),
  recreationalDrugs: Yup.string().required(
    "Please select if you use recreational drugs"
  ),
});

// add:
//  cigarettes Per Day
// Smoking History
// Quit over a month ago
// Never smoked

//// encounter: SURGICAL_NOTES_TEMPLATE_FORM

//  concepts:  PATIENT_SMOKES, EXPECTED_DURATION,  PATIENT_DRINKS_ALCOHOL,
//new concepts: PATIENT_SMOKES,  ALCOHOL_INTAKE, RECREATIONAL_DRUG

export const SocialHistoryForm = ({ onSubmit, onSkip }: Prop) => {
  const [doYouSmoke, setDoYouSmoke] = useState<string>("");

  const { params } = useParameters();
  const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
  const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
  const { data: patientVisits } = getPatientVisitTypes(params.id as string);
  const { init, ServerTime } = useServerTime();

  useEffect(() => {
    // Finds the active visit for the patient from their visit history
    if (patientVisits) {
      const active = patientVisits.find((visit) => !visit.date_stopped);
      if (active) {
        setActiveVisit(active as unknown as Visit);
      }
    }
  }, [patientVisits]);

  const handleSubmit = async (values: any) => {
    const currentDateTime = ServerTime.getServerTimeString();

    // Construct observations for Social History
    const obs = [
      {
        concept: concepts.PATIENT_SMOKES,
        value: values.doYouSmoke,
        obsDatetime: currentDateTime,
        groupMembers:
          values.doYouSmoke === "Yes"
            ? [
                {
                  concept: concepts.EXPECTED_DURATION,
                  value: values.cigarettesPerDay,
                  obsDatetime: currentDateTime,
                },
              ]
            : [],
      },
      {
        concept: concepts.ALCOHOL_INTAKE,
        value: values.alcoholIntake,
        obsDatetime: currentDateTime,
      },
      {
        concept: concepts.RECREATIONAL_DRUG,
        value: values.recreationalDrugs,
        obsDatetime: currentDateTime,
      },
    ];

    // Construct the encounter payload
    const payload = {
      encounterType: encounters.SURGICAL_NOTES_TEMPLATE_FORM,
      visit: activeVisit?.uuid,
      patient: params.id,
      encounterDatetime: currentDateTime,
      obs,
    };

    try {
      await submitEncounter(payload);
      console.log("Social History submitted successfully!");
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting Social History: ", error);
    }
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{
        doYouSmoke: "",
        cigarettesPerDay: "",
        smokingHistory: "",
        alcoholIntake: "",
        recreationalDrugs: "",
      }}
      onSubmit={handleSubmit}
    >
      <FormFieldContainer direction="column">
        <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
          <FormFieldContainerLayout title="Social History">
            {/* Smoking */}
            <RadioGroupInput
              name="doYouSmoke"
              label="Do you smoke?"
              options={[
                { value: concepts.YES, label: "Yes" },
                { value: concepts.NO, label: "No" },
              ]}
              getValue={(value: string) => setDoYouSmoke(value)}
            />

            {/* Show text input for cigarettes per day if user smokes */}
            {doYouSmoke === "Yes" && (
              <TextInputField
                id="cigarettesPerDay"
                name="cigarettesPerDay"
                label="How many cigarettes per day?"
              />
            )}
            <br />

            {/* Show smoking history if user does not smoke */}
            {doYouSmoke === "No" && (
              <RadioGroupInput
                name="smokingHistory"
                label="If not, did you quit over a month ago or never smoked?"
                options={[
                  {
                    value: "Quit over a month ago",
                    label: "Quit over a month ago",
                  },
                  { value: "Never smoked", label: "Never smoked" },
                ]}
              />
            )}

            {/* Alcohol Intake */}
            <TextInputField
              id="alcoholIntake"
              sx={{ width: "100%" }}
              name="alcoholIntake"
              label="What is your daily alcohol intake?"
            />

            {/* Recreational Drugs */}
            <RadioGroupInput
              name="recreationalDrugs"
              label="Do you use recreational drugs?"
              options={[
                { value: concepts.YES, label: "Yes" },
                { value: concepts.NO, label: "No" },
              ]}
            />
          </FormFieldContainerLayout>
        </WrapperBox>
      </FormFieldContainer>
    </FormikInit>
  );
};
