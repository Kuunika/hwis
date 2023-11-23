"use client";
import { Box } from "@mui/material";
import React from "react";
import { FieldsContainer, FormikInit, RadioGroupInput } from "shared-ui/src";
import * as Yup from "yup";

const form = {
  airway: {
    name: "airway",
    label: "is Airway Compromised",
  },
  breathing: {
    name: "breathing",
    label: "is Breathing Normal",
  },
};

const schema = Yup.object().shape({
  [form.airway.name]: Yup.string().required().label(form.airway.label),
  [form.breathing.name]: Yup.string().required().label(form.breathing.label),
});
const initialValues = {
  airway: "",
  breathing: "",
};

type Prop = {
  onSubmit: () => void;
};

export const AirwayAndBreathingForm = ({ onSubmit }: Prop) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <FieldsContainer sx={{ width: "100%" }}>
        <RadioGroupInput
          name={form.airway.name}
          label={form.airway.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <RadioGroupInput
          name={form.breathing.name}
          label={form.breathing.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <br />
    </FormikInit>
  );
};
