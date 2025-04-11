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
import { Box, Typography } from "@mui/material";
import { NO, YES, concepts, encounters } from "@/constants";
import {
  getInitialValues,
  getObservations,
  mapSubmissionToCodedArray,
} from "@/helpers";
import { useSubmitEncounter } from "@/hooks/useSubmitEncounter";
import { getDateTime } from "@/helpers/dateTime";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { CheckBoxNext } from "@/components/form/checkBoxNext";
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

  // reactionToLight: {
  //   name: concepts.PUPIL_SIZE_AND_REACTION_TO_LIGHT,
  //   label: "Pupil Size and Reaction To Light",
  // },
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
  },
  leftPupilSize: {
    name: "Left Pupil Size",
    label: "Left Pupil Size",
  },
  rightPupilSize: {
    name: "Right Pupil Size",
    label: "Right Pupil Size",
  },
  leftPupilReaction: {
    name: "Left Pupil Reaction",
    label: "Left Pupil Reaction",
  },
  rightPupilReaction: {
    name: "Right Pupil Reaction",
    label: "Right Pupil Reaction",
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

  // [form.reactionToLight.name]: yup
  //   .string()
  //   .required()
  //   .label(form.reactionToLight.label),
  [form.focalNeurology.name]: yup
    .string()
    .required()
    .label(form.focalNeurology.label),
  [form.postureInfo.name]: yup
    .string()
    .required()
    .label(form.postureInfo.label),
  [form.bloodGlocose.name]: yup
    .number()
    .min(0)
    .max(1000)
    .label(form.bloodGlocose.label),
  [form.seizureInfo.name]: yup
    .string()
    .required()
    .label(form.seizureInfo.label),
  [form.rightPupilReaction.name]: yup
    .string()
    .label(form.rightPupilReaction.label),
  [form.rightPupilSize.name]: yup.string().label(form.rightPupilSize.label),
  [form.leftPupilReaction.name]: yup
    .string()
    .label(form.leftPupilReaction.label),
  [form.leftPupilSize.name]: yup.string().label(form.leftPupilSize.label),
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
  const [isChecked, setIsChecked] = useState(false);
  const { handleSubmit, isLoading, isSuccess } = useSubmitEncounter(
    encounters.PRIMARY_DISABILITY_ASSESSMENT,
    onSubmit
  );

  const handleFormSubmit = (values: any) => {
    const obsDateTime = getDateTime();

    const eyes = [
      {
        concept: concepts.EYES,
        value: "Left Eye",
        obsDateTime: obsDateTime,
        groupMembers: [
          {
            concept: concepts.PUPIL_SIZE,
            value: values[form.leftPupilSize.name],
            obsDateTime: obsDateTime,
          },
          {
            concept: concepts.PUPIL_REACTION,
            value: values[form.leftPupilReaction.name],
            obsDateTime: obsDateTime,
          },
        ],
      },
      {
        concept: concepts.EYES,
        value: "Right Eye",
        obsDateTime: obsDateTime,
        groupMembers: [
          {
            concept: concepts.PUPIL_SIZE,
            value: values[form.rightPupilSize.name],
            obsDateTime: obsDateTime,
          },
          {
            concept: concepts.PUPIL_REACTION,
            value: values[form.rightPupilReaction.name],
            obsDateTime: obsDateTime,
          },
        ],
      },
    ];

    delete values[form.leftPupilSize.name];
    delete values[form.leftPupilReaction.name];
    delete values[form.rightPupilSize.name];
    delete values[form.rightPupilReaction.name];

    const obs = getObservations(values, obsDateTime);

    const obsWithEyes = [...obs, ...eyes];
    handleSubmit(obsWithEyes);
  };

  const totalSum =
    Number(eyeOpeningValue || 0) +
    Number(verbalResponseValue || 0) +
    Number(motorResponseValue || 0);

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      <CheckBoxNext
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        onNext={(obs: any) => handleSubmit(obs)}
        title="Tick if disability is normal and there are no abnormalities"
      />
      {!isChecked && (
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
            <Typography>Right Eye</Typography>
            <FieldsContainer mr="1ch">
              <TextInputField
                sx={{ m: 0, width: "100%" }}
                name={form.rightPupilSize.name}
                label={form.rightPupilSize.label}
                id={form.rightPupilSize.name}
                unitOfMeasure="mm"
              />
              <RadioGroupInput
                name={form.rightPupilReaction.name}
                label={form.rightPupilReaction.label}
                row
                options={radioOptions}
              />
            </FieldsContainer>
            <br />
            <Typography>Left Eye</Typography>
            <FieldsContainer mr="1ch">
              <TextInputField
                sx={{ m: 0, width: "100%" }}
                name={form.leftPupilSize.name}
                label={form.leftPupilSize.label}
                id={form.leftPupilSize.name}
                unitOfMeasure="mm"
              />
              <RadioGroupInput
                name={form.leftPupilReaction.name}
                label={form.leftPupilReaction.label}
                row
                options={radioOptions}
              />
            </FieldsContainer>
            <br />
            <TextInputField
              name={form.focalNeurology.name}
              sx={{ m: 0, width: "100%" }}
              label={form.focalNeurology.label}
              rows={5}
              multiline
              id={form.focalNeurology.name}
            />
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
      )}
    </ContainerLoaderOverlay>
  );
};
