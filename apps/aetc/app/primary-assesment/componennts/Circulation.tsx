"use client";
import React from "react";
import { FormikInit, RadioGroupInput, TextInputField } from "shared-ui/src";
import * as yup from "yup";
import { Box } from "@mui/material";
import { formStyles } from "../../../../triage/src/components/forms/forms.styles";

type Prop = {
  onSubmit: (values: any) => void;
};
const form = {
  bleedingInfo: {
    name: "bleedingInfo",
    label: "Is the patient actively bleeding",
  },
  pressureInfo: {
    name: "pressureInfo",
    label: "Presure",
  },
  pulseInfo: {
    name: "pulseInfo",
    label: "Is the patient have a pulse",
  },
  pulseRate: {
    name: "pulseRate",
    label: "The value of the pulse",
  },
  bloodPresure: {
    name: "bloodPresure",
    label: "The value of the blood pressure",
  },
  intravenousAccess: {
    name: "intravenousAccess",
    label: "Does the patient need  intravenous access",
  },
  traumatizedInfo: {
    name: "traumatizedInfo",
    label: "Is the patient traumatized?",
  },
  distentionInfo: {
    name: "distentionInfo",
    label: "Is there abdominal distention?",
  },
  abnormalitiesInfo: {
    name: "abnormalitiesInfo",
    label: "Is there any other abnormalities?",
  },
  capillaryInfo: {
    name: "capillaryInfo",
    label: "Capillary refill time",
  },
  diastolicInfo: {
    name: "diastolicInfo",
    label: "Diastolic value",
  },
  interavenousInfo: {
    name: "interavenousInfo",
    label: "Size of interavenous catheter",
  },
  pelvisInfo: {
    name: "pelvisInfo",
    label: "Is the pelvis stable?",
  },
  abdnomenDistention: {
    name: "abdnomenDistention",
    label: "Is there abdominal distention?",
  },
  abdnomenInfo: {
    name: "abdnomenInfo",
    label: "Are there other abnomalities on the abdnomen?",
  },
  mucousMembranesInfo: {
    name: "mucousMembranesInfo",
    label: "Mucous membranes",
  },
  meanArterialPressureInfo: {
    name: "meanArterialPressureInfo",
    label: "Mean arterial pressure",
  },
  catheterInfo: {
    name: "catheterInfo",
    label: "Catheter",
  },
  femurAndTibiaNormalInfo: {
    name: "femurAndTibiaNormalInfo",
    label: "is the femur and tibia normal?",
  },
};

const schema = yup.object({
  [form.bleedingInfo.name]: yup.string().required().label(form.bleedingInfo.label),
  [form.pulseInfo.name]: yup.string().required().label(form.pulseInfo.label),
  [form.pressureInfo.name]: yup.string().required().label(form.pressureInfo.label),
  [form.pulseRate.name]: yup.string().required().label(form.pulseRate.label),
  [form.bloodPresure.name]: yup.string().required().label(form.bloodPresure.label),
  [form.intravenousAccess.name]: yup.string().required().label(form.intravenousAccess.label),
  [form.traumatizedInfo.name]: yup.string().required().label(form.traumatizedInfo.label),
  [form.distentionInfo.name]: yup.string().required().label(form.bleedingInfo.label),
  [form.abnormalitiesInfo.name]: yup.string().required().label(form.abnormalitiesInfo.label),
  [form.capillaryInfo.name]: yup.string().required().label(form.capillaryInfo.label),
  [form.abdnomenDistention.name]:yup.string().required().label(form.abdnomenDistention.label),
  [form.diastolicInfo.name]: yup.string().required().label(form.diastolicInfo.label),
  [form.abdnomenInfo.name]: yup.string().required().label(form.abdnomenInfo.label),
  [form.interavenousInfo.name]: yup.string().required().label(form.interavenousInfo.label),
  [form.pelvisInfo.name]: yup.string().required().label(form.pelvisInfo.label),
  [form.abdnomenInfo.name]: yup.string().required().label(form.abdnomenInfo.label),
  [form.mucousMembranesInfo.name]: yup.string().required().label(form.mucousMembranesInfo.label),
  [form.meanArterialPressureInfo.name]: yup.string().required().label(form.meanArterialPressureInfo.label),
  [form.catheterInfo.name]:yup.string().required().label(form.catheterInfo.label),
  [form.femurAndTibiaNormalInfo.name]: yup.string().required().label(form.femurAndTibiaNormalInfo.label),
});

const initialValues = {
  bleedingInfo: "",
  pulseInfo: "",
  pressureInfo:"",
  pulseRate: "",
  bloodPresure: "",
  intravenousAcces: "",
  traumatizedInfo: "",
  abdnomenDistention:"",
  distentionInfo: "",
  abnormalitiesInfo: "",
  capillaryInfo: "",
  diastolicInfo: "",
  abdnomenInfo: "",
  interavenousInfo: "",
  pelvisInfo: "",
  mucousMembranesInfo: "",
  catheterInfo:"",
  meanArterialPressureInfo: "",
  femurAndTibiaNormalInfo: "",
};

const Circulation = ({ onSubmit}:Prop) => {

  const sizeOfCatheter = [
    { label: "14G", value: "14G" },
    { label: "16G", value: "16G" },
    { label: "18G", value: "18G" },
    { label: "20G", value: "20G" },
    { label: "22G", value: "22G" },
  ];
  const sizeOfCapillary = [
    { label: "Less than 3 seconds", value: "Less than 3 seconds" },
    { label: "3 Seconds", value: "3 Seconds" },

  ];
  const sizeOfMucous = [
    { label: "Normal", value: "Normal" },
    { label: "Pale", value: "Pale" },
    { label: "Cyanosis", value: "Cyanosis" },
  ];
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <Box sx={formStyles.responsiveness}>
        <RadioGroupInput
          name={form.bleedingInfo.name}
          label={form.bleedingInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <TextInputField
          name={form.pressureInfo.name}
          label={form.pressureInfo.label}
          id={form.pressureInfo.name}
        />
        <RadioGroupInput
          name={form.pulseInfo.name}
          label={form.pulseInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <TextInputField
          name={form.pulseRate.name}
          label={form.pulseRate.label}
          id={form.pulseRate.name}
        />
        <TextInputField
          name={form.bloodPresure.name}
          label={form.bloodPresure.label}
          id={form.bloodPresure.name}
        />
        <RadioGroupInput
          name={form.interavenousInfo.name}
          label={form.interavenousInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.traumatizedInfo.name}
          label={form.traumatizedInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.abdnomenDistention.name}
          label={form.abdnomenDistention.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.abnormalitiesInfo.name}
          label={form.abnormalitiesInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.capillaryInfo.name}
          label={form.capillaryInfo.label}
          options={sizeOfCapillary}
        />
        <TextInputField
          name={form.diastolicInfo.name}
          label={form.diastolicInfo.label}
          id={form.diastolicInfo.name}
        />
        <RadioGroupInput
          name={form.catheterInfo.name}
          label={form.catheterInfo.label}
          options={sizeOfCatheter}
        />
        <RadioGroupInput
          name={form.pelvisInfo.name}
          label={form.pelvisInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.abnormalitiesInfo.name}
          label={form.abnormalitiesInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.mucousMembranesInfo.name}
          label={form.mucousMembranesInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.femurAndTibiaNormalInfo.name}
          label={form.femurAndTibiaNormalInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </Box>
    </FormikInit>
  );
};

export default Circulation;
