import { useEffect, useState } from "react";

import {
  FieldsContainer,
  FormFieldContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainTypography,
  MultlineInput,
  RadioGroupInput,
  SearchComboBox,
  SelectInputField,
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
    // label: "Blood Circulation Temperature",
    label: "Body Temperature",
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
    label: "Oxygen Saturation",
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
  units: {
    name: concepts.ADDITIONAL_NOTES, // change concept
    label: "Units",
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
  triageResult: string;
  setTriageResult: (rre: any, name: string) => void;
  continueTriage: boolean

};
const schema = yup.object({
  // [form.pulseOximetry.name]: yup
  //   .string()
  //   .required()
  //   .label(form.pulseOximetry.label),
  [form.respiratoryRate.name]: yup
    .number()
    .required()
    .min(0)
    .max(90)
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
  [form.glucose.name]: yup.number().min(0).max(1000).label(form.glucose.label),
  [form.avpu.name]: yup.string().required().label(form.avpu.label),
  [form.units.name]: yup.string().required().label(form.units.label)
});

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
  { label: "Disoriented conversation", value: "Disoriented conversation", weight: 4 },
  { label: "Inappropriate Words", value: "Inappropriate Words", weight: 3 },
  { label: "Incomprehensible sounds", value: "Incomprehensible sounds", weight: 2 },
  { label: "None", value: "None", weight: 1 },
];
const avpuLists = [
  { id: "Alert", label: "Alert" },
  { id: "Verbal", label: "Verbal" },
  { id: "Pain", label: "Pain" },
  { id: "Unresponsive", label: "Unresponsive" },
];

