"use client";
import { NotificationContainer } from "@/components";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormValuesListener,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
} from "shared-ui/src";
import * as yup from "yup";

type Prop = {
  onSubmit: (values: any) => void;
};
const form = {
  bleedingInfo: {
    name: "bleedingInfo",
    label: "Is the patient actively bleeding",
  },
  pulseInfo: {
    name: "pulseInfo",
    label: "Is the patient have a pulse",
  },
  pulseRate: {
    name: "pulseRate",
    label: "Purse Rate",
  },
  bloodPresure: {
    name: "bloodPresure",
    label: "Blood Pressure",
  },
  intravenousAccess: {
    name: "intravenousAccess",
    label: "Does the patient need  intravenous access",
  },
  traumatizedInfo: {
    name: "traumatizedInfo",
    label: "Is the patient traumatized?",
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

  mucousMembranesInfo: {
    name: "mucousMembranesInfo",
    label: "Mucous membranes",
  },

  catheterInfo: {
    name: "catheterInfo",
    label: "Size of interaveneous catheter",
  },
  femurAndTibiaNormalInfo: {
    name: "femurAndTibiaNormalInfo",
    label: "is the femur and tibia normal?",
  },
  bleedingActionDone: {
    name: "bleedingActionDone",
    label: "Action done",
  },
  sizeOfIntravenousCatheter: {
    name: "sizeOfIntravenousCatheter",
    label: "Size of intravenous catheter",
  },
  anyOtherAbnormalities: {
    name: "anyOtherAbnormalities",
    label: "Is There Any Other Abnormalites",
  },
  anyOtherAbnormalitiesOnAbdomen: {
    name: "anyOtherAbnormalitiesOnAbdomen",
    label: "Is There Any Other Abnormalities on the Abdomen",
  },
  additionalNotes: {
    name: "additionalNotes",
    label: "Additional Notes",
  },
};

const schema = yup.object({
  [form.bleedingInfo.name]: yup
    .string()
    .required()
    .label(form.bleedingInfo.label),
  [form.pulseInfo.name]: yup.string().required().label(form.pulseInfo.label),

  [form.pulseRate.name]: yup.string().label(form.pulseRate.label),
  [form.bleedingActionDone.name]: yup
    .string()
    .label(form.bleedingActionDone.label),
  [form.bloodPresure.name]: yup
    .string()
    .required()
    .label(form.bloodPresure.label),
  [form.intravenousAccess.name]: yup
    .string()
    .required()
    .label(form.intravenousAccess.label),
  [form.traumatizedInfo.name]: yup
    .string()
    .required()
    .label(form.traumatizedInfo.label),

  [form.abnormalitiesInfo.name]: yup
    .string()
    .required()
    .label(form.abnormalitiesInfo.label),
  [form.capillaryInfo.name]: yup
    .string()
    .required()
    .label(form.capillaryInfo.label),
  [form.abdnomenDistention.name]: yup
    .string()
    .required()
    .label(form.abdnomenDistention.label),
  [form.diastolicInfo.name]: yup
    .string()
    .required()
    .label(form.diastolicInfo.label),

  [form.interavenousInfo.name]: yup
    .string()
    .required()
    .label(form.interavenousInfo.label),
  [form.pelvisInfo.name]: yup.string().required().label(form.pelvisInfo.label),
  [form.mucousMembranesInfo.name]: yup
    .string()
    .required()
    .label(form.mucousMembranesInfo.label),
  [form.catheterInfo.name]: yup
    .string()
    .required()
    .label(form.catheterInfo.label),
  [form.femurAndTibiaNormalInfo.name]: yup
    .string()
    .required()
    .label(form.femurAndTibiaNormalInfo.label),
  [form.sizeOfIntravenousCatheter.name]: yup
    .string()
    .label(form.sizeOfIntravenousCatheter.label),
  [form.anyOtherAbnormalities.name]: yup
    .string()
    .label(form.anyOtherAbnormalities.label),
  [form.anyOtherAbnormalitiesOnAbdomen.name]: yup
    .string()
    .label(form.anyOtherAbnormalitiesOnAbdomen.label),
  [form.additionalNotes.name]: yup.string().label(form.additionalNotes.label),
});

const initialValues = {
  bleedingInfo: "",
  pulseInfo: "",
  pressureInfo: "",
  pulseRate: "",
  bloodPresure: "",
  intravenousAcces: "",
  traumatizedInfo: "",
  abdnomenDistention: "",
  distentionInfo: "",
  abnormalitiesInfo: "",
  capillaryInfo: "",
  diastolicInfo: "",
  abdnomenInfo: "",
  interavenousInfo: "",
  pelvisInfo: "",
  mucousMembranesInfo: "",
  catheterInfo: "",
  meanArterialPressureInfo: "",
  femurAndTibiaNormalInfo: "",
};

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

const pulseRates = [
  { label: "Weak", value: "weak" },
  { label: "Strong, Regular", value: "strong, Regular" },
  { label: "Irregular", value: "irregular" },
];

const capillaryRefillTimes = [
  { label: "Less than 3 seconds", value: "Less than 3 seconds" },
  { label: "3 seconds", value: "3 seconds" },
  { label: "More than 3 seconds", value: "More than 3 seconds" },
];
export const Circulation = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <FormValuesListener getValues={setFormValues} />
      <FieldsContainer>
        <RadioGroupInput
          name={form.bleedingInfo.name}
          label={form.bleedingInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.pulseInfo.name}
          label={form.pulseInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      {formValues[form.bleedingInfo.name] == "yes" && (
        <>
          <br />
          <NotificationContainer message="Apply pressure" />

          <br />
          <TextInputField
            name={form.bleedingActionDone.name}
            id={form.bleedingActionDone.name}
            label={form.bleedingActionDone.label}
          />
        </>
      )}

      {formValues[form.pulseInfo.name] == "yes" && (
        <>
          <br />
          <FieldsContainer>
            <RadioGroupInput
              name={form.pulseRate.name}
              label={form.pulseRate.label}
              options={pulseRates}
            />
          </FieldsContainer>
        </>
      )}

      {formValues[form.pulseInfo.name] == "no" && (
        <>
          <NotificationContainer message="Start cardiopulmonary resuscitation" />
        </>
      )}

      <br />
      <FieldsContainer>
        <RadioGroupInput
          name={form.capillaryInfo.name}
          label={form.capillaryInfo.label}
          options={capillaryRefillTimes}
        />
        <RadioGroupInput
          name={form.intravenousAccess.name}
          label={form.intravenousAccess.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>

      {formValues[form.intravenousAccess.name] == "yes" && (
        <>
          <br />
          <FieldsContainer>
            <RadioGroupInput
              name={form.catheterInfo.name}
              label={form.catheterInfo.label}
              options={sizeOfCatheter}
            />
            <MainTypography>Diagram</MainTypography>
          </FieldsContainer>
          <br />
        </>
      )}

      <br />
      <FieldsContainer sx={{ alignItems: "flex-start" }}>
        <RadioGroupInput
          name={form.traumatizedInfo.name}
          label={form.traumatizedInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.mucousMembranesInfo.name}
          label={form.mucousMembranesInfo.label}
          options={sizeOfMucous}
        />
      </FieldsContainer>
      <br />

      {formValues[form.traumatizedInfo.name] == "yes" && (
        <>
          <FieldsContainer>
            <RadioGroupInput
              name={form.pelvisInfo.name}
              label={form.pelvisInfo.label}
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
          </FieldsContainer>

          {formValues[form.femurAndTibiaNormalInfo.name] == "no" && (
            <>
              <br />
              <MainTypography>
                {" "}
                posterior and anterior, with the following options for the
                sections of the legs{" "}
              </MainTypography>
              <br />
            </>
          )}
        </>
      )}

      <FieldsContainer>
        <RadioGroupInput
          name={form.abdnomenDistention.name}
          label={form.abdnomenDistention.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <RadioGroupInput
          name={form.anyOtherAbnormalitiesOnAbdomen.name}
          label={form.anyOtherAbnormalitiesOnAbdomen.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>

      {formValues[form.anyOtherAbnormalitiesOnAbdomen.name] == "yes" && (
        <>
          <NotificationContainer
            message="Picture of abdomen to select areas of abnormalites with the options
            below:1. Right Hyphochondriac 4. Right Lumbar 7. Right iliac 2.
            Epigrastric 5. Umbilical 3. Left Hypochondriac6.Left Lumbar 9. Left
            Iliac 8. Suprapubic/Hypogastric"
          />
        </>
      )}

      <FieldsContainer>
        <RadioGroupInput
          name={form.abnormalitiesInfo.name}
          label={form.abnormalitiesInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>

      {formValues[form.abnormalitiesInfo.name] == "yes" && (
        <>
          <br />

          <NotificationContainer
            message=" (Picture Comes Up and indicate the following) Tenderness (Multiple
            Selection) Wound (Multiple Selection) Laceration Stab/Puncture
            Bruise Burns Wound"
          />
          <br />
        </>
      )}

      <TextInputField
        name={form.bloodPresure.name}
        label={form.bloodPresure.label}
        id={form.bloodPresure.name}
      />
      <TextInputField
        name={form.additionalNotes.name}
        label={form.additionalNotes.label}
        id={form.additionalNotes.name}
      />
    </FormikInit>
  );
};
