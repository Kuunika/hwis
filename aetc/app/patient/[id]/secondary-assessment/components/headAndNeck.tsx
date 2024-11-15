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
type Props = {
  onSubmit: (values: any) => void;
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

  useEffect(() => {
    console.log({ headNeckImageEncounter });
  }, [headNeckImageEncounter]);

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="Next"
    >
      <FormValuesListener getValues={setFormValues} />
      <HeadNeckImage onValueChange={setHeadNeckImageEncounter} />
    </FormikInit>
  );
};
