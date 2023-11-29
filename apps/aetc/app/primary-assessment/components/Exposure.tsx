import React, { useState } from "react";
import { FormikInit, RadioGroupInput, TextInputField } from "shared-ui/src";
import * as yup from "yup";
type Props = {
  onSubmit: (values: any) => void;
};
const form = {
  temperatureInfo: {
    name: "temperatureInfo",
    label: "Temperature",
  },
  skinRashInfo: {
    name: "skinRashInfo",
    label: "Does the patient has skin rash",
  },
  rashDescription: {
    name: "rashDescription",
    label: "Describe the skin rash",
  },
};

const schema = yup.object({
  [form.temperatureInfo.name]: yup
    .string()
    .required()
    .label(form.temperatureInfo.label),
  [form.skinRashInfo.name]: yup
    .string()
    .required()
    .label(form.skinRashInfo.label),
  [form.rashDescription.name]: yup
    .string()
    .required()
    .label(form.rashDescription.label),
});

const initialValues = {
  temperatureInfo: "",
  skinRashInfo: "",
  rashDescription: "",
};
export const Exposure = ({ onSubmit }: Props) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <TextInputField
        name={form.temperatureInfo.name}
        label={form.temperatureInfo.label}
        id={form.temperatureInfo.name}
      />
      <RadioGroupInput
        name={form.skinRashInfo.name}
        label={form.skinRashInfo.label}
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />
      <RadioGroupInput
        name={form.rashDescription.name}
        label={form.rashDescription.label}
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />
    </FormikInit>
  );
};
