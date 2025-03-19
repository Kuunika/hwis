"use client";
import { NotificationContainer } from "@/components";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormValuesListener,
  FormikInit,
  TextInputField,
} from "@/components";
import * as yup from "yup";
import { getInitialValues, getObservations } from "@/helpers";
import { concepts, encounters } from "@/constants";
import { useSubmitEncounter } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
type Props = {
  onSubmit: () => void;
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
  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT,
    onSubmit
  );
  const handleSubmitForm = async (values: any) => {
    await handleSubmit(getObservations(values, getDateTime()));
  };

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
        submitButtonText="submit"
      >
        <TextInputField
          multiline
          rows={5}
          sx={{ width: "100%" }}
          name={form.generalInformation.name}
          label={form.generalInformation.label}
          id={form.generalInformation.name}
        />
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
