import React, { useState } from 'react'
import { FormikInit, RadioGroupInput,TextInputField } from 'shared-ui/src';
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
  totalScore: {
    name: "totalScore",
    label: "Total Score",
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
  [form.verbalResponse.name]: yup.string().required().label(form.verbalResponse.label),
  [form.motorResponse.name]: yup.string().required().label(form.motorResponse.label),
  [form.totalScore.name]: yup.string().required().label(form.totalScore.label),
  [form.reactionToLight.name]: yup.string().required().label(form.reactionToLight.label),
  [form.focalNeurology.name]: yup.string().required().label(form.focalNeurology.label),
  [form.postureInfo.name]: yup.string().required().label(form.postureInfo.label),
  [form.bloodGlocose.name]: yup.string().required().label(form.bloodGlocose.label),
  [form.seizureInfo.name]: yup.string().required().label(form.seizureInfo.label),
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
  { label: "Spontaneously", value: "1" },
  { label: "To Speech", value: "2" },
  { label: "To Pain", value: "3" },
  { label: "No Response", value: "4"},
];

const sizeOfVerbalResponse = [
  {
    label: "Oriented To Time, Place and Person  ",
    value: "5",
  },
  { label: "Confused", value: "6" },
  { label: "Inappropriate Words", value: "7" },
  { label: "Incomprehensible Words", value: "8" },
  { label: "No Response", value: "9" },
];

const sizeOfMotorResponse = [
  { label: "Obey Commands", value: "10" },
  { label: "Moves to Localized Pain ", value: "11" },
  {
    label: "Flexion Withdrawal from Pain",
    value: "12",
  },
  {
    label: "Abnormal  Flexion (Decorticate)",
    value: "13",
  },
  {
    label: "Abnormal  Extension (Decerbrate)",
    value: "14",
  },
  {
    label: "No Response",
    value: "15",
  }
];
// const sizeOfScore = [
//   { label: "Best Response", value: "16" },
//   { label: "Comatose Client", value: "17" },
//   { label: "Totally Unresponsive", value: "18" },
// ];

const Disability = ({onSubmit}:Props) => {
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
      <RadioGroupInput
        name={form.eyeOpening.name}
        label={form.eyeOpening.label}
        options={sizeOfEyeOpeningResponse}
        getValue={(value) => setEyeOpeningValue(value)}
      />
      <RadioGroupInput
        name={form.verbalResponse.name}
        label={form.verbalResponse.label}
        options={sizeOfVerbalResponse}
        getValue={(value) => setVerbalResponseValue(value)}
      />
      <RadioGroupInput
        name={form.motorResponse.name}
        label={form.motorResponse.label}
        options={sizeOfMotorResponse}
        getValue={(value) => setMotorResponseValue(value)}
      />
      <RadioGroupInput
        name={form.seizureInfo.name}
        label={form.seizureInfo.label}
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />
      <Box>
        <p>{form.eyeOpening.label}: {eyeOpeningValue}</p>
        <p>{form.verbalResponse.label}: {verbalResponseValue}</p>
        <p>{form.motorResponse.label}: {motorResponseValue}</p><br/>
        <p>Total Score: {totalSum}</p>
      </Box>
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
    </FormikInit>
  );
}

export default Disability
