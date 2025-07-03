import { useContext, useEffect, useState } from "react";

import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainButton,
  MainTypography,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
  WrapperBox,
} from "@/components";
import * as yup from "yup";
import { concepts, triageResult } from "@/constants";
import { TriageResult } from "@/interfaces";
import { TriageContext, TriageContextType } from "@/contexts";

export const VitalFormConfig = {
  temperature: {
    name: concepts.TEMPERATURE,
    // label: "Blood Circulation Temperature",
    label: "Body Temperature",
    short: "Temp",
  },
  pulseRate: {
    name: concepts.PULSE_RATE,
    label: "Pulse Rate",
    short: "PR",
  },
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory rate",
    short: "RR",
  },
  saturationRate: {
    name: concepts.BLOOD_OXYGEN_SATURATION,
    label: "Oxygen Saturation",
    short: "SPO2",
  },
  heartRate: {
    name: concepts.HEART_RATE,
    label: "Heart rate",
    short: "HR",
  },
  bloodPressure: {
    name: concepts.SYSTOLIC_BLOOD_PRESSURE,
    label: "Systolic",
    short: "BP",
  },
  bloodPressureDiastolic: {
    name: concepts.DIASTOLIC_BLOOD_PRESSURE,
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
    short: "SPO",
  },
};
type props = {
  initialValues: any;
  onSubmit: (values: any) => void;
  triageResult: string;
  setTriageResult: (rre: any, name: string) => void;
  continueTriage: boolean;
  previous: () => void;
  getFormValues: (values: any) => void;
};
const schema = yup.object({
  [VitalFormConfig.respiratoryRate.name]: yup
    .number()
    .min(0)
    .max(90)
    .label(VitalFormConfig.respiratoryRate.label),
  [VitalFormConfig.saturationRate.name]: yup
    .number()
    .required()
    .min(20)
    .max(100)
    .label(VitalFormConfig.saturationRate.label),
  // [VitalFormConfig.pulseRate.name]: yup.string().required().label(VitalFormConfig.pulseRate.label),
  [VitalFormConfig.bloodPressure.name]: yup
    .number()
    .min(0)
    .max(300)
    .required()
    .label(VitalFormConfig.bloodPressure.label),
  [VitalFormConfig.bloodPressureDiastolic.name]: yup
    .number()
    .min(0)
    .max(300)
    .required()
    .label(VitalFormConfig.bloodPressureDiastolic.label),
  [VitalFormConfig.heartRate.name]: yup
    .number()
    .required()
    .label(VitalFormConfig.heartRate.label)
    .min(0)
    .max(400),
  [VitalFormConfig.temperature.name]: yup
    .number()
    .min(20)
    .max(45)
    .required()
    .label(VitalFormConfig.temperature.label),
  [VitalFormConfig.eyeOpeningResponse.name]: yup
    .string()
    .required()
    .label(VitalFormConfig.eyeOpeningResponse.label),
  [VitalFormConfig.motorResponse.name]: yup
    .string()
    .required()
    .label(VitalFormConfig.motorResponse.label),
  [VitalFormConfig.verbalResponse.name]: yup
    .string()
    .required()
    .label(VitalFormConfig.verbalResponse.label),
  [VitalFormConfig.glucose.name]: yup
    .number()
    .typeError("Glucose must be a number")
    .min(0)
    .max(1000)
    .label(VitalFormConfig.glucose.label),
  [VitalFormConfig.avpu.name]: yup.string().label(VitalFormConfig.avpu.label),
  [VitalFormConfig.units.name]: yup
    .string()
    .required()
    .label(VitalFormConfig.units.label),
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
  { label: "Confused", value: "Confused", weight: 4 },
  { label: "Inappropriate Words", value: "Inappropriate Words", weight: 3 },
  {
    label: "Incomprehensible sounds",
    value: "Incomprehensible sounds",
    weight: 2,
  },
  { label: "None", value: "None", weight: 1 },
];
const avpuLists = [
  { id: "Alert", label: "Alert" },
  { id: "Verbal", label: "Verbal" },
  { id: "Pain", label: "Pain" },
  { id: "Unresponsive", label: "Unresponsive" },
];

const rules = {
  [VitalFormConfig.temperature.name]: [
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
  [VitalFormConfig.heartRate.name]: [
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
  [VitalFormConfig.respiratoryRate.name]: [
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

  [VitalFormConfig.saturationRate.name]: [
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
  [VitalFormConfig.glucose.name]: [
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
  continueTriage,
  previous,
  getFormValues,
}: props) {
  const { addKeyToFlow } = useContext(TriageContext) as TriageContextType;
  const [formValues, setFormValues] = useState<any>({});
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
    return (
      triageResult === "red" &&
      !Boolean(formValues[formField]) &&
      !continueTriage
    );
  };

  const getWeight = (value: string, lists: any) => {
    const found = lists.find((l: any) => l.value == value);
    return found ? found.weight : 0;
  };
  useEffect(() => {
    let _total: number = 0;

    if (
      Boolean(formValues[VitalFormConfig.eyeOpeningResponse.name]) &&
      Boolean(formValues[VitalFormConfig.motorResponse.name]) &&
      Boolean(formValues[VitalFormConfig.verbalResponse.name])
    ) {
      _total =
        getWeight(
          formValues[VitalFormConfig.eyeOpeningResponse.name],
          eyeOpeningResponses
        ) +
        getWeight(
          formValues[VitalFormConfig.motorResponse.name],
          motorResponses
        ) +
        getWeight(
          formValues[VitalFormConfig.verbalResponse.name],
          verbalResponses
        );

      addKeyToFlow({ gsc: _total });

      setTotal(_total);
      if (_total < 11) {
        setTriageResult("red", "gcs");
      } else if (_total >= 11 && _total <= 14) {
        setTriageResult("yellow", "gcs");
      } else {
        setTriageResult("green", "gcs");
      }
    }
  }, [formValues]);

  return (
    <FormikInit
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={{
        ...initialValues,
        [VitalFormConfig.units.name]: "mmol/l",
      }}
      submitButtonText="next"
      submitButton={false}
      getFormValues={getFormValues}
    >
      <FormValuesListener getValues={setFormValues} />
      <FormFieldContainerLayout title="Oxygen Saturation and Heart Rate">
        <FieldsContainer mr="1ch">
          <TextInputField
            id={VitalFormConfig.saturationRate.name}
            name={VitalFormConfig.saturationRate.name}
            label={VitalFormConfig.saturationRate.label}
            disabled={disableField(VitalFormConfig.saturationRate.name)}
            handleBlurEvent={(value: string) => {
              if (value == "") return;

              const saturationRateValue = Number(value);
              if (saturationRateValue < 90) {
                setTriageResult("red", VitalFormConfig.saturationRate.name);
              }
              if (saturationRateValue >= 94) {
                setTriageResult("green", VitalFormConfig.saturationRate.name);
              }
              if (saturationRateValue >= 90 && saturationRateValue < 94) {
                setTriageResult("yellow", VitalFormConfig.saturationRate.name);
              }

              // checkTriage(VitalFormConfig.saturationRate.name, value);
            }}
            unitOfMeasure="%"
            sx={{ width: "100%", m: 0 }}
          />
          <TextInputField
            id={VitalFormConfig.heartRate.name}
            name={VitalFormConfig.heartRate.name}
            label={VitalFormConfig.heartRate.label}
            disabled={disableField(VitalFormConfig.heartRate.name)}
            unitOfMeasure="bpm"
            handleBlurEvent={(value: string) => {
              if (value == "") return;
              const heartRateValue = Number(value);

              if (heartRateValue > 129 || heartRateValue < 40) {
                addKeyToFlow({ heart: "red" });
                setTriageResult("red", VitalFormConfig.heartRate.name);
              }
              if (
                (heartRateValue >= 101 && heartRateValue <= 129) ||
                (heartRateValue >= 40 && heartRateValue <= 59)
              ) {
                addKeyToFlow({ heart: "yellow" });
                setTriageResult("yellow", VitalFormConfig.heartRate.name);
              }
              // if (heartRateValue > 129 || heartRateValue < 40) {
              //   addKeyToFlow({ heart: 'red' });
              //   setTriageResult('red', VitalFormConfig.heartRate.name)
              // }
              if (heartRateValue >= 60 && heartRateValue <= 100) {
                addKeyToFlow({ heart: "green" });
                setTriageResult("green", VitalFormConfig.heartRate.name);
              }
              // checkTriage(VitalFormConfig.heartRate.name, value);
            }}
            sx={{ width: "100%", m: 0 }}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Blood Pressure (mmHg))">
        <FieldsContainer mr="1ch">
          <TextInputField
            id={VitalFormConfig.bloodPressure.name}
            name={VitalFormConfig.bloodPressure.name}
            label={VitalFormConfig.bloodPressure.label}
            disabled={disableField(VitalFormConfig.bloodPressure.name)}
            helperTextWidth="10ch"
            sx={{
              width: "10ch",
            }}
            handleBlurEvent={(value) => {
              if (value == "") return;
              const systolicValue = Number(value);
              if (systolicValue > 200 || systolicValue < 80) {
                addKeyToFlow({ systolic: "red" });
                setTriageResult("red", VitalFormConfig.bloodPressure.name);
                return;
              }

              if (
                (systolicValue >= 81 && systolicValue <= 89) ||
                (systolicValue >= 150 && systolicValue <= 200)
              ) {
                setTriageResult("yellow", VitalFormConfig.bloodPressure.name);
                addKeyToFlow({ systolic: "yellow" });
                return;
              }
              if (
                systolicValue >= 90 ||
                (systolicValue > 89 && systolicValue <= 149)
              ) {
                setTriageResult("green", VitalFormConfig.bloodPressure.name);
                addKeyToFlow({ systolic: "green" });
                return;
              }
            }}
          />
          <TextInputField
            id={VitalFormConfig.bloodPressureDiastolic.name}
            name={VitalFormConfig.bloodPressureDiastolic.name}
            label={VitalFormConfig.bloodPressureDiastolic.label}
            sx={{ width: "10ch" }}
            helperTextWidth="10ch"
            disabled={disableField(VitalFormConfig.bloodPressureDiastolic.name)}
            handleBlurEvent={(value) => {
              if (value == "") return;
              const diastolicValue = Number(value);
              if (diastolicValue > 119) {
                addKeyToFlow({ diastolic: "red" });
                setTriageResult(
                  "red",
                  VitalFormConfig.bloodPressureDiastolic.name
                );
              }
              if (diastolicValue >= 100 && diastolicValue <= 119) {
                addKeyToFlow({ diastolic: "yellow" });
                setTriageResult(
                  "yellow",
                  VitalFormConfig.bloodPressureDiastolic.name
                );
              }
              if (diastolicValue < 100) {
                addKeyToFlow({ diastolic: "green" });
                setTriageResult(
                  "green",
                  VitalFormConfig.bloodPressureDiastolic.name
                );
              }
            }}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Respiratory and Temperature">
        <FieldsContainer mr="1ch">
          <TextInputField
            id={VitalFormConfig.respiratoryRate.name}
            name={VitalFormConfig.respiratoryRate.name}
            label={VitalFormConfig.respiratoryRate.label}
            handleBlurEvent={(value: string) => {
              if (value == "") return;
              checkTriage(VitalFormConfig.respiratoryRate.name, value);
            }}
            disabled={disableField(VitalFormConfig.respiratoryRate.name)}
            unitOfMeasure="bs/m"
            sx={{ width: "100%", m: 0 }}
          />
          <TextInputField
            id={VitalFormConfig.temperature.name}
            name={VitalFormConfig.temperature.name}
            label={VitalFormConfig.temperature.label}
            disabled={disableField(VitalFormConfig.temperature.name)}
            handleBlurEvent={(value: string) => {
              if (value == "") return;
              checkTriage(VitalFormConfig.temperature.name, value);
            }}
            unitOfMeasure="°C"
            sx={{ width: "100%", m: 0 }}
          />
        </FieldsContainer>

        <FieldsContainer sx={{ mt: "1ch" }} mr="2px">
          <SearchComboBox
            width="40%"
            multiple={false}
            name={VitalFormConfig.units.name}
            options={[
              { id: "mmol/l", label: "mmol/l" },
              { id: "mg/dl", label: "mg/dl" },
            ]}
            label={VitalFormConfig.units.label}
          />
          <TextInputField
            id={VitalFormConfig.glucose.name}
            name={VitalFormConfig.glucose.name}
            label={VitalFormConfig.glucose.label}
            sx={{ width: "100%", m: 0 }}
            disabled={disableField(VitalFormConfig.glucose.name)}
            handleBlurEvent={(value: string) => {
              if (value == "") return;
              const glucoseValue = Number(value);

              const units = formValues[VitalFormConfig.units.name];
              addKeyToFlow({ glucose: `${glucoseValue} ${units}` });

              if (units == "mmol/l") {
                if (glucoseValue < 3 || glucoseValue > 30) {
                  setTriageResult("red", VitalFormConfig.glucose.name);
                }
                if (
                  (glucoseValue >= 3.1 && glucoseValue <= 3.8) ||
                  (glucoseValue > 11.1 && glucoseValue <= 29.9)
                ) {
                  setTriageResult("yellow", VitalFormConfig.glucose.name);
                }
                if (glucoseValue >= 3.9 && glucoseValue <= 11.1) {
                  setTriageResult("green", VitalFormConfig.glucose.name);
                }
              }

              // Formula for converting mmol’l to mg/dl: (mmol/l × 18.018)
              const m = 18.018; //multiplicationFactor

              if (units == "mg/dl") {
                if (glucoseValue < 3 * m || glucoseValue > 30 * m) {
                  setTriageResult("red", VitalFormConfig.glucose.name);
                }
                if (
                  (glucoseValue >= 3.1 * m && glucoseValue <= 3.8 * m) ||
                  (glucoseValue > 11.1 * m && glucoseValue <= 29.9 * m)
                ) {
                  setTriageResult("yellow", VitalFormConfig.glucose.name);
                }
                if (glucoseValue >= 3.9 * m && glucoseValue <= 11.1 * m) {
                  setTriageResult("green", VitalFormConfig.glucose.name);
                }
              }
              // checkTriage(VitalFormConfig.glucose.name, value);
            }}
            unitOfMeasure={formValues[VitalFormConfig.units.name]}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>

      <FormFieldContainerLayout last={true} title="GCS">
        <FieldsContainer sx={{ alignItems: "start" }}>
          <RadioGroupInput
            name={VitalFormConfig.motorResponse.name}
            label={VitalFormConfig.motorResponse.label}
            options={motorResponses}
            disabled={disableField(VitalFormConfig.motorResponse.name)}
            row={false}
          />
          <RadioGroupInput
            name={VitalFormConfig.verbalResponse.name}
            label={VitalFormConfig.verbalResponse.label}
            options={verbalResponses}
            disabled={disableField(VitalFormConfig.verbalResponse.name)}
            row={false}
          />
          <RadioGroupInput
            name={VitalFormConfig.eyeOpeningResponse.name}
            label={VitalFormConfig.eyeOpeningResponse.label}
            options={eyeOpeningResponses}
            disabled={disableField(VitalFormConfig.eyeOpeningResponse.name)}
            row={false}
          />
        </FieldsContainer>
        <br />
        <MainTypography fontWeight={"800"} variant="body2">
          (M
          {getWeight(
            formValues[VitalFormConfig.motorResponse.name],
            motorResponses
          )}{" "}
          V
          {getWeight(
            formValues[VitalFormConfig.verbalResponse.name],
            verbalResponses
          )}{" "}
          E
          {getWeight(
            formValues[VitalFormConfig.eyeOpeningResponse.name],
            eyeOpeningResponses
          )}
          ) {total}/15
        </MainTypography>
        <SearchComboBox
          name={VitalFormConfig.avpu.name}
          options={avpuLists}
          label={VitalFormConfig.avpu.label}
          sx={{ my: "1ch" }}
          multiple={false}
          disabled={disableField(VitalFormConfig.avpu.name)}
        />
      </FormFieldContainerLayout>
      <br />
      <WrapperBox>
        <MainButton
          sx={{ m: 0.5 }}
          title={"previous"}
          variant="secondary"
          type="button"
          onClick={previous}
        />
        <MainButton
          sx={{ m: 0.5 }}
          title={"next"}
          type="submit"
          onClick={() => {}}
        />
      </WrapperBox>
    </FormikInit>
  );
}
