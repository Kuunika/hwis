import { useConditions, useNavigation } from "@/hooks";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormValuesListener,
  FormikInit,
  RadioGroupInput,
} from "shared-ui/src";
import * as Yup from "yup";
import { TriageContainer } from ".";
import { getInitialValues, notify, successDialog } from "@/helpers";
import { NO, YES, concepts } from "@/constants";

const form = {
  activeSeizures: {
    name: concepts.ACTIVE_SEIZURES,
    label: "Active Seizures",
  },
  focalNeurological: {
    name: concepts.FOCAL_NEUROLOGICAL,
    label: "focal neurologic findings",
  },
  headache: {
    name: concepts.HEADACHE,
    label: "Headache",
  },
  weakness: {
    name: concepts.WEAKNESS,
    label: "Weakness",
  },
  confusion: {
    name: concepts.CONFUSION,
    label: "Confusion",
  },
  severePain: {
    name: concepts.SEVERE_PAIN,
    label: "Severe Pain",
  },
  moderatePain: {
    name: concepts.MODERATE_PAIN,
    label: "moderate pain or a reason to be seen in under four hours",
  },
};

type Prop = {
  onSubmit: (values: any) => void;
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

const initialsValues = getInitialValues(form);

const options = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];
export const PersistentPainForm = ({ onSubmit }: Prop) => {
  const { updateConditions, triageResult } = useConditions();
  const [formValues, setFormValues] = useState<any>({});
  const { navigateTo } = useNavigation();

  const disableField = (formField: string) => {
    return triageResult === "red" && !Boolean(formValues[formField]);
  };

  const handleTriageComplete = () => {
    notify("info", "Patient added to waiting assessments queue");
    navigateTo("/triage");
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={onSubmit}
    >
      {triageResult && (
        <>
          <TriageContainer
            onCompleteTriage={handleTriageComplete}
            result={triageResult}
            message={""}
          />
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
        <RadioGroupInput
          name={form.confusion.name}
          disabled={disableField(form.confusion.name)}
          label={form.confusion.label}
          options={options}
          getValue={(value) => updateConditions(form.confusion.name, value)}
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
