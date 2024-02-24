import { Box } from "@mui/material";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainButton,
  RadioGroupInput,
  TextInputField,
} from "shared-ui/src";
import * as Yup from "yup";
import { TriageContainer } from ".";
import { useConditions, useNavigation } from "@/hooks";
import { getInitialValues, notify } from "@/helpers";
import { NO, YES, concepts } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
  setTriageResult:(triage:any)=>void
  triageResult:string,
  continueTriage:boolean
};
const form = {
  consciousness: {
    name: concepts.DOES_PATIENT_LOW_LEVEL_CONSCIOUSNESS,
    label: "Does the patient have a reduced Level of consciousness",
  },

  bloodGlucose: {
    name: concepts.BLOOD_GLUCOSE,
    label: "Blood Glucose",
  },
  gcs: {
    name: concepts.GCS,
    label: "GCS",
  },
};

const schema = Yup.object().shape({
  [form.consciousness.name]: Yup.string()
    .required()
    .label(form.consciousness.label),
  [form.bloodGlucose.name]: Yup.string().label(form.bloodGlucose.label),
  [form.gcs.name]: Yup.string().label(form.gcs.label),
});

const options = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

const initialValues = getInitialValues(form);

export const ConsciousnessForm = ({ onSubmit , triageResult, setTriageResult, continueTriage}: Prop) => {
  const [consciousness, setConsciousness] = useState();
  const [formValues, setFormValues] = useState<any>({});
  const checkGcs = (value: number) => {
    if (!value) {
      setTriageResult("");
      return;
    }

    if (value < 10) {
      setTriageResult("red");
    }

    if (value >= 10 && value <= 14) {
      setTriageResult("yellow");
    }
  };

  const disableField = (formField: string) => {
    return (triageResult === "red" && !Boolean(formValues[formField])) && !continueTriage;
  };



  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
    
      <FormValuesListener getValues={setFormValues} />

      <FormFieldContainerLayout
        last={consciousness != YES}
        title="Consciousness"
      >
        <RadioGroupInput
          name={form.consciousness.name}
          label={form.consciousness.label}
          options={options}
          getValue={(value) => setConsciousness(value)}
          disabled={disableField(form.consciousness.name)}
        />
      </FormFieldContainerLayout>

      {consciousness == YES && (
        <>
          <FormFieldContainerLayout last={true} title="Blood Glucose and GCS">
            <FieldsContainer>
              <TextInputField
                name={form.bloodGlucose.name}
                label={form.bloodGlucose.label}
                id={form.bloodGlucose.name}
                disabled={disableField(form.bloodGlucose.name)}
              />
              <TextInputField
                name={form.gcs.name}
                label={form.gcs.label}
                id={form.gcs.name}
                getValue={checkGcs}
                disabled={disableField(form.gcs.name)}
              />
            </FieldsContainer>
          </FormFieldContainerLayout>
        </>
      )}
    </FormikInit>
  );
};
