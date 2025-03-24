import {
  FormFieldContainerMultiple,
  FormikInit,
  FormValuesListener,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import { NewAbdomenImage } from "@/components/svgImages";
import { NewAbdomenFemaleImage } from "@/components/svgImages/abdomenFemaleImage";
import { LungBackFemaleImage } from "@/components/svgImages/LungBackFemale";
import { LungBackMaleImage } from "@/components/svgImages/LungBackMale";
import { LungFrontFemaleImage } from "@/components/svgImages/LungFrontFemale";
import { LungFrontMaleImage } from "@/components/svgImages/LungFrontMale";
import { concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import { getActivePatientDetails } from "@/hooks";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";

const form = {
  general: {
    name: concepts.GENERAL,
    label: "General Impression",
  },
  systolic: {
    name: concepts.SYSTOLIC_BLOOD_PRESSURE,
    label: "Systolic",
  },
  diastolic: {
    name: concepts.DIASTOLIC_BLOOD_PRESSURE,
    label: "Diastolic",
  },
  pulseRate: {
    name: concepts.PULSE_RATE,
    label: "Pulse Rate",
  },
  respiratoryRate: {
    name: concepts.PULSE_RATE,
    label: "Pulse Rate",
  },
  temperature: {
    name: concepts.TEMPERATURE,
    label: "Temperature",
  },
  pupilSymmetrical: {
    name: concepts.PUPIL_SYMMETRICAL,
    label: "Pupils symmetrical ",
  },
  conjunctiva: {
    name: concepts.CONJUNCTIVA,
    label: "Conjunctiva ",
  },
  oralKs: {
    name: concepts.ORAL_KS,
    label: "Oral KS",
  },
  oralThrush: {
    name: concepts.ORAL_THRUSH,
    label: "Oral thrush",
  },
  jvpRaised: {
    name: concepts.JVP_RAISED,
    label: "JVP raised",
  },
  lymphadenopathy: {
    name: concepts.LYMPHADENOPATHY,
    label: "Lymphadenopathy",
  },
  trachea: {
    name: concepts.TRACHEA_DEVIATED,
    label: "Trachea",
  },
  symmetricalExpansion: {
    name: concepts.SYMMETRICAL_EXPANSION,
    label: "Symmetrical expansion",
  },
  apexBeat: {
    name: concepts.APEX_BEAT,
    label: "Apex Beat",
  },
  position: {
    name: concepts.POSITIONING,
    label: "Position",
  },
  thrillHeaves: {
    name: concepts.THRILL_HEAVES,
    label: "Thrill heaves",
  },
  specify: {
    name: concepts.SPECIFY,
    label: "Specify",
  },
  auscultations: {
    name: concepts.SPECIFY,
    label: "Auscultations",
  },
  other: {
    name: concepts.OTHER,
    label: "Other",
  },
  oedema: {
    name: concepts.OEDEMA,
    label: "Oedema",
  },
  rash: {
    name: concepts.RASH,
    label: "Rash",
  },
  herpes: {
    name: concepts.HERPES_ZOSTER_SCAR,
    label: "Herpes zoster scar",
  },
  neckStiffness: {
    name: concepts.NECK_STIFFNESS,
    label: "Neck Stiffness",
  },
  motorResponse: {
    name: concepts.MOTOR_RESPONSE,
    label: "Motor Response",
  },
  verbalResponse: {
    name: concepts.VERBAL_RESPONSE,
    label: "Verbal Response",
  },
  eyeOpeningResponse: {
    name: concepts.EYE_OPENING_RESPONSE,
    label: "Eye Opening Response",
  },
  summary: {
    name: concepts.SUMMARY,
    label: "Summary",
  },
};

const schema = Yup.object().shape({
  [form.general.name]: Yup.string().label(form.general.label).required(),
  [form.systolic.name]: Yup.string().label(form.systolic.label).required(),
  [form.diastolic.name]: Yup.string().label(form.diastolic.label).required(),
  [form.pulseRate.name]: Yup.string().label(form.pulseRate.label).required(),
  [form.temperature.name]: Yup.string()
    .label(form.temperature.label)
    .required(),
  [form.pupilSymmetrical.name]: Yup.string()
    .label(form.pupilSymmetrical.label)
    .required(),
  [form.conjunctiva.name]: Yup.string()
    .label(form.conjunctiva.label)
    .required(),
  [form.oralKs.name]: Yup.string().label(form.oralKs.label).required(),
  [form.oralThrush.name]: Yup.string().label(form.oralThrush.label).required(),
  [form.jvpRaised.name]: Yup.string().label(form.jvpRaised.label).required(),
  [form.trachea.name]: Yup.string().label(form.trachea.label).required(),
  [form.other.name]: Yup.string().label(form.other.label).required(),
  [form.symmetricalExpansion.name]: Yup.string()
    .label(form.symmetricalExpansion.label)
    .required(),
  [form.apexBeat.name]: Yup.string().label(form.apexBeat.label).required(),
  [form.oedema.name]: Yup.string().label(form.oedema.label).required(),
  [form.rash.name]: Yup.string().label(form.rash.label).required(),
  [form.herpes.name]: Yup.string().label(form.herpes.label).required(),
  [form.neckStiffness.name]: Yup.string()
    .label(form.neckStiffness.label)
    .required(),
  [form.motorResponse.name]: Yup.string().label(form.motorResponse.label),
  [form.verbalResponse.name]: Yup.string().label(form.verbalResponse.label),
  [form.eyeOpeningResponse.name]: Yup.string().label(
    form.eyeOpeningResponse.label
  ),
  [form.summary.name]: Yup.string().label(form.summary.label),
});
const initialValues = getInitialValues(form);

const yesNoOptions = [
  { value: concepts.YES, label: "YES" },
  { value: concepts.NO, label: "NO" },
];
const conjunctivaOptions = [
  { value: concepts.PALE, label: "Pale" },
  { value: concepts.PINK, label: "Pink" },
];
const tracheaOptions = [
  { value: concepts.ABSENT, label: "Absent" },
  { value: concepts.PRESENT, label: "Present" },
];
const apexBeatOptions = [
  { value: concepts.DISPLACED, label: "Displaced" },
  { value: concepts.NOT_DISPLACED, label: "Not Displaced" },
];
const thrillOptions = [
  { value: concepts.ABSENT, label: "Absent" },
  { value: concepts.PRESENT, label: "Present" },
];
const eyeOpeningResponses = [
  { label: "Spontaneous", value: "Spontaneous", weight: 4 },
  { label: "To Speech", value: "To Speech", weight: 3 },
  { label: "To Pain", value: "To Pain", weight: 2 },
  { label: "No Response", value: "No Response", weight: 1 },
];
const motorResponses = [
  { label: "Obeying Commands", value: "Obeying Commands", weight: 6 },
  { label: "Localising", value: "Localising", weight: 5 },
  { label: "Withdraw", value: "Withdraw", weight: 4 },
  { label: "Normal Flexion", value: "Normal Flexion", weight: 3 },
  { label: "Extension", value: "Extension", weight: 2 },
  { label: "None", value: "None", weight: 1 },
];
const verbalResponses = [
  { label: "Oriented", value: "Oriented", weight: 5 },
  { label: "Confused", value: "Confused", weight: 4 },
  { label: "Inappropriate Words", value: "Inappropriate Words", weight: 3 },
  {
    label: "Incomprehensible sounds",
    value: "Incomprehensible sounds",
    weight: 2,
  },
  { label: "None", value: "None", weight: 1 },
];

export const ReviewOfSystems = () => {
  const [formValues, setFormValues] = useState<any>({});
  const { gender } = getActivePatientDetails();
  const [percussionImageEnc, setPercussionImagesEnc] = useState({});

  const getWeight = (value: string, lists: any) => {
    const found = lists.find((l: any) => l.value == value);
    return found ? found.weight : 0;
  };

  const m = getWeight(formValues[form.motorResponse.name], motorResponses);
  const v = getWeight(formValues[form.verbalResponse.name], verbalResponses);
  const e = getWeight(
    formValues[form.eyeOpeningResponse.name],
    eyeOpeningResponses
  );

  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={() => {}}
    >
      <FormValuesListener getValues={setFormValues} />
      <TextInputField
        multiline
        rows={5}
        name={form.general.name}
        label={form.general.label}
        id={form.general.name}
        sx={{ width: "100%" }}
      />
      <br />
      <Typography variant="h5">Vitals</Typography>
      <FormFieldContainerMultiple>
        <TextInputField
          name={form.diastolic.name}
          label={form.diastolic.label}
          id={form.diastolic.name}
        />
        <TextInputField
          name={form.systolic.name}
          label={form.systolic.label}
          id={form.systolic.name}
        />
      </FormFieldContainerMultiple>
      <FormFieldContainerMultiple>
        <TextInputField
          name={form.pulseRate.name}
          label={form.pulseRate.label}
          id={form.pulseRate.name}
        />
        <TextInputField
          name={form.respiratoryRate.name}
          label={form.respiratoryRate.label}
          id={form.respiratoryRate.name}
        />
      </FormFieldContainerMultiple>
      <TextInputField
        name={form.temperature.name}
        label={form.temperature.label}
        id={form.temperature.name}
        sx={{ width: "100%" }}
      />
      <br />
      <Typography variant="h5">Head and Neck</Typography>
      <FormFieldContainerMultiple>
        <RadioGroupInput
          name={form.pupilSymmetrical.name}
          label={form.pupilSymmetrical.label}
          options={yesNoOptions}
          row
        />
        <RadioGroupInput
          name={form.conjunctiva.name}
          label={form.conjunctiva.label}
          options={conjunctivaOptions}
          row
        />
        <RadioGroupInput
          name={form.oralKs.name}
          label={form.oralKs.label}
          options={yesNoOptions}
          row
        />
      </FormFieldContainerMultiple>
      <FormFieldContainerMultiple>
        <RadioGroupInput
          name={form.oralThrush.name}
          label={form.oralThrush.label}
          options={yesNoOptions}
          row
        />
        <RadioGroupInput
          name={form.jvpRaised.name}
          label={form.jvpRaised.label}
          options={yesNoOptions}
          row
        />
        <RadioGroupInput
          name={form.lymphadenopathy.name}
          label={form.lymphadenopathy.label}
          options={yesNoOptions}
          row
        />
      </FormFieldContainerMultiple>
      <RadioGroupInput
        name={form.trachea.name}
        label={form.trachea.label}
        options={tracheaOptions}
        row
      />
      <TextInputField
        multiline
        rows={5}
        sx={{ width: "100%" }}
        name={form.other.name}
        label={form.other.label}
        id={form.other.label}
      />
      <br />
      <Typography variant="h5">Chest</Typography>
      <RadioGroupInput
        name={form.symmetricalExpansion.name}
        label={form.symmetricalExpansion.label}
        row
        options={yesNoOptions}
      />
      <br />

      <Typography variant="h5">Heart</Typography>
      <RadioGroupInput
        name={form.apexBeat.name}
        label={form.apexBeat.label}
        row
        options={apexBeatOptions}
      />
      {formValues[form.apexBeat.name] == concepts.DISPLACED && (
        <TextInputField
          rows={5}
          multiline
          sx={{ width: "100%" }}
          name={form.position.name}
          label={form.position.label}
          id={form.position.name}
        />
      )}
      <RadioGroupInput
        name={form.thrillHeaves.name}
        label={form.thrillHeaves.label}
        row
        options={thrillOptions}
      />
      {formValues[form.thrillHeaves.name] == concepts.ABSENT && (
        <TextInputField
          rows={5}
          multiline
          sx={{ width: "100%" }}
          name={form.specify.name}
          label={form.specify.label}
          id={form.specify.name}
        />
      )}
      <br />
      <Typography variant="h5">Lungs</Typography>
      {gender == "Male" && (
        <FormFieldContainerMultiple>
          <LungFrontMaleImage
            onValueChange={setPercussionImagesEnc}
            form="percussion"
          />
          <LungBackMaleImage
            onValueChange={setPercussionImagesEnc}
            form="percussion"
          />
        </FormFieldContainerMultiple>
      )}
      {gender == "Female" && (
        <Box>
          <LungFrontFemaleImage
            onValueChange={setPercussionImagesEnc}
            form="percussion"
          />
          <LungBackFemaleImage
            onValueChange={setPercussionImagesEnc}
            form="percussion"
          />
        </Box>
      )}
      <TextInputField
        multiline
        rows={5}
        name={form.auscultations.name}
        label={form.auscultations.label}
        id={form.auscultations.name}
        sx={{ width: "100%" }}
      />

      <Typography variant="h5">Abdomen</Typography>
      {gender == "Male" && (
        <NewAbdomenImage
          onValueChange={setPercussionImagesEnc}
          formNameSection="secondaryAbdomen"
        />
      )}
      {gender == "Female" && (
        <NewAbdomenFemaleImage
          onValueChange={setPercussionImagesEnc}
          formNameSection="secondaryAbdomen"
        />
      )}
      <br />
      <Typography variant="h5">Extremities</Typography>
      <RadioGroupInput
        name={form.oedema.name}
        label={form.oedema.label}
        options={yesNoOptions}
        row
      />
      <br />
      <br />
      <Typography variant="h5">Skin</Typography>
      <FormFieldContainerMultiple>
        <RadioGroupInput
          name={form.rash.name}
          label={form.rash.label}
          options={yesNoOptions}
          row
        />
        <RadioGroupInput
          name={form.herpes.name}
          label={form.herpes.label}
          options={yesNoOptions}
          row
        />
      </FormFieldContainerMultiple>
      <br />
      <br />
      <Typography variant="h5">Neurological</Typography>
      <RadioGroupInput
        name={form.neckStiffness.name}
        label={form.neckStiffness.label}
        options={yesNoOptions}
        row
      />
      <br />
      <br />
      <FormFieldContainerMultiple>
        <RadioGroupInput
          name={form.motorResponse.name}
          label={form.motorResponse.label}
          options={motorResponses}
          row={false}
        />
        <RadioGroupInput
          name={form.verbalResponse.name}
          label={form.verbalResponse.label}
          options={verbalResponses}
          row={false}
        />
        <RadioGroupInput
          name={form.eyeOpeningResponse.name}
          label={form.eyeOpeningResponse.label}
          options={eyeOpeningResponses}
        />
      </FormFieldContainerMultiple>
      <Typography fontWeight={"800"} variant="body2">
        ({v}V {e} E {m} M ) {m + v + e}/15
      </Typography>
      <Typography>Cranial nerves</Typography>
      <Typography>Peripherals nerves</Typography>
      <TextInputField
        name={form.summary.name}
        id={form.summary.name}
        label={form.summary.label}
        multiline
        rows={5}
        sx={{ width: "100%" }}
      />
    </FormikInit>
  );
};
