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
import { CheckBoxNext } from "@/components/form/checkBoxNext";
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
  const [isChecked, setIsChecked] = useState(false);
  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.NEUROLOGICAL_EXAMINATION_ASSESSMENT,
    onSubmit
  );
  const handleSubmitForm = async (values: any) => {
    await handleSubmit(getObservations(values, getDateTime()));
  };

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      <CheckBoxNext
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        onNext={(obs: any) => handleSubmit(obs)}
        title="Tick if circulation is normal and there are no abnormalities"
      />
      {!isChecked && (
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
      )}
    </ContainerLoaderOverlay>
  );
};
