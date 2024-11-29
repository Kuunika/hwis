"use client";
import { NotificationContainer } from "@/components";
import React, { useEffect, useState } from "react";
import {
  FieldsContainer,
  FormFieldContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import * as yup from "yup";

import { HeadNeckImage } from "@/components/svgImages";
import { useSubmitEncounter } from "@/hooks";
import { encounters } from "@/constants";
import { flattenImagesObs, getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
type Props = {
  onSubmit: () => void;
};
const form = {
  generalInformation: {
    name: "generalInformation",
    label: "General Information",
  },
};

const schema = yup.object({
  [form.generalInformation.name]: yup
    .string()
    .label(form.generalInformation.label),
});

const initialValues = {
  temperatureInfo: "",
  skinRashInfo: "",
  rashDescription: "",
};
export const HeadAndNeck = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState<any>({});
  const [headNeckImageEncounter, setHeadNeckImageEncounter] = useState<
    Array<any>
  >([]);
  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.HEAD_AND_NECK_ASSESSMENT,
    onSubmit
  );

  const handleSubmitForm = async (values: any) => {
    await handleSubmit(flattenImagesObs(headNeckImageEncounter));
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmitForm}
      submitButtonText="Next"
    >
      <FormValuesListener getValues={setFormValues} />
      <HeadNeckImage onValueChange={setHeadNeckImageEncounter} />
    </FormikInit>
  );
};
