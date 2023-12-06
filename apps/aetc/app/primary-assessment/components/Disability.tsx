import React, { useState } from "react";
import {
  FieldsContainer,
  FormFieldContainer,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
  WrapperBox,
} from "shared-ui/src";
import * as yup from "yup";
import { Box } from "@mui/material";
type Props = {
  onSubmit: (values: any) => void;
};
const form = {
  eyeOpening: {
    name: "eyeOpening",
    label: "Eye Opening Response",
  },
  verbalResponse: {
    name: "verbalResponse",
    label: "Best Verbal Response",
  },
  motorResponse: {
    name: "motorResponse",
    label: "Best Motor Response",
  },

  reactionToLight: {
    name: "reactionToLight",
    label: "Pupil Size and Reaction To Light",
  },
  focalNeurology: {
    name: "focalNeurology",
    label: "Focal Neurology",
  },
  postureInfo: {
    name: "postureInfo",
    label: "Posture",
  },
  bloodGlocose: {
    name: "bloodGlocose",
    label: "Patient’s Random Blood Glucose",
  },
  seizureInfo: {
    name: "seizureInfo",
    label: "Is the patient having Seizures",
  },
};

const schema = yup.object({
  [form.eyeOpening.name]: yup.string().required().label(form.eyeOpening.label),
  [form.verbalResponse.name]: yup
    .string()
    .required()
    .label(form.verbalResponse.label),
  [form.motorResponse.name]: yup
    .string()
    .required()
    .label(form.motorResponse.label),

  [form.reactionToLight.name]: yup
    .string()
    .required()
    .label(form.reactionToLight.label),
  [form.focalNeurology.name]: yup
    .string()
    .required()
    .label(form.focalNeurology.label),
  [form.postureInfo.name]: yup
    .string()
    .required()
    .label(form.postureInfo.label),
  [form.bloodGlocose.name]: yup
    .string()
    .required()
    .label(form.bloodGlocose.label),
  [form.seizureInfo.name]: yup
    .string()
    .required()
    .label(form.seizureInfo.label),
});

const initialValues = {
  eyeOpening: "",
  verbalResponse: "",
  motorResponse: "",
  totalScore: "",
  reactionToLight: "",
  focalNeurology: "",
  postureInfo: "",
  bloodGlocose: "",
  seizureInfo: "",
};
const sizeOfEyeOpeningResponse = [
  { label: "Spontaneously", value: "4" },
  { label: "To Speech", value: "3" },
  { label: "To Pain", value: "2" },
  { label: "No Response", value: "1" },
];

const sizeOfVerbalResponse = [
  {
    label: "Oriented To Time, Place and Person  ",
    value: "5",
  },
  { label: "Confused", value: "4" },
  { label: "Inappropriate Words", value: "3" },
  { label: "Incomprehensible Words", value: "2" },
  { label: "No Response", value: "1" },
];

const sizeOfMotorResponse = [
  { label: "Obey Commands", value: "6" },
  { label: "Moves to Localized Pain ", value: "5" },
  {
    label: "Flexion Withdrawal from Pain",
    value: "4",
  },
  {
    label: "Abnormal  Flexion (Decorticate)",
    value: "3",
  },
  {
    label: "Abnormal  Extension (Decerbrate)",
    value: "2",
  },
  {
    label: "No Response",
    value: "1",
  },
];

export const Disability = ({ onSubmit }: Props) => {
  const [eyeOpeningValue, setEyeOpeningValue] = useState();
  const [verbalResponseValue, setVerbalResponseValue] = useState();
  const [motorResponseValue, setMotorResponseValue] = useState();

  const totalSum =
    Number(eyeOpeningValue || 0) +
    Number(verbalResponseValue || 0) +
    Number(motorResponseValue || 0);

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.eyeOpening.name}
          label={form.eyeOpening.label}
          options={sizeOfEyeOpeningResponse}
          getValue={(value) => setEyeOpeningValue(value)}
        />
        <p>
          {form.eyeOpening.label}: {eyeOpeningValue}
        </p>
      </FieldsContainer>
      <br />
      <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.verbalResponse.name}
          label={form.verbalResponse.label}
          options={sizeOfVerbalResponse}
          getValue={(value) => setVerbalResponseValue(value)}
        />
        <p>
          {form.verbalResponse.label}: {verbalResponseValue}
        </p>
      </FieldsContainer>
      <br />
      <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.motorResponse.name}
          label={form.motorResponse.label}
          options={sizeOfMotorResponse}
          getValue={(value) => setMotorResponseValue(value)}
        />
        <p>
          {form.motorResponse.label}: {motorResponseValue}
        </p>
      </FieldsContainer>

      <br />
      <br />
      <Box>
        <MainTypography>Total Score: {totalSum}</MainTypography>
      </Box>

      <br />

      <TextInputField
        name={form.reactionToLight.name}
        label={form.reactionToLight.label}
        id={form.reactionToLight.name}
      />
      <TextInputField
        name={form.postureInfo.name}
        label={form.postureInfo.label}
        id={form.postureInfo.name}
      />
      <TextInputField
        name={form.bloodGlocose.name}
        label={form.bloodGlocose.label}
        id={form.bloodGlocose.name}
      />
      <TextInputField
        name={form.focalNeurology.name}
        label={form.focalNeurology.label}
        id={form.bloodGlocose.name}
      />
      <RadioGroupInput
        name={form.seizureInfo.name}
        label={form.seizureInfo.label}
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />
    </FormikInit>
  );
};
