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
} from "@/components";
import * as yup from "yup";
import { FullBodyBackImage, FullBodyImage } from "@/components/svgImages";
import { concepts, encounters } from "@/constants";
import { getInitialValues } from "@/helpers";
import { Box } from "@mui/material";
type Props = {
  onSubmit: (values: any) => void;
};
const form = {
  temperatureInfo: {
    name: concepts.TEMPERATURE,
    label: "Temperature",
  },
  skinRashInfo: {
    name: concepts.SKIN_RASH,
    label: "Does the patient has skin rash",
  },
  additionalNotes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Other Abnormalities",
  },
  injuries: {
    name: concepts.INJURY,
    label: "Other Injuries",
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
  [form.abnormalities.name]: yup
    .string()
    .required()
    .label(form.abnormalities.label),
  [form.injuries.name]: yup.string().required().label(form.injuries.label),
  [form.additionalNotes.name]: yup.string().label(form.additionalNotes.label),
});

const initialValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: concepts.YES },
  { label: "No", value: concepts.NO },
];
export const Exposure = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState<any>({});
  const [skinRashInfoImage, setSkinRashInfoImage] = useState<Array<any>>([]);
  const [abnormalitiesImage, setAbnormalitiesImage] = useState<Array<any>>([]);
  const [injuriesImage, setInjuriesImage] = useState<Array<any>>([]);
  const [injuriesBackImage, setInjuriesBackImage] = useState<Array<any>>([]);

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="submit"
    >
      <FormValuesListener getValues={setFormValues} />

      <TextInputField
        sx={{ width: "100%" }}
        name={form.temperatureInfo.name}
        label={form.temperatureInfo.label}
        id={form.temperatureInfo.name}
      />

      <RadioGroupInput
        name={form.skinRashInfo.name}
        row
        label={form.skinRashInfo.label}
        options={radioOptions}
      />

      {formValues[form.skinRashInfo.name] == concepts.YES && (
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Box sx={{ borderRight: "solid 2px grey", pr: "2ch", mr: "2ch" }}>
            <FullBodyImage
              imageEncounter={encounters.EXPOSURE_ASSESSMENT}
              imageSection={form.skinRashInfo.name}
              onValueChange={setSkinRashInfoImage}
            />
          </Box>
          <Box>
            <FullBodyBackImage />
          </Box>
        </Box>
      )}

      <RadioGroupInput
        name={form.abnormalities.name}
        row
        label={form.abnormalities.label}
        options={radioOptions}
      />

      {formValues[form.abnormalities.name] == concepts.YES && (
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Box sx={{ borderRight: "solid 2px grey", pr: "2ch", mr: "2ch" }}>
            <FullBodyImage
              imageEncounter={encounters.EXPOSURE_ASSESSMENT}
              imageSection={form.abnormalities.name}
              onValueChange={setAbnormalitiesImage}
            />
          </Box>
          <Box>
            <FullBodyBackImage />
          </Box>
        </Box>
      )}

      <RadioGroupInput
        name={form.injuries.name}
        row
        label={form.injuries.label}
        options={radioOptions}
      />

      {formValues[form.injuries.name] == concepts.YES && (
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Box sx={{ borderRight: "solid 2px grey", pr: "2ch", mr: "2ch" }}>
            <FullBodyImage
              imageEncounter={encounters.EXPOSURE_ASSESSMENT}
              imageSection={form.injuries.name}
              onValueChange={setInjuriesImage}
            />
          </Box>
          <Box>
            <FullBodyBackImage
              imageEncounter={encounters.EXPOSURE_ASSESSMENT}
              imageSection={form.injuries.name}
              onValueChange={setInjuriesBackImage}
            />
          </Box>
        </Box>
      )}

      <TextInputField
        sx={{ width: "100%" }}
        name={form.additionalNotes.name}
        label={form.additionalNotes.label}
        id={form.additionalNotes.name}
      />
    </FormikInit>
  );
};
