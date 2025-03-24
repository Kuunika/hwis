import {
  FormFieldContainerMultiple,
  FormikInit,
  TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import { Typography } from "@mui/material";
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
});
const initialValues = getInitialValues(form);

export const ReviewOfSystems = () => {
  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={() => {}}
    >
      <TextInputField
        multiline
        rows={5}
        name={form.general.name}
        label={form.general.label}
        id={form.general.name}
        sx={{ width: "100%" }}
      />
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
    </FormikInit>
  );
};
