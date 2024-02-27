import { Box } from "@mui/material";
import React, { useState } from "react";
import { SearchComboBox, FormikInit } from "shared-ui/src";
import * as Yup from "yup";

import { getInitialValues, notify } from "@/helpers";
import { NO, YES, concepts } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
};
const form = {
  complaints: {
    name: concepts.COMPLAINTS,
    label: " Complaints",
  },
};

const schema = Yup.object().shape({
  [form.complaints.name]: Yup.array().required().label(form.complaints.label),
});

const initialValues = getInitialValues(form);

const presentingComplaints = [
  { id: "headache", label: "headache" },
  { id: "nausea", label: "nausea" },
  { id: "abdominal pain", label: "abdominal pain" },
  { id: "fatigue", label: "fatigue" },
  { id: "fever", label: "fever" },
  { id: "cough", label: "cough" },
  { id: "shortness of breath", label: "shortness of breath" },
  { id: "chest pain", label: "chest pain" },
  { id: "joint pain", label: "joint pain" },
  { id: "muscle pain", label: "muscle pain" },
  { id: "dizziness", label: "dizziness" },
  { id: "vomiting", label: "vomiting" },
  { id: "diarrhea", label: "diarrhea" },
  { id: "sore throat", label: "sore throat" },
  { id: "runny nose", label: "runny nose" },
  { id: "rash", label: "rash" },
  { id: "swelling", label: "swelling" },
  { id: "numbness", label: "numbness" },
  { id: "tingling sensation", label: "tingling sensation" },
  { id: "difficulty swallowing", label: "difficulty swallowing" },
  { id: "vision changes", label: "vision changes" },
  { id: "hearing loss", label: "hearing loss" },
  { id: "confusion", label: "confusion" },
  { id: "memory loss", label: "memory loss" },
  { id: "loss of consciousness", label: "loss of consciousness" },
];

export const PresentingComplaintsForm = ({ onSubmit }: Prop) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <SearchComboBox
        name={form.complaints.name}
        label={form.complaints.label}
        options={presentingComplaints}
      />
    </FormikInit>
  );
};
