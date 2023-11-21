import React from 'react'
import { FormikInit, RadioGroupInput, TextInputField } from 'shared-ui/src';
import * as yup from "yup";
import { formStyles } from '../../triage/src/components/forms/forms.styles';
import { Box } from "@mui/material";

type Props = {
  onSubmit: (values: any) => void;
};
const form = {
  temperatureInfo: {
    name: "temperature",
    label: "temperature value",
  },
  skinRashInfo: {
    name: "skinRash",
    label: "Does the patient has skin rash",
  },
  skinRashDescription: {
    name: "skinRash",
    label: "Describe the rash",
  },
};

const schema = yup.object({
  [form.temperatureInfo.name]: yup.string().required().label(form.temperatureInfo.label),
  [form.skinRashInfo.name]: yup.string().required().label(form.skinRashInfo.label),
  [form.skinRashDescription.name]: yup.string().required().label(form.skinRashDescription.label),
})
const initialValues = {
  temperatureInfo: "",
  skinRashInfo: "",
  skinRashDescription: "",
};
const Exposure = ({onSubmit}:Props) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
        <TextInp`utField
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
        <TextInputField
          name={form.skinRashDescription.name}
          label={form.skinRashDescription.label}
          id={form.skinRashDescription.name}
        />
    
    </FormikInit>
  );
}

export default Exposure