const rules = {
  [form.temperature.name]: [
    { operator: "<", value: 34, result: triageResult.RED, bound: 0 },
    {
      operator: ">",
      value: 39.9,
      result: triageResult.RED,
      bound: 100,
    },
    {
      operator: "combined",
      operator1: ">=",
      value: 37.5,
      operator2: "<=",
      value2: 39.9,
      result: triageResult.YELLOW,
      bound: 0,
    },
    {
      operator: "combined",
      operator1: ">=",
      value: 34.1,
      operator2: "<=",
      value2: 35.4,
      result: triageResult.YELLOW,
      bound: 0,
    },
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
  [form.heartRate.name]: [
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
  [form.respiratoryRate.name]: [
    { operator: ">", value: 30, result: triageResult.RED, bound: 100 },
    { operator: "<", value: 8, result: triageResult.RED, bound: 0 },
    {
      operator: "combined",
      operator1: ">=",
      value: 21,
      operator2: "<=",
      value2: 30,
      result: triageResult.YELLOW,
      bound: 0,
    },
    {
      operator: "combined",
      operator1: ">=",
      value: 8,
      operator2: "<=",
      value2: 11,
      result: triageResult.YELLOW,
      bound: 0,
    },
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

  [form.saturationRate.name]: [
    { operator: "<", value: 90, result: triageResult.RED, bound: 0 },
    { operator: "<=", value: 93, result: triageResult.YELLOW, bound: 90 },
    // { operator: "=", value: 93, result: triageResult.GREEN, bound: 0 },
    {
      operator: "combined",
      operator1: ">=",
      value: 94,
      operator2: "<=",
      value2: 100,
      result: triageResult.GREEN,
      bound: 0,
    },
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

export function VitalsForm({
  initialValues,
  onSubmit,
  triageResult,
  setTriageResult,
  continueTriage
}: props) {
  const [formValues, setFormValues] = useState<any>({});
  const [systolic, setSystolic] = useState(0);
  const [diastolic, setDiastolic] = useState(0);
  const [total, setTotal] = useState(0);


  const checkTriage = (name: string, formValue: string) => {
    if (formValue == "") {
      setTriageResult("", name);
      return;
    }
    rules[name]?.forEach((rule) => {
      const formValueNumber = Number(formValue);

      switch (rule.operator) {
        case "<":
          if (formValueNumber < rule.value && formValueNumber >= rule?.bound) {
            setTriageResult(rule.result as TriageResult, name);
          }
          return;
        case ">":
          if (formValueNumber > rule.value && formValueNumber <= rule.bound) {
            setTriageResult(rule.result as TriageResult, name);
          }
          return;
        case "=":
          if (formValueNumber == rule.value) {
            setTriageResult(rule.result as TriageResult, name);
          }
          return;
        case "combined":
          if (
            rule?.value2 &&
            formValueNumber >= rule.value &&
            formValueNumber <= rule.value2
          ) {
            setTriageResult(rule.result as TriageResult, name);
          }
          return;
        default:
          return null;
      }
    });
  };



  const disableField = (formField: string) => {
    return (triageResult === "red" && !Boolean(formValues[formField])) && !continueTriage;
  };


  const getWeight = (value: string, lists: any) => {
    const found = lists.find((l: any) => l.value == value);
    return found ? found.weight : 0
  }
  useEffect(() => {
    let _total: number = 0;

    if (Boolean(formValues[form.eyeOpeningResponse.name]) &&
      Boolean(formValues[form.motorResponse.name]) &&
      Boolean(formValues[form.verbalResponse.name])
    ) {

      _total = getWeight(formValues[form.eyeOpeningResponse.name], eyeOpeningResponses)
        + getWeight(formValues[form.motorResponse.name], motorResponses)
        + getWeight(formValues[form.verbalResponse.name], verbalResponses)

      setTotal(_total);
      if (_total < 11) {
        setTriageResult("red", "gcs")
      } else if (_total >= 11 && _total <= 14) {
        setTriageResult("yellow", "gcs")
      } else {
        setTriageResult('green', 'gcs')
      }
    }
  }, [formValues])

  return (
    <FormikInit
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={{ ...initialValues, [form.units.name]: "mmol/l" }}
      submitButtonText="next"
    >
      <FormValuesListener getValues={setFormValues} />
      <FormFieldContainerLayout title="Oxygen Saturation and Heart Rate">
        <FieldsContainer>
          <TextInputField
            id={form.saturationRate.name}
            name={form.saturationRate.name}
            label={form.saturationRate.label}
            disabled={disableField(form.saturationRate.name)}
            getValue={(value: string) => {
              const saturationRateValue = Number(value);

              if (saturationRateValue < 90) {
                setTriageResult('red', form.saturationRate.name)
              }
              if (saturationRateValue >= 94) {
                setTriageResult('green', form.saturationRate.name)
              }
              if (saturationRateValue >= 90 && saturationRateValue < 94) {
                setTriageResult('yellow', form.saturationRate.name)
              }

              // checkTriage(form.saturationRate.name, value);
            }}
            unitOfMeasure="%"
          />
          <TextInputField
            id={form.heartRate.name}
            name={form.heartRate.name}
            label={form.heartRate.label}
            disabled={disableField(form.heartRate.name)}
            unitOfMeasure="bpm"
            getValue={(value: string) => {
              checkTriage(form.heartRate.name, value);
            }}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Blood Pressure (mmHg))">
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
              const systolicValue = Number(value);
              if (systolicValue > 200 || systolicValue < 80) {
                setTriageResult('red', form.bloodPressure.name)
                return
              }

              if ((systolicValue >= 81 && systolicValue <= 89) || (systolicValue >= 150 && systolicValue <= 200)) {
                setTriageResult('yellow', form.bloodPressure.name)
                return
              }
              if (systolicValue >= 90 || (systolicValue > 89 && systolicValue <= 149)) {
                setTriageResult('green', form.bloodPressure.name)
                return
              }
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
              const diastolicValue = Number(value);
              if (diastolicValue > 119) {
                setTriageResult('red', form.bloodPressureDiastolic.name)
              }
              if (diastolicValue >= 100 && diastolicValue <= 119) {
                setTriageResult('yellow', form.bloodPressureDiastolic.name)
              }
              if (diastolicValue < 100) {
                setTriageResult('green', form.bloodPressureDiastolic.name)
              }
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

        <FieldsContainer sx={{ display: "flex", alignItems: "center" }}>
          <SelectInputField
            sx={{ mt: 1 }}
            width="20%"
            name={form.units.name}
            selectItems={[
              { name: "mmol/l", value: "mmol/l" },
              { name: "mg/dl", value: "mg/dl" },
            ]}
            label={form.units.label}
            id={form.units.name}
          />
          <TextInputField
            id={form.glucose.name}
            name={form.glucose.name}
            label={form.glucose.label}
            disabled={disableField(form.glucose.name)}
            sx={{ m: 0, my: "1ch" }}

            getValue={(value: string) => {
              const glucoseValue = Number(value);

              if (formValues[form.units.name] == "mmol/l") {
                if (glucoseValue < 3 || glucoseValue > 30) {
                  setTriageResult("red", form.glucose.name)
                }
                if ((glucoseValue >= 3.1 && glucoseValue <= 3.8) || (glucoseValue > 11.1 && glucoseValue <= 29.9)) {
                  setTriageResult("yellow", form.glucose.name)
                }
                if (glucoseValue >= 3.9 && glucoseValue <= 11.1) {
                  setTriageResult("green", form.glucose.name)
                }
              }

              // Formula for converting mmol’l to mg/dl: (mmol/l × 18.018)
              const m = 18.018; //multiplicationFactor

              if (formValues[form.units.name] == "mg/dl") {
                if (glucoseValue < 3 * m || glucoseValue > 30 * m) {
                  setTriageResult("red", form.glucose.name)
                }
                if ((glucoseValue >= 3.1 * m && glucoseValue <= 3.8 * m) || (glucoseValue > 11.1 * m && glucoseValue <= 29.9 * m)) {
                  setTriageResult("yellow", form.glucose.name)
                }
                if (glucoseValue >= 3.9 * m && glucoseValue <= 11.1 * m) {
                  setTriageResult("green", form.glucose.name)
                }
              }
              // checkTriage(form.glucose.name, value);
            }}
            unitOfMeasure={formValues[form.units.name]}
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

      <FormFieldContainerLayout last={true} title="GCS">
        <FieldsContainer sx={{ alignItems: "start" }}>
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
          <RadioGroupInput
            name={form.eyeOpeningResponse.name}
            label={form.eyeOpeningResponse.label}
            options={eyeOpeningResponses}
            disabled={disableField(form.eyeOpeningResponse.name)}
            row={false}
          />
        </FieldsContainer>
        <br />
        <MainTypography>
          (M{getWeight(formValues[form.motorResponse.name], motorResponses)} V{getWeight(formValues[form.verbalResponse.name], verbalResponses)} E{getWeight(formValues[form.eyeOpeningResponse.name], eyeOpeningResponses)})   {total}/15
        </MainTypography>
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
