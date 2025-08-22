import {
  FormFieldContainerLayout,
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
import { useServerTime } from "@/contexts/serverTimeContext";
import { flattenImagesObs, getInitialValues, getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import { getActivePatientDetails } from "@/hooks";
import { Box, Typography } from "@mui/material";
import { Form } from "formik";
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
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate",
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
    name: concepts.AUSCULTATION,
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
  pupil: {
    name: concepts.PUPIL,
    label: "Pupil",
  },

  visualFieldAcuity: {
    name: concepts.VISUAL_FIELD_ACUITY,
    label: "Visual Field Acuity",
  },
  eyeMovementsNystagmus: {
    name: concepts.EYE_MOVEMENTS_NYSTAGMUS,
    label: "Eye Movements/Nystagmus",
  },
  eyeMovementsSensation: {
    name: concepts.EYE_MOVEMENTS_SENSATION,
    label: "Eye Movements/Sensation",
  },
  hearing: {
    name: concepts.HEARING,
    label: "Hearing",
  },
  tongueMovementsTastes: {
    name: concepts.TONGUE_MOVEMENTS_TASTES,
    label: "Tongue Movement/Tastes",
  },
  coughGagReflex: {
    name: concepts.COUGH_GAG_REFLEX,
    label: "Cough Gag Reflex",
  },
  power: {
    name: concepts.POWER,
    label: "Power",
  },
  tone: {
    name: concepts.TONE,
    label: "Tone",
  },
  reflexes: {
    name: concepts.REFLEXES,
    label: "Reflexes",
  },
  plantars: {
    name: concepts.PLANTARS,
    label: "Plantars",
  },
  sensation: {
    name: concepts.SENSATION,
    label: "Sensation",
  },
  coordination: {
    name: concepts.COORDINATION,
    label: "Coordination",
  },
  gait: {
    name: concepts.GAIT,
    label: "Gait",
  },
  auscultationLung: {
    name: concepts.AUSCULTATION_LUNG,
    label: "Auscultation",
  },
};

const schema = Yup.object().shape({
  [form.general.name]: Yup.string().label(form.general.label).required(),
  [form.systolic.name]: Yup.number()
    .min(0)
    .max(300)
    .label(form.systolic.label)
    .required(),
  [form.diastolic.name]: Yup.number()
    .min(0)
    .max(300)
    .label(form.diastolic.label)
    .required(),
  [form.pulseRate.name]: Yup.string().label(form.pulseRate.label).required(),
  [form.respiratoryRate.name]: Yup.number()
    .min(0)
    .max(90)
    .label(form.respiratoryRate.label)
    .required(),
  [form.temperature.name]: Yup.number()
    .min(20)
    .max(45)
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
  [form.visualFieldAcuity.name]: Yup.string().label(
    form.visualFieldAcuity.label
  ),
  [form.eyeMovementsNystagmus.name]: Yup.string().label(
    form.eyeMovementsNystagmus.label
  ),
  [form.eyeMovementsSensation.name]: Yup.string().label(
    form.eyeMovementsSensation.label
  ),
  [form.hearing.name]: Yup.string().label(form.hearing.label),
  [form.tongueMovementsTastes.name]: Yup.string().label(
    form.tongueMovementsTastes.label
  ),
  [form.pupil.name]: Yup.string().label(form.pupil.label),
  [form.coughGagReflex.name]: Yup.string().label(form.coughGagReflex.label),
  [form.power.name]: Yup.string().label(form.power.label),
  [form.tone.name]: Yup.string().label(form.tone.label),
  [form.reflexes.name]: Yup.string().label(form.reflexes.label),
  [form.plantars.name]: Yup.string().label(form.plantars.label),
  [form.sensation.name]: Yup.string().label(form.sensation.label),
  [form.coordination.name]: Yup.string().label(form.coordination.label),
  [form.gait.name]: Yup.string().label(form.gait.label),
  [form.auscultations.name]: Yup.string().label(form.auscultations.label),
  [form.auscultationLung.name]: Yup.string().label(form.auscultationLung.label),
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

export const PhysicalExamination = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  const [formValues, setFormValues] = useState<any>({});
  const { gender } = getActivePatientDetails();
  const [percussionImageEnc, setPercussionImageEnc] = useState([]);
  const [abdomenImageEnc, setAbdomenImageEnc] = useState([]);
  const { ServerTime } = useServerTime();

  const [percussionPosteriorImageEnc, setPercussionPosteriorImagesEnc] = useState([]);

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

  const handleSubmit = (values: any) => {
    const formValues = { ...values }
    const obsDatetime = ServerTime.getServerTimeString();


    const obs = [
      {
        concept: concepts.SITE,
        values: 'Lung Anterior',
        groupMembers: flattenImagesObs(percussionImageEnc),
        obsDatetime
      },
      {
        concept: concepts.SITE,
        values: 'Lung Posterior',
        groupMembers: flattenImagesObs(percussionPosteriorImageEnc),
        obsDatetime
      },
      {
        concept: concepts.SITE,
        values: 'Abdomen',
        groupMembers: flattenImagesObs(abdomenImageEnc),
        obsDatetime
      }
    ]


    onSubmit([...getObservations(formValues, obsDatetime), ...obs])

  }

  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
      submitButtonText="next"
    >
      <FormValuesListener getValues={setFormValues} />
      <FormFieldContainerLayout title="General">
        <TextInputField
          multiline
          rows={5}
          name={form.general.name}
          label={form.general.label}
          id={form.general.name}
          sx={{ width: "100%" }}
        />
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Vitals">
        <FormFieldContainerMultiple>
          <TextInputField
            name={form.systolic.name}
            label={form.systolic.label}
            id={form.systolic.name}
            unitOfMeasure="mmHg"


          />
          <TextInputField
            name={form.diastolic.name}
            label={form.diastolic.label}
            id={form.diastolic.name}
            unitOfMeasure="mmHg"

          />

        </FormFieldContainerMultiple>
        <FormFieldContainerMultiple>
          <TextInputField
            name={form.pulseRate.name}
            label={form.pulseRate.label}
            id={form.pulseRate.name}
            unitOfMeasure="bpm"
          />
          <TextInputField
            name={form.respiratoryRate.name}
            label={form.respiratoryRate.label}
            id={form.respiratoryRate.name}
            unitOfMeasure="bs/m"
          />
        </FormFieldContainerMultiple>
        <TextInputField
          name={form.temperature.name}
          label={form.temperature.label}
          id={form.temperature.name}
          sx={{ width: "100%" }}
          unitOfMeasure="°C"
        />
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Head and Neck">
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
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Chest">
        <RadioGroupInput
          name={form.symmetricalExpansion.name}
          label={form.symmetricalExpansion.label}
          row
          options={yesNoOptions}
        />
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Heart">
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

        <TextInputField
          rows={5}
          multiline
          sx={{ width: "100%" }}
          name={form.auscultations.name}
          id={form.auscultations.name}
          label={form.auscultations.label}
        />
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Lungs">
        {gender == "Male" && (
          <FormFieldContainerMultiple>
            <LungFrontMaleImage
              onValueChange={setPercussionImageEnc}
              form="medicalInpatient"
            />
            <LungBackMaleImage
              onValueChange={setPercussionPosteriorImagesEnc}
              form="medicalInpatient"
            />
          </FormFieldContainerMultiple>
        )}
        {gender == "Female" && (
          <Box>
            <LungFrontFemaleImage
              onValueChange={setPercussionImageEnc}
              form="medicalInpatient"
            />
            <LungBackFemaleImage
              onValueChange={setPercussionPosteriorImagesEnc}
              form="medicalInpatient"
            />
          </Box>
        )}
        <TextInputField
          multiline
          rows={5}
          name={form.auscultationLung.name}
          label={form.auscultationLung.label}
          id={form.auscultationLung.name}
          sx={{ width: "100%" }}
        />
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Abdomen">
        {gender == "Male" && (
          <NewAbdomenImage
            onValueChange={setAbdomenImageEnc}
            formNameSection="medicalInPatient"
          />
        )}
        {gender == "Female" && (
          <NewAbdomenFemaleImage
            onValueChange={setAbdomenImageEnc}
            formNameSection="medicalInPatient"
          />
        )}
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Extremities">
        <RadioGroupInput
          name={form.oedema.name}
          label={form.oedema.label}
          options={yesNoOptions}
          row
        />
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Skin">
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
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Neurological">
        <RadioGroupInput
          name={form.neckStiffness.name}
          label={form.neckStiffness.label}
          options={yesNoOptions}
          row
        />
        <FormFieldContainerMultiple>
          <RadioGroupInput
            name={form.motorResponse.name}
            label={form.motorResponse.label}
            options={motorResponses}
            row={false}
          />
          <RadioGroupInput
            name={form.eyeOpeningResponse.name}
            label={form.eyeOpeningResponse.label}
            options={eyeOpeningResponses}
          />
        </FormFieldContainerMultiple>
        <RadioGroupInput
          name={form.verbalResponse.name}
          label={form.verbalResponse.label}
          options={verbalResponses}
          row={false}
        />
        <Typography fontWeight={"800"} variant="body2">
          ({v}V {e} E {m} M ) {m + v + e}/15
        </Typography>
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Cranial Nerves">
        <TextInputField
          multiline
          rows={5}
          name={form.pupil.name}
          label={form.pupil.label}
          id={form.pupil.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.visualFieldAcuity.name}
          label={form.visualFieldAcuity.label}
          id={form.visualFieldAcuity.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.eyeMovementsNystagmus.name}
          label={form.eyeMovementsNystagmus.label}
          id={form.eyeMovementsNystagmus.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.eyeMovementsSensation.name}
          label={form.eyeMovementsSensation.label}
          id={form.eyeMovementsSensation.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.hearing.name}
          label={form.hearing.label}
          id={form.hearing.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.tongueMovementsTastes.name}
          label={form.tongueMovementsTastes.label}
          id={form.tongueMovementsTastes.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.coughGagReflex.name}
          label={form.coughGagReflex.label}
          id={form.coughGagReflex.name}
          sx={{ width: "100%" }}
        />
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Peripherals nerves">
        <TextInputField
          multiline
          rows={5}
          name={form.power.name}
          label={form.power.label}
          id={form.power.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.tone.name}
          label={form.tone.label}
          id={form.tone.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.reflexes.name}
          label={form.reflexes.label}
          id={form.reflexes.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.plantars.name}
          label={form.plantars.label}
          id={form.plantars.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.sensation.name}
          label={form.sensation.label}
          id={form.sensation.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.coordination.name}
          label={form.coordination.label}
          id={form.coordination.name}
          sx={{ width: "100%" }}
        />
        <TextInputField
          multiline
          rows={5}
          name={form.gait.name}
          label={form.gait.label}
          id={form.gait.name}
          sx={{ width: "100%" }}
        />
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Summary">
        <TextInputField
          name={form.summary.name}
          id={form.summary.name}
          label={form.summary.label}
          multiline
          rows={5}
          sx={{ width: "100%" }}
        />
      </FormFieldContainerLayout>
    </FormikInit>
  );
};
