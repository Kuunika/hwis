"use client"
import React from 'react'
import { FormikInit, RadioGroupInput, TextInputField } from 'shared-ui/src';
import * as yup from "yup";
import { Box } from "@mui/material";
import { formStyles } from '../../triage/src/components/forms/forms.styles';

type Props = {
    onSubmit: (values:any) => void;
}
const form = {
  bleedingInfo: {
    name: "bleeding",
    label: "Is the patient actively bleeding",
  },
  pulseInfo: {
    name: "pulse",
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
    name: "traumatized",
    label: "Is the patient traumatized?",
  },
  distentionInfo: {
    name: "distention",
    label: "Is there abdominal distention?",
  },
  abnormalitiesInfo: {
    name: "abnormalities",
    label: "Is there any other abnormalities?",
  },
  capillaryInfo: {
    name: "Capillary",
    label: "Capillary refill time",
  },
  diastolicInfo: {
    name: "diastolic",
    label: "Diastolic value",
  },
  interavenousInfo: {
    name: "interavenous",
    label: "Size of interavenous catheter",
  },
  pelvisInfo: {
    name: "pelvis",
    label: "Is the pelvis stable?",
  },
  abdnomenInfo: {
    name: "abdnomen",
    label: "Are there other abnomalities on the abdnomen?",
  },
  mucousMembranesInfo: {
    name: "MucousMembranes",
    label: "Mucous membranes",
  },
  meanArterialPressureInfo: {
    name: "SizeOfInteravenousCatheter",
    label: "Mean arterial pressure",
  },
  femurAndTibiaNormalInfo: {
    name: "pelvis",
    label: "is the femur and tibia normal?",
  },
};

const schema = yup.object({
    [form.bleedingInfo.name]: yup.string().required().label(form.bleedingInfo.label),
    [form.pulseInfo.name]:yup.string().required().label(form.pulseInfo.label),
    [form.pulseRate.name]:yup.string().required().label(form.pulseRate.label),
    [form.bloodPresure.name]:yup.string().required().label(form.bloodPresure.label),
    [form.intravenousAccess.name]:yup.string().required().label(form.intravenousAccess.label),
    [form.traumatizedInfo.name]:yup.string().required().label(form.traumatizedInfo.label),
    [form.distentionInfo.name]:yup.string().required().label(form.bleedingInfo.label),
    [form.abnormalitiesInfo.name]:yup.string().required().label(form.abnormalitiesInfo.label),
    [form.capillaryInfo.name]:yup.string().required().label(form.capillaryInfo.label),
    [form.diastolicInfo.name]:yup.string().required().label(form.diastolicInfo.label),
    [form.abdnomenInfo.name]:yup.string().required().label(form.abdnomenInfo.label),
    [form.interavenousInfo.name]:yup.string().required().label(form.interavenousInfo.label),
    [form.pelvisInfo.name]:yup.string().required().label(form.pelvisInfo.label),
    [form.abdnomenInfo.name]:yup.string().required().label(form.abdnomenInfo.label),
    [form.mucousMembranesInfo.name]:yup.string().required().label(form.mucousMembranesInfo.label),
    [form.meanArterialPressureInfo.name]:yup.string().required().label(form.meanArterialPressureInfo.label),
    [form.femurAndTibiaNormalInfo.name]:yup.string().required().label(form.femurAndTibiaNormalInfo.label),

})

const initialValues = {
  bleedingInfo: "",
  pulseInfo: "",
  pulseRate: "",
  bloodPresure: "",
  intravenousAcces: "",
  traumatizedInfo: "",
  distentionInfo: "",
  abnormalitiesInfo: "",
  capillaryInfo: "",
  diastolicInfo: "",
  abdnomenInfo: "",
  interavenousInfo: "",
  pelvisInfo: "",
  mucousMembranesInfo: "",
  meanArterialPressureInfo: "",
  femurAndTibiaNormalInfo: "",
};

const Circulation = ({onSubmit}:Props) => {
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
          name={form.pulseInfo.name}
          label={form.pulseInfo.label}
          id={form.pelvisInfo.name}
        />
      </Box>
    </FormikInit>
  );
}

export default Circulation