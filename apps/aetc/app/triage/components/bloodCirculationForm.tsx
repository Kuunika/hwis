import { Box } from "@mui/material";
import React, { useState } from "react";
import { FieldsContainer, FormikInit, RadioGroupInput } from "shared-ui/src";
import * as Yup from "yup";

const form = {
  isCirculationAbnormal: {
    name: "isCirculationAbnormal",
    label: "Is Circulation Abnormal",
  },
  heartRate: {
    name: "heartRate",
    label: "Heart Rate <50 >120 or Systolic Blood Pressure <70 >180",
  },
  weakIrregularPulse: {
    name: "weakIrregularPulse",
    label: "Weak, Thready, Bounding or regular/irregular pulse",
  },
  reducedUrinaryOutput: {
    name: "reducedUrinaryOutput",
    label: "Reduced urinary output < 30ml/hr",
  },
  clammyPeripherals: {
    name: "clammyPeripherals",
    label: "Cool clammy peripherals or cap refill > 4 seconds",
  },
  temperature: {
    name: "temperature",
    label: "Temperature",
  },
  hemorrhage: {
    name: "hemorrhage",
    label: "Hemorrhage",
  },
  dehydration: {
    name: "dehydrationSkin",
    label: "Dehydration skin turgor, sunken eyes",
  },
};

const schema = Yup.object().shape({
  [form.isCirculationAbnormal.name]: Yup.string()
    .required()
    .label(form.isCirculationAbnormal.label),
  [form.heartRate.name]: Yup.string().label(form.heartRate.label),
  [form.weakIrregularPulse.name]: Yup.string().label(
    form.weakIrregularPulse.label
  ),
  [form.reducedUrinaryOutput.name]: Yup.string().label(
    form.reducedUrinaryOutput.label
  ),
  [form.clammyPeripherals.name]: Yup.string().label(
    form.clammyPeripherals.label
  ),
  [form.temperature.name]: Yup.string().label(form.temperature.label),
  [form.hemorrhage.name]: Yup.string().label(form.hemorrhage.label),
  [form.dehydration.name]: Yup.string().label(form.dehydration.label),
});

const initialValues = {
  [form.clammyPeripherals.name]: "",
  [form.dehydration.name]: "",
  [form.heartRate.name]: "",
  [form.isCirculationAbnormal.name]: "",
  [form.temperature.name]: "",
  [form.weakIrregularPulse.name]: "",
  [form.hemorrhage.name]: "",
};
type Prop = {
  onSubmit: () => void;
};

const options = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

export const BloodCirculationForm = ({ onSubmit }: Prop) => {
  const [isCirculationAbnormal, setIsCirculationAbnormal] = useState("no");
  const [circulationConditions, setCirculationConditions] = useState<any>({});

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <RadioGroupInput
        name={form.isCirculationAbnormal.name}
        label={form.isCirculationAbnormal.label}
        options={options}
        getValue={(value) => setIsCirculationAbnormal(value)}
      />
      <br />
      {isCirculationAbnormal == "true" && (
        <>
          <FieldsContainer>
            <RadioGroupInput
              name={form.heartRate.name}
              label={form.heartRate.label}
              options={options}
            />
            <RadioGroupInput
              name={form.weakIrregularPulse.name}
              label={form.weakIrregularPulse.label}
              options={options}
            />
          </FieldsContainer>
          <FieldsContainer>
            <RadioGroupInput
              name={form.reducedUrinaryOutput.name}
              label={form.reducedUrinaryOutput.label}
              options={options}
            />
            <RadioGroupInput
              name={form.clammyPeripherals.name}
              label={form.clammyPeripherals.label}
              options={options}
            />
          </FieldsContainer>
          <FieldsContainer>
            <RadioGroupInput
              name={form.temperature.name}
              label={form.temperature.label}
              options={options}
            />
            <RadioGroupInput
              name={form.hemorrhage.name}
              label={form.hemorrhage.label}
              options={options}
            />
          </FieldsContainer>
          <FieldsContainer>
            <RadioGroupInput
              name={form.dehydration.name}
              label={form.dehydration.label}
              options={options}
            />
          </FieldsContainer>
        </>
      )}
    </FormikInit>
  );
};
