import { useConditions } from "@/hooks";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormFieldContainer,
  FormValuesListener,
  FormikInit,
  RadioGroupInput,
} from "shared-ui/src";
import * as Yup from "yup";
import { TriageContainer } from ".";

const form = {
  activeSeizures: {
    name: "activeSeizures",
    label: "Active Seizures",
  },
  focalNeurological: {
    name: "focalNeurological",
    label: "focal neurologic findings",
  },
  headache: {
    name: "headache",
    label: "Headache",
  },
  weakness: {
    name: "weakness",
    label: "Weakness",
  },
  confusion: {
    name: "confusion",
    label: "Confusion",
  },
  severePain: {
    name: "severePain",
    label: "Severe Pain",
  },
  moderatePain: {
    name: "moderatePain",
    label: "moderate pain or a reason to be seen in under four hours",
  },
};

type Prop = {
  onSubmit: () => void;
};

const schema = Yup.object().shape({
  [form.activeSeizures.name]: Yup.string()
    .required()
    .label(form.activeSeizures.label),
  [form.confusion.name]: Yup.string().required().label(form.confusion.label),
  [form.headache.name]: Yup.string().required().label(form.headache.label),
  [form.moderatePain.name]: Yup.string()
    .required()
    .label(form.moderatePain.label),
  [form.severePain.name]: Yup.string().required().label(form.severePain.label),
  [form.weakness.name]: Yup.string().required().label(form.weakness.label),
  [form.focalNeurological.name]: Yup.string()
    .required()
    .label(form.focalNeurological.label),
});

const initialsValues = {
  concern: "",
  moderate: "",
};

const options = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];
export const PersistentPainForm = ({ onSubmit }: Prop) => {
  const { updateConditions, triageResult } = useConditions();
  const [formValues, setFormValues] = useState<any>({});

  const disableField = (formField: string) => {
    return triageResult === "red" && !Boolean(formValues[formField]);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={onSubmit}
    >
      {triageResult && (
        <>
          <TriageContainer result={triageResult} message={""} />
          <br />
        </>
      )}
      <FormValuesListener getValues={setFormValues} />
      <FieldsContainer>
        <RadioGroupInput
          name={form.activeSeizures.name}
          label={form.activeSeizures.label}
          options={options}
          disabled={disableField(form.activeSeizures.name)}
          getValue={(value) =>
            updateConditions(form.activeSeizures.name, value)
          }
        />
        <RadioGroupInput
          name={form.focalNeurological.name}
          label={form.focalNeurological.label}
          options={options}
          disabled={disableField(form.focalNeurological.name)}
          getValue={(value) =>
            updateConditions(form.focalNeurological.name, value)
          }
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.headache.name}
          disabled={disableField(form.headache.name)}
          label={form.headache.label}
          options={options}
          getValue={(value) => updateConditions(form.headache.name, value)}
        />
        <RadioGroupInput
          name={form.weakness.name}
          disabled={disableField(form.weakness.name)}
          label={form.weakness.label}
          options={options}
          getValue={(value) => updateConditions(form.weakness.name, value)}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.severePain.name}
          disabled={disableField(form.severePain.name)}
          label={form.severePain.label}
          options={options}
          getValue={(value) => updateConditions(form.severePain.name, value)}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          disabled={disableField(form.moderatePain.name)}
          name={form.moderatePain.name}
          label={form.moderatePain.label}
          options={options}
        />
      </FieldsContainer>
    </FormikInit>
  );
};
