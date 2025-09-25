"use client";
import {
  FormikInit,
  WrapperBox,
  FormFieldContainer,
  FormFieldContainerLayout,
  CheckboxesGroup,
  RadioGroupInput,
  TextInputField,
  FormValuesListener,
} from "@/components";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { concepts, encounters } from "@/constants";
import { useParameters } from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";
import { Visit } from "@/interfaces";
import { useServerTime } from "@/contexts/serverTimeContext";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

// List of past medical history conditions with concepts mapping
const pastMedicalHistoryOptions = [
  { value: concepts.HIV, label: "HIV" },
  { value: concepts.TUBERCULOSIS, label: "Tuberculosis (TB)" },
  {
    value: concepts.CHRONIC_OBSTRUCTIVE_PULMONARY_DISEASE,
    label: "Chronic Obstructive Pulmonary Disease (COPD)",
  },
  { value: concepts.DIABETES_MELLITUS, label: "Diabetes Mellitus" },
  { value: concepts.ASTHMA, label: "Asthma" },
  { value: concepts.EPILEPSY, label: "Epilepsy" },
  { value: concepts.PREVIOUS_STROKE, label: "Previous stroke" },
  { value: concepts.BLEEDING_DISORDERS, label: "Bleeding disorders" },
];

// Validation schema
const schema = yup.object().shape({
  pastMedicalHistory: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string().required(),
        value: yup.boolean().required(),
      })
    )
    .transform((value) =>
      Array.isArray(value)
        ? value.filter((item: any) => item.value === true)
        : []
    )
    .min(1, "Select at least one condition"),
});

export const PastMedicalHistoryForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const handleCheckboxChange = (values: any) => {
    const selected = values
      .filter((item: any) => item.value)
      .map((item: any) => item.key);
    setSelectedConditions(selected);
  };

  const { params } = useParameters();
  const { mutate: submitEncounter } = fetchConceptAndCreateEncounter();
  const [activeVisit, setActiveVisit] = useState<Visit | undefined>(undefined);
  const { data: patientVisits } = getPatientVisitTypes(params.id as string);
  const { init, ServerTime } = useServerTime();

  useEffect(() => {
    if (patientVisits) {
      const active = patientVisits.find((visit) => !visit.date_stopped);
      if (active) {
        setActiveVisit(active as unknown as Visit);
      }
    }
  }, [patientVisits]);

  // Watch for changes in form values
  useEffect(() => {
    if (formValues.pastMedicalHistory) {
      const selected = formValues.pastMedicalHistory
        .filter((item: any) => item.value)
        .map((item: any) => item.key);
      setSelectedConditions(selected);
    }
  }, [formValues.pastMedicalHistory]);

  const handleSubmit = async (values: any) => {
    const currentDateTime = ServerTime.getServerTimeString();

    // Extract the selected conditions
    const selectedConditions = (values.pastMedicalHistory || [])
      .filter((item: any) => item.value)
      .map((item: any) => item.key);

    // Construct observations for selected conditions
    const obs = selectedConditions.map((condition: string) => {
      const isOnTreatment = values.onTreatment[condition] === concepts.YES;

      return {
        concept: concepts.CONDITION,
        value: condition, // Use the condition UUID directly as the value
        obsDatetime: currentDateTime,
        groupMembers: [
          {
            concept: concepts.ON_TREATMENT,
            value: values.onTreatment[condition] || concepts.NO,
            obsDatetime: currentDateTime,
          },
          ...(isOnTreatment
            ? [
                {
                  concept: concepts.MEDICATION,
                  value:
                    values.medications?.[condition]?.currentMedication || "",
                  obsDatetime: currentDateTime,
                },
                {
                  concept: concepts.MEDICATION_DOSE,
                  value: values.medications?.[condition]?.dose || "",
                  obsDatetime: currentDateTime,
                },
                {
                  concept: concepts.REASON_FOR_REQUEST,
                  value: values.medications?.[condition]?.reason || "",
                  obsDatetime: currentDateTime,
                },
                {
                  concept: concepts.MEDICATION_DURATION,
                  value: values.medications?.[condition]?.duration || "",
                  obsDatetime: currentDateTime,
                },
              ]
            : []),
        ],
      };
    });

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
      console.log("Past Medical History submitted successfully!");
      onSubmit(values);
    } catch (error) {
      console.error("Error submitting Past Medical History: ", error);
    }
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{
        pastMedicalHistory: [],
        onTreatment: {},
        medications: {},
      }}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <FormFieldContainer direction="column">
          <FormValuesListener getValues={setFormValues} />
          <WrapperBox sx={{ bgcolor: "white", padding: "2ch", width: "100%" }}>
            <FormFieldContainerLayout title="Past Medical History">
              {pastMedicalHistoryOptions.map((condition) => (
                <div key={condition.value} style={{ marginBottom: "10px" }}>
                  {/* Checkbox for each condition */}
                  <CheckboxesGroup
                    name="pastMedicalHistory"
                    allowFilter={false}
                    options={[
                      { value: condition.value, label: condition.label },
                    ]}
                    getValue={(values) => {
                      // Update formik values with the checked state
                      const updatedValues =
                        formik.values.pastMedicalHistory.map((c: any) =>
                          c.key === condition.value
                            ? { key: c.key, value: values[0].value }
                            : c
                        );
                      handleCheckboxChange(updatedValues);
                    }}
                  />

                  {/* If the condition is selected, show treatment options */}
                  {selectedConditions.includes(condition.value) && (
                    <div style={{ marginLeft: "20px", marginTop: "5px" }}>
                      <RadioGroupInput
                        name={`onTreatment.${condition.value}`}
                        label={`Are you on treatment for ${condition.label}?`}
                        options={[
                          { value: concepts.YES, label: "Yes" },
                          { value: concepts.NO, label: "No" },
                        ]}
                        getValue={(value) =>
                          formik.setFieldValue(
                            `onTreatment.${condition.value}`,
                            value
                          )
                        }
                      />

                      {formik.values.onTreatment[condition.value] ===
                        concepts.YES && (
                        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                          <h5>Medication Details</h5>
                          <TextInputField
                            name={`medications.${condition.value}.currentMedication`}
                            label="Current Medication"
                            type="text"
                            id={`med-${condition.value}`}
                          />
                          <TextInputField
                            name={`medications.${condition.value}.dose`}
                            label="Dose"
                            type="text"
                            id={`dose-${condition.value}`}
                          />
                          <TextInputField
                            name={`medications.${condition.value}.reason`}
                            label="Reason for Taking"
                            type="text"
                            id={`reason-${condition.value}`}
                          />
                          <TextInputField
                            name={`medications.${condition.value}.duration`}
                            label="How long have you been taking it?"
                            type="text"
                            id={`duration-${condition.value}`}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </FormFieldContainerLayout>
          </WrapperBox>
        </FormFieldContainer>
      )}
    </FormikInit>
  );
};
