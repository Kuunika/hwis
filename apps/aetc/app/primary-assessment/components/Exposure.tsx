import { NotificationContainer } from "@/components";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormFieldContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
} from "shared-ui/src";
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
  additionalNotes: {
    name: "additionalNotes",
    label: "Additional Notes",
  },
};

const schema = yup.object({
  [form.temperatureInfo.name]: yup
    .number()
    .required()
    .min(25)
    .max(45)
    .label(form.temperatureInfo.label),
  [form.skinRashInfo.name]: yup
    .string()
    .required()
    .label(form.skinRashInfo.label),
  [form.rashDescription.name]: yup
    .string()
    .required()
    .label(form.rashDescription.label),
  [form.additionalNotes.name]: yup.string().label(form.additionalNotes.label),
});

const initialValues = {
  temperatureInfo: "",
  skinRashInfo: "",
  rashDescription: "",
};
export const Exposure = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState<any>({});

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="submit"
    >
      <FormValuesListener getValues={setFormValues} />

      <FormFieldContainerLayout last={true} title="Temperature and Rash">
        <FieldsContainer>
          <TextInputField
            sx={{ width: "100%" }}
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
        </FieldsContainer>
        {formValues[form.skinRashInfo.name] == "yes" && (
          <>
            <NotificationContainer
              message="(Diagram) location (Body part and exact site) pop up image to appear where the
            user selects the location"
            />

            <TextInputField
              name={form.rashDescription.name}
              label={form.rashDescription.label}
              id={form.rashDescription.name}
            />
          </>
        )}
        <TextInputField
          name={form.additionalNotes.name}
          label={form.additionalNotes.label}
          id={form.additionalNotes.name}
        />
      </FormFieldContainerLayout>
    </FormikInit>
  );
};
