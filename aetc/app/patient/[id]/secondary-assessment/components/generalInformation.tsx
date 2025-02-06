"use client";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormValuesListener,
  FormikInit,
  TextInputField,
} from "@/components";
import * as yup from "yup";
import { concepts, encounters } from "@/constants";
import { useSubmitEncounter } from "@/hooks";
import { getInitialValues, getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
type Props = {
  onSubmit: () => void;
};
const form = {
  generalInformation: {
    name: concepts.ADDITIONAL_NOTES,
    label: "General Information",
  },
};

const schema = yup.object({
  [form.generalInformation.name]: yup
    .string()
    .required()
    .label(form.generalInformation.label),
});

const initialValues = getInitialValues(form);

export const GeneralInformation = ({ onSubmit }: Props) => {
  // const [formValues, setFormValues] = useState<any>({});
  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.GENERAL_INFORMATION_ASSESSMENT,
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
        submitButtonText="Next"
      >
        {/* <FormValuesListener getValues={setFormValues} /> */}

        <TextInputField
          sx={{ width: "100%" }}
          multiline
          rows={5}
          name={form.generalInformation.name}
          label={form.generalInformation.label}
          id={form.generalInformation.name}
        />
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
