import React, { useState } from "react";
import {
  FieldsContainer,
  FormFieldContainer,
  FormFieldContainerLayout,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import * as yup from "yup";
import { Box } from "@mui/material";
import { NO, YES, concepts, encounters } from "@/constants";
import {
  getInitialValues,
  getObservations,
  mapSubmissionToCodedArray,
} from "@/helpers";
import { useSubmitEncounter } from "@/hooks/useSubmitEncounter";
import { getDateTime } from "@/helpers/dateTime";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
type Props = {
  onSubmit: () => void;
};
const form = {
  eyeOpening: {
    name: concepts.EYE_OPENING_RESPONSE,
    label: "Eye Opening Response",
  },
  verbalResponse: {
    name: concepts.VERBAL_RESPONSE,
    label: "Best Verbal Response",
  },
  motorResponse: {
    name: concepts.MOTOR_RESPONSE,
    label: "Best Motor Response",
  },

  reactionToLight: {
    name: concepts.PUPIL_SIZE_AND_REACTION_TO_LIGHT,
    label: "Pupil Size and Reaction To Light",
  },
  focalNeurology: {
    name: concepts.FOCAL_NEUROLOGY,
    label: "Focal Neurology",
  },
  postureInfo: {
    name: concepts.POSTURE,
    label: "Posture",
  },
  bloodGlocose: {
    name: concepts.BLOOD_GLUCOSE,
    label: "Patient’s Random Blood Glucose",
  },
  seizureInfo: {
    name: concepts.ACTIVE_SEIZURES,
    label: "Is the patient having Seizures",
    coded: true,
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
  [form.bloodGlocose.name]: yup.string().label(form.bloodGlocose.label),
  [form.seizureInfo.name]: yup
    .string()
    .required()
    .label(form.seizureInfo.label),
});

const initialValues = getInitialValues(form);
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
const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];
export const Disability = ({ onSubmit }: Props) => {
  const [eyeOpeningValue, setEyeOpeningValue] = useState();
  const [verbalResponseValue, setVerbalResponseValue] = useState();
  const [motorResponseValue, setMotorResponseValue] = useState();
  const { handleSubmit, isLoading, isSuccess } = useSubmitEncounter(
    encounters.DISABILITY_ASSESSMENT,
    onSubmit
  );

  const handleFormSubmit = (values: any) => {
    const obsDateTime = getDateTime();
    handleSubmit(mapSubmissionToCodedArray(form, values, obsDateTime));
  };

  const totalSum =
    Number(eyeOpeningValue || 0) +
    Number(verbalResponseValue || 0) +
    Number(motorResponseValue || 0);

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        submitButtonText="next"
      >
        <FormFieldContainerLayout title="GCS">
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
          <Box>
            <MainTypography>Total Score: {totalSum}</MainTypography>
          </Box>
        </FormFieldContainerLayout>

        <FormFieldContainerLayout title="Pupillary Response">
          <FieldsContainer mr="1ch">
            <TextInputField
              sx={{ m: 0, width: "100%" }}
              name={form.reactionToLight.name}
              label={form.reactionToLight.label}
              id={form.reactionToLight.name}
            />
            <TextInputField
              name={form.focalNeurology.name}
              sx={{ m: 0, width: "100%" }}
              label={form.focalNeurology.label}
              id={form.bloodGlocose.name}
            />
          </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout
          last={true}
          title="Additional findings and Glucose"
        >
          <FieldsContainer mr="1ch">
            <TextInputField
              sx={{ m: 0, width: "100%" }}
              name={form.postureInfo.name}
              label={form.postureInfo.label}
              id={form.postureInfo.name}
            />
            <TextInputField
              sx={{ m: 0, width: "100%" }}
              name={form.bloodGlocose.name}
              label={form.bloodGlocose.label}
              id={form.bloodGlocose.name}
            />
          </FieldsContainer>
          <FieldsContainer>
            <RadioGroupInput
              name={form.seizureInfo.name}
              label={form.seizureInfo.label}
              options={radioOptions}
            />
          </FieldsContainer>
        </FormFieldContainerLayout>
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
