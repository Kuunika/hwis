import { useEffect, useState } from "react";

import {
  FieldsContainer,
  FormFieldContainer,
  FormikInit,
  MultlineInput,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "shared-ui/src";
import * as yup from "yup";
import { concepts, triageResult } from "@/constants";
import { TriageContainer } from "@/app/triage/components/";
import { TriageResult } from "@/interfaces";

const form = {
  complaints: {
    name: concepts.COMPLAINTS,
    label: " Complaints",
  },
  temperature: {
    name: concepts.TEMPERATURE,
    label: "Temperature",
  },
  pulseRate: {
    name: "pulseRate",
    label: "Pulse Rate",
  },
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory rate",
  },
  saturationRate: {
    name: concepts.SATURATION_RATE,
    label: "Saturation rate",
  },
  heartRate: {
    name: concepts.HEART_RATE,
    label: "Heart rate",
  },
  bloodPressure: {
    name: concepts.BLOOD_PRESSURE_SYSTOLIC,
    label: "Blood pressure Systolic",
  },
  bloodPressureDiastolic: {
    name: concepts.BLOOD_PRESSURE_DIASTOLIC,
    label: "Blood pressure Diastolic",
  },
  motorResponse: {
    name: concepts.MOTOR_RESPONSE,
    label: "Motor Response",
  },
  eyeOpeningResponse: {
    name: concepts.EYE_OPENING_RESPONSE,
    label: "Eye Opening Response",
  },
  verbalResponse: {
    name: concepts.VERBAL_RESPONSE,
    label: "Verbal Response",
  },

  calculatedGCS: {
    name: "calculatedGCS",
    label: "Calculated GCS",
  },

  glucose: {
    name: "b9cc75b2-8d80-11d8-abbb-0024217bb78e",
    label: "Glucose",
  },
  avpu: {
    name: "b9da6d98-8d80-11d8-abbb-0024217bb78e",
    label: "AVPU",
  },
};
type props = {
  initialValues: any;
  onSubmit: (values: any) => void;
};
const schema = yup.object({
  [form.complaints.name]: yup.string().required().label(form.complaints.label),
  [form.respiratoryRate.name]: yup
    .string()
    .required()
    .label(form.respiratoryRate.label),
  [form.saturationRate.name]: yup
    .string()
    .required()
    .label(form.saturationRate.label),
  [form.pulseRate.name]: yup.string().required().label(form.pulseRate.label),
  [form.bloodPressure.name]: yup
    .string()
    .required()
    .label(form.bloodPressure.label),
  [form.bloodPressureDiastolic.name]: yup
    .string()
    .required()
    .label(form.bloodPressureDiastolic.label),
  [form.heartRate.name]: yup.string().required().label(form.heartRate.label),
  [form.temperature.name]: yup
    .string()
    .required()
    .label(form.temperature.label),
  [form.eyeOpeningResponse.name]: yup
    .string()
    .required()
    .label(form.eyeOpeningResponse.label),
  [form.motorResponse.name]: yup
    .string()
    .required()
    .label(form.motorResponse.label),
  [form.verbalResponse.name]: yup
    .string()
    .required()
    .label(form.verbalResponse.label),
  [form.glucose.name]: yup.string().required().label(form.glucose.label),
  [form.avpu.name]: yup.string().required().label(form.avpu.label),
});

const eyeOpeningResponses = [
  { label: "To Speech", value: "To Speech" },
  { label: "To Pain", value: "To Pain" },
  { label: "No Response", value: "No Response" },
];
const motorResponses = [
  { label: "Obey", value: "Obey" },
  { label: "Localising", value: "Localising" },
  { label: "Extention", value: "Extention" },
  { label: "Normal Flexion", value: "Normal Flexion" },
  { label: "None", value: "None" },
];
const verbalResponses = [
  { label: "Confused", value: "Confused" },
  { label: "Oriented", value: "Oriented" },
  { label: "Words", value: "Words" },
  { label: "Sounds", value: "Sounds" },
  { label: "None", value: "None" },
];
const avpuLists = [
  { id: "Awake", label: "Awake" },
  { id: "Verbal", label: "Verbal" },
  { id: "Pain", label: "Pain" },
  { id: "Unresponsive", label: "Unresponsive" },
];

