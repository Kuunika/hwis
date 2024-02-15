import { useEffect, useState } from "react";

import {
  FieldsContainer,
  FormFieldContainer,
  FormFieldContainerLayout,
  FormValuesListener,
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
import { notify } from "@/helpers";
import { useNavigation } from "@/hooks";

const form = {
  temperature: {
    name: concepts.TEMPERATURE,
    label: "Blood Circulation Temperature",
  },
  pulseRate: {
    name: concepts.PULSE_RATE,
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
    label: "Systolic",
  },
  bloodPressureDiastolic: {
    name: concepts.BLOOD_PRESSURE_DIASTOLIC,
    label: "Diastolic",
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
    name: concepts.GLUCOSE,
    label: "Glucose",
  },
  avpu: {
    name: concepts.AVPU,
    label: "AVPU",
  },
  pulseOximetry: {
    name: concepts.PULSE_OXIMETRY,
    label: "Pulse Oximetry",
  },
};
type props = {
  initialValues: any;
  onSubmit: (values: any) => void;
};
const schema = yup.object({
  // [form.pulseOximetry.name]: yup
  //   .string()
  //   .required()
  //   .label(form.pulseOximetry.label),
  [form.respiratoryRate.name]: yup
    .string()
    .required()
    .label(form.respiratoryRate.label),
  [form.saturationRate.name]: yup
    .number()
    .required()
    .min(20)
    .max(100)
    .label(form.saturationRate.label),
  // [form.pulseRate.name]: yup.string().required().label(form.pulseRate.label),
  [form.bloodPressure.name]: yup
    .number()
    .min(0)
    .max(300)
    .required()
    .label(form.bloodPressure.label),
  [form.bloodPressureDiastolic.name]: yup
    .number()
    .min(0)
    .max(300)
    .required()
    .label(form.bloodPressureDiastolic.label),
  [form.heartRate.name]: yup
    .number()
    .required()
    .label(form.heartRate.label)
    .min(0)
    .max(400),
  [form.temperature.name]: yup
    .number()
    .min(20)
    .max(45)
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
  [form.glucose.name]: yup.number().min(60).max(400).label(form.glucose.label),
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
  // [form.pulseRate.name]: [
  //   {
  //     operator: ">",
  //     value: 110,
  //     result: triageResult.YELLOW,
  //     value2: 0,
  //     bound: 130,
  //   },
  //   { operator: "<", value: 50, result: triageResult.YELLOW, bound: 40 },
  //   { operator: "<", value: 40, result: triageResult.RED, bound: 0 },
  //   { operator: ">", value: 130, result: triageResult.RED, bound: 1000 },
  //   {
  //     operator: "combined",
  //     operator1: ">=",
  //     value: 60,
  //     operator2: "<=",
  //     value2: 100,
  //     result: triageResult.GREEN,
  //     bound: 0,
  //   },
  // ],
  [form.respiratoryRate.name]: [
    { operator: ">", value: 30, result: triageResult.RED, bound: 100 },
    { operator: "<", value: 8, result: triageResult.RED, bound: 0 },
    {
      operator: "combined",
      operator1: ">=",
      value: 12,
      operator2: "<=",
      value2: 20,
      result: triageResult.GREEN,
      bound: 0,
    },
  ],

  [form.pulseOximetry.name]: [
    { operator: "<", value: 90, result: triageResult.RED, bound: 0 },
    { operator: "<", value: 93, result: triageResult.YELLOW, bound: 90 },
    { operator: "=", value: 93, result: triageResult.GREEN, bound: 0 },
  ],
  [form.glucose.name]: [
    { operator: "<", value: 40, result: triageResult.RED, bound: 0 },
    { operator: "<", value: 60, result: triageResult.YELLOW, bound: 40 },
    {
      operator: "combined",
      operator1: ">=",
      value: 70,
      operator2: "<=",
      value2: 140,
      result: triageResult.GREEN,
      bound: 0,
    },
  ],
};

export function VitalsForm({ initialValues, onSubmit }: props) {
  const [triageResult, setTriageResult] = useState<TriageResult>("");
  const [formValues, setFormValues] = useState<any>({});
  const [systolic, setSystolic] = useState(0);
  const [diastolic, setDiastolic] = useState(0);
  const { navigateTo } = useNavigation();

  const checkTriage = (name: string, formValue: string) => {
    if (formValue == "") {
      setTriageResult("");
      return;
    }
    rules[name]?.forEach((rule) => {
      const formValueNumber = Number(formValue);

      switch (rule.operator) {
        case "<":
          if (formValueNumber < rule.value && formValueNumber >= rule?.bound) {
            setTriageResult(rule.result as TriageResult);
          }

          return;
        case ">":
          if (formValueNumber > rule.value && formValueNumber <= rule.bound) {
            setTriageResult(rule.result as TriageResult);
          }
          return;
        case "=":
          if (formValueNumber == rule.value) {
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

  // check rules for BP
  useEffect(() => {
    if (systolic > 130) {
      if (diastolic < 180 || diastolic > 220) {
        setTriageResult("red");
        return;
      }
    }
    if (systolic > 110) {
      if (diastolic < 90 || diastolic > 190) {
        setTriageResult("yellow");
      }
    }

    if (systolic < 100) {
      if (diastolic >= 90 && diastolic <= 179) {
        setTriageResult("green");
      }
    }
  }, [diastolic, systolic]);

  const disableField = (formField: string) => {
    return triageResult === "red" && !Boolean(formValues[formField]);
  };

  const handleTriageComplete = () => {
    notify("info", "Patient added to waiting assessments queue");
    navigateTo("/triage");
  };

  return (
    <FormikInit
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={initialValues}
      submitButtonText="next"
    >
      {triageResult && (
        <>
          <TriageContainer
            onCompleteTriage={handleTriageComplete}
            result={triageResult}
            message={"Interventions"}
          />
          <br />
        </>
      )}
      <FormValuesListener getValues={setFormValues} />

      <FormFieldContainerLayout title="Oxygen Saturation and Heart Rate">
        <FieldsContainer>
          <TextInputField
            id={form.saturationRate.name}
            name={form.saturationRate.name}
            label={form.saturationRate.label}
            disabled={disableField(form.saturationRate.name)}
            unitOfMeasure="%"
          />
          <TextInputField
            id={form.heartRate.name}
            name={form.heartRate.name}
            label={form.heartRate.label}
            disabled={disableField(form.heartRate.name)}
            unitOfMeasure="bpm"
          />
        </FieldsContainer>
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Blood Pressure">
        <FieldsContainer>
          <TextInputField
            id={form.bloodPressure.name}
            name={form.bloodPressure.name}
            label={form.bloodPressure.label}
            disabled={disableField(form.bloodPressure.name)}
            helperTextWidth="10ch"
            sx={{
              width: "10ch",
            }}
            getValue={(value) => {
              setSystolic(value);
            }}
          />
          <TextInputField
            id={form.bloodPressureDiastolic.name}
            name={form.bloodPressureDiastolic.name}
            label={form.bloodPressureDiastolic.label}
            sx={{ width: "10ch" }}
            helperTextWidth="10ch"
            disabled={disableField(form.bloodPressureDiastolic.name)}
            getValue={(value) => {
              setDiastolic(value);
            }}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Respiratory and Temperature">
        <FieldsContainer>
          <TextInputField
            id={form.respiratoryRate.name}
            name={form.respiratoryRate.name}
            label={form.respiratoryRate.label}
            getValue={(value: string) => {
              checkTriage(form.respiratoryRate.name, value);
            }}
            disabled={disableField(form.respiratoryRate.name)}
            unitOfMeasure="bs/m"
          />
          <TextInputField
            id={form.temperature.name}
            name={form.temperature.name}
            label={form.temperature.label}
            disabled={disableField(form.temperature.name)}
            getValue={(value: string) => {
              checkTriage(form.temperature.name, value);
            }}
            unitOfMeasure="°C"
          />
        </FieldsContainer>

        <FieldsContainer>
          <TextInputField
            id={form.glucose.name}
            name={form.glucose.name}
            label={form.glucose.label}
            disabled={disableField(form.glucose.name)}
            sx={{ m: 0, my: "1ch" }}
            getValue={(value: string) => {
              checkTriage(form.glucose.name, value);
            }}
            unitOfMeasure="mg/dL"
          />
        </FieldsContainer>
      </FormFieldContainerLayout>
      {/* <FormFieldContainerLayout title="Pulse">
        <FieldsContainer>
          <TextInputField
            disabled={disableField(form.pulseRate.name)}
            id={form.pulseRate.name}
            name={form.pulseRate.name}
            label={form.pulseRate.label}
            getValue={(value: string) => {
              checkTriage(form.pulseRate.name, value);
            }}
          />
          <TextInputField
            disabled={disableField(form.pulseOximetry.name)}
            id={form.pulseOximetry.name}
            name={form.pulseOximetry.name}
            label={form.pulseOximetry.label}
            getValue={(value: string) => {
              checkTriage(form.pulseOximetry.name, value);
            }}
          />
        </FieldsContainer>
      </FormFieldContainerLayout> */}

      <FormFieldContainerLayout last={true} title="AVPU">
        <FieldsContainer sx={{ alignItems: "start" }}>
          <RadioGroupInput
            name={form.eyeOpeningResponse.name}
            label={form.eyeOpeningResponse.label}
            options={eyeOpeningResponses}
            disabled={disableField(form.eyeOpeningResponse.name)}
            row={false}
          />

          <RadioGroupInput
            name={form.motorResponse.name}
            label={form.motorResponse.label}
            options={motorResponses}
            disabled={disableField(form.motorResponse.name)}
            row={false}
          />
          <RadioGroupInput
            name={form.verbalResponse.name}
            label={form.verbalResponse.label}
            options={verbalResponses}
            disabled={disableField(form.verbalResponse.name)}
            row={false}
          />
        </FieldsContainer>
        <SearchComboBox
          name={form.avpu.name}
          options={avpuLists}
          label={form.avpu.label}
          sx={{ my: "1ch" }}
          multiple={false}
          disabled={disableField(form.avpu.name)}
        />
      </FormFieldContainerLayout>

      {/* <TextInputField
        id={form.calculatedGCS.name}
        name={form.calculatedGCS.name}
        label={form.calculatedGCS.label}
      /> */}

      <br />
    </FormikInit>
  );
}
