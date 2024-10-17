'use client'
import { NotificationContainer } from "@/components";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormValuesListener,
  FormikInit,
  TextInputField,
} from "@/components";
import * as yup from "yup";
import { getInitialValues } from "@/helpers";
import { concepts } from "@/constants";
type Props = {
  onSubmit: (values: any) => void;
};
const form = {
  generalInformation: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Notes",
  },
};

const schema = yup.object({
  [form.generalInformation.name]: yup
    .string()
    .required()
    .label(form.generalInformation.label),
  
});

const initialValues = getInitialValues(form);

export const NeurologicalExamination = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState<any>({});
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="Next"
    >
      <FormValuesListener getValues={setFormValues} />
        <FieldsContainer>
          <TextInputField
            sx={{ width: "100%" }}
            name={form.generalInformation.name}
            label={form.generalInformation.label}
            id={form.generalInformation.name}
          />
          </FieldsContainer>
    </FormikInit>
  );
};
