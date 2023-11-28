import { Box } from "@mui/material";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormikInit,
  MainButton,
  RadioGroupInput,
  TextInputField,
} from "shared-ui/src";
import * as Yup from "yup";
import { TriageContainer } from ".";
import { useConditions } from "@/hooks";

type Prop = {
  onSubmit: () => void;
};
const form = {
  consciousness: {
    name: "consciousness",
    label: "Does the patient have a reduced Level of consciousness",
  },

  bloodGlucose: {
    name: "bloodGlucose",
    label: "Blood Glucose",
  },
  gcs: {
    name: "gcs",
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
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const initialValues = {
  consciousness: "",
  glucose: "",
  gcs: "",
};
export const ConsciousnessForm = ({ onSubmit }: Prop) => {
  const [consciousness, setConsciousness] = useState();
  const { triageResult, setTriageResult } = useConditions();

  const checkGlucose = (value: string) => {};

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
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      {triageResult && (
        <>
          <TriageContainer result={triageResult} message={""} />
          <br />
        </>
      )}
      <RadioGroupInput
        name={form.consciousness.name}
        label={form.consciousness.label}
        options={options}
        getValue={(value) => setConsciousness(value)}
      />
      <br />

      {consciousness == "true" && (
        <>
          <FieldsContainer>
            <TextInputField
              name={form.bloodGlucose.name}
              label={form.bloodGlucose.label}
              id={form.bloodGlucose.name}
            />
            <TextInputField
              name={form.gcs.name}
              label={form.gcs.label}
              id={form.gcs.name}
              getValue={checkGcs}
            />
          </FieldsContainer>
        </>
      )}
    </FormikInit>
  );
};