const rules = {
  [form.temperature.name]: [
    { operator: "<", value: 34, result: triageResult.RED, bound: 0 },
    {
      operator: "<",
      value: 35.5,
      result: triageResult.YELLOW,
      bound: 34,
    },
    { operator: ">", value: 40, result: triageResult.RED, bound: 100 },
    { operator: ">", value: 38, result: triageResult.YELLOW, bound: 40 },
    {
      operator: "combined",
      operator1: ">=",
      value: 35.5,
      operator2: "<=",
      value2: 37.4,
      result: triageResult.GREEN,
      bound: 0,
    },
  ],
  [form.pulseRate.name]: [
    {
      operator: ">",
      value: 110,
      result: triageResult.YELLOW,
      value2: 0,
      bound: 130,
    },
    { operator: "<", value: 50, result: triageResult.YELLOW, bound: 40 },
    { operator: "<", value: 40, result: triageResult.RED, bound: 0 },
    { operator: ">", value: 130, result: triageResult.RED, bound: 1000 },
    {
      operator: "combined",
      operator1: ">=",
      value: 60,
      operator2: "<=",
      value2: 100,
      result: triageResult.GREEN,
      bound: 0,
    },
  ],
};

export function VitalsForm({ initialValues, onSubmit }: props) {
  const [triageResult, setTriageResult] = useState<TriageResult>("");

  const checkTriage = (name: string, formValue: string) => {
    rules[name]?.forEach((rule) => {
      const formValueNumber = Number(formValue);
      switch (rule.operator) {
        case "<":
          if (formValueNumber < rule.value && formValueNumber >= rule.bound) {
            setTriageResult(rule.result as TriageResult);
          }
          return;
        case ">":
          if (formValueNumber > rule.value && formValueNumber <= rule.bound) {
            setTriageResult(rule.result as TriageResult);
          }
          return;
        case "combined":
          if (
            rule?.value2 &&
            formValueNumber >= rule.value &&
            formValueNumber <= rule.value2
          ) {
            setTriageResult(rule.result as TriageResult);
          }
          return;
        default:
          return null;
      }
    });
  };
  return (
    <FormikInit
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={initialValues}
      submitButtonText="next"
    >
      <h1>{triageResult}</h1>
      {triageResult && (
        <>
          <TriageContainer result={triageResult} message={"Interventions"} />
          <br />
        </>
      )}
      <MultlineInput
        id={form.complaints.name}
        name={form.complaints.name}
        label={form.complaints.label}
        maxRows={20}
        sx={{ width: "98.8%" }}
      />
      <FieldsContainer>
        <TextInputField
          id={form.respiratoryRate.name}
          name={form.respiratoryRate.name}
          label={form.respiratoryRate.label}
          getValue={(value: string) => {
            checkTriage(form.respiratoryRate.name, value);
          }}
        />
        <TextInputField
          id={form.heartRate.name}
          name={form.heartRate.name}
          label={form.heartRate.label}
        />
        <br />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          id={form.saturationRate.name}
          name={form.saturationRate.name}
          label={form.saturationRate.label}
        />
        <TextInputField
          id={form.bloodPressure.name}
          name={form.bloodPressure.name}
          label={form.bloodPressure.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          id={form.temperature.name}
          name={form.temperature.name}
          label={form.temperature.label}
          getValue={(value: string) => {
            checkTriage(form.temperature.name, value);
          }}
        />
        <TextInputField
          id={form.bloodPressureDiastolic.name}
          name={form.bloodPressureDiastolic.name}
          label={form.bloodPressureDiastolic.label}
          getValue={(value: string) => {
            checkTriage(form.temperature.name, value);
          }}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          id={form.pulseRate.name}
          name={form.pulseRate.name}
          label={form.pulseRate.label}
          getValue={(value: string) => {
            checkTriage(form.pulseRate.name, value);
          }}
        />
      </FieldsContainer>
      <br />
      <br />

      <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.eyeOpeningResponse.name}
          label={form.eyeOpeningResponse.label}
          options={eyeOpeningResponses}
          row={false}
        />

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
      </FieldsContainer>

      {/* <TextInputField
        id={form.calculatedGCS.name}
        name={form.calculatedGCS.name}
        label={form.calculatedGCS.label}
      /> */}
      <SearchComboBox
        name={form.avpu.name}
        options={avpuLists}
        label={form.avpu.label}
        multiple={false}
      />
      <br />
      <TextInputField
        id={form.glucose.name}
        name={form.glucose.name}
        label={form.glucose.label}
      />
    </FormikInit>
  );
}
