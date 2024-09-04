"use client";
import { NotificationContainer } from "@/components";
import { NO, YES, concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import * as yup from "yup";
import { LegAbnomalityImage } from "@/components/svgImages/legAbnormality";
import { AbdomenImage, AbdomenImageWithOtherForm } from "@/components/svgImages";

type Prop = {
  onSubmit: (values: any) => void;
};
const form = {
  bleedingInfo: {
    name: concepts.IS_PATIENT_ACTIVELY_BLEEDING,
    label: "Is the patient actively bleeding",
  },
  pulseInfo: {
    name: concepts.IS_THE_PATIENT_HAVE_PULSE,
    label: "Is the patient have a pulse",
  },
  pulseRate: {
    name: concepts.PULSE_RATE_WEAK,
    label: "Purse Rate",
  },
  bloodPressureSystolic: {
    name: concepts.BLOOD_PRESSURE_SYSTOLIC,
    label: "Blood Pressure Systolic",
  },
  bloodPressureDiastolic: {
    name: concepts.BLOOD_PRESSURE_DIASTOLIC,
    label: "Blood Pressure Diastolic",
  },
  intravenousAccess: {
    name: concepts.PATIENT_INTRAVENOUS,
    label: "Does the patient need  intravenous access",
  },
  traumatizedInfo: {
    name: concepts.IS_PATIENT_TRAUMATIZED,
    label: "Is the patient traumatized?",
  },

  abnormalitiesInfo: {
    name: concepts.IS_THERE_ANY_OTHER_ABNOMALITIES,
    label: "Is there any other abnormalities?",
  },
  capillaryInfo: {
    name: concepts.CAPILLARY_REFILL_TIME,
    label: "Capillary refill time",
  },
  // diastolicInfo: {
  //   name: "diastolicInfo",
  //   label: "Diastolic value",
  // },
  // interavenousInfo: {
  //   name: "interavenousInfo",
  //   label: "Size of interavenous catheter",
  // },
  pelvisInfo: {
    name: concepts.IS_PELVIS_STABLE,
    label: "Is the pelvis stable?",
  },
  abdnomenDistention: {
    name: concepts.HEADACHE,
    label: "Is there abdominal distention?",
  },

  mucousMembranesInfo: {
    name: concepts.MUCOUS_MEMBRANES,
    label: "Mucous membranes",
  },

  catheterInfo: {
    name: concepts.SIZE_OF_CATHETER,
    label: "Size of interaveneous catheter",
  },
  femurAndTibiaNormalInfo: {
    name: concepts.IS_FEMUR_TIBIA_NORMAL,
    label: "is the femur and tibia normal?",
  },
  bleedingActionDone: {
    name: concepts.ACTION_DONE,
    label: "Action done",
  },
  // sizeOfIntravenousCatheter: {
  //   name: "sizeOfIntravenousCatheter",
  //   label: "Size of intravenous catheter",
  // },
  anyOtherAbnormalities: {
    name: concepts.IS_THERE_ANY_OTHER_ABNOMALITIES,
    label: "Is There Any Other Abnormalites",
  },
  anyOtherAbnormalitiesOnAbdomen: {
    name: concepts.IS_THERE_OTHER_OBDONORMALITIES,
    label: "Is There Any Other Abnormalities on the Abdomen",
  },
  additionalNotes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
  assessPeripheries: {
    name: concepts.ASSESS_PERIPHERIES,
    label: "Assess Peripheries",
  },
  bloodPressureMeasured: {
    name: concepts.BLOOD_PRESSURE_MEASURED,
    label: "Blood Pressure Measured",
  },
  reasonNotRecorded: {
    name: concepts.REASON_NOT_RECORDED,
    label: "Reason BP Is unrecordable",
  },
};

const schema = yup.object({
  [form.bleedingInfo.name]: yup
    .string()

    .label(form.bleedingInfo.label),
  [form.pulseInfo.name]: yup.string().label(form.pulseInfo.label),

  [form.pulseRate.name]: yup.string().label(form.pulseRate.label),
  [form.bleedingActionDone.name]: yup
    .string()
    .label(form.bleedingActionDone.label),
  [form.bloodPressureSystolic.name]: yup
    .string()

    .label(form.bloodPressureSystolic.label),
  [form.bloodPressureDiastolic.name]: yup
    .string()
    .label(form.bloodPressureDiastolic.label),
  [form.intravenousAccess.name]: yup
    .string()

    .label(form.intravenousAccess.label),
  [form.traumatizedInfo.name]: yup
    .string()

    .label(form.traumatizedInfo.label),

  [form.abnormalitiesInfo.name]: yup
    .string()

    .label(form.abnormalitiesInfo.label),
  [form.capillaryInfo.name]: yup
    .string()

    .label(form.capillaryInfo.label),
  [form.abdnomenDistention.name]: yup
    .string()

    .label(form.abdnomenDistention.label),
  // [form.diastolicInfo.name]: yup
  //   .string()
  //   .required()
  //   .label(form.diastolicInfo.label),

  // [form.interavenousInfo.name]: yup
  //   .string()
  //   .required()
  //   .label(form.interavenousInfo.label),
  [form.pelvisInfo.name]: yup.string().label(form.pelvisInfo.label),
  [form.mucousMembranesInfo.name]: yup
    .string()

    .label(form.mucousMembranesInfo.label),
  [form.catheterInfo.name]: yup
    .string()

    .label(form.catheterInfo.label),
  [form.femurAndTibiaNormalInfo.name]: yup
    .string()

    .label(form.femurAndTibiaNormalInfo.label),
  // [form.sizeOfIntravenousCatheter.name]: yup
  //   .string()
  //   .label(form.sizeOfIntravenousCatheter.label),
  [form.anyOtherAbnormalities.name]: yup
    .string()
    .label(form.anyOtherAbnormalities.label),
  [form.anyOtherAbnormalitiesOnAbdomen.name]: yup
    .string()
    .label(form.anyOtherAbnormalitiesOnAbdomen.label),
  [form.additionalNotes.name]: yup.string().label(form.additionalNotes.label),
  [form.assessPeripheries.name]: yup
    .string()
    .label(form.assessPeripheries.label),
});

const initialValues = getInitialValues(form);

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

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
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
      <FormFieldContainerLayout title="Bleeding and Pulse">
        <FieldsContainer>
          <RadioGroupInput
            name={form.bleedingInfo.name}
            label={form.bleedingInfo.label}
            options={radioOptions}
          />
          <RadioGroupInput
            name={form.pulseInfo.name}
            label={form.pulseInfo.label}
            options={radioOptions}
          />
        </FieldsContainer>
        {formValues[form.bleedingInfo.name] == YES && (
          <>
            <br />
            <NotificationContainer message="Apply pressure" />

            <br />
            <TextInputField
              sx={{ width: "100%" }}
              name={form.bleedingActionDone.name}
              id={form.bleedingActionDone.name}
              label={form.bleedingActionDone.label}
            />
          </>
        )}

        {formValues[form.pulseInfo.name] == NO && (
          <>
            <NotificationContainer message="Start cardiopulmonary resuscitation" />
          </>
        )}

        {formValues[form.pulseInfo.name] == YES && (
          <>
            <br />
            <FieldsContainer>
              <RadioGroupInput
                name={form.pulseRate.name}
                label={form.pulseRate.label}
                options={pulseRates}
              />
              <RadioGroupInput
                name={form.capillaryInfo.name}
                label={form.capillaryInfo.label}
                options={capillaryRefillTimes}
              />
            </FieldsContainer>
          </>
        )}
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Mucous and Peripherals">
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.mucousMembranesInfo.name}
            label={form.mucousMembranesInfo.label}
            options={sizeOfMucous}
          />
          <RadioGroupInput
            name={form.assessPeripheries.name}
            label={form.assessPeripheries.label}
            options={[
              { label: "Cold and clammy", value: "cold and clammy" },
              { label: "Warm", value: "warm" },
            ]}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Blood Pressure">
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.bloodPressureMeasured.name}
            label={form.bloodPressureMeasured.label}
            options={[
              { label: "Done", value: "Done" },
              { label: "Not Done", value: "not Done" },
              { label: "BP Unrecordable", value: "BP Unrecordable" },
            ]}
          />
        </FieldsContainer>
        {formValues[form.bloodPressureMeasured.name] == "BP Unrecordable" && (
          <>
            <TextInputField
              sx={{ m: 0, width: "100%" }}
              name={form.reasonNotRecorded.name}
              label={form.reasonNotRecorded.label}
              id={form.reasonNotRecorded.name}
            />
          </>
        )}
        {formValues[form.bloodPressureMeasured.name] == "Done" && (
          <>
            <br />
            <FieldsContainer>
              <TextInputField
                sx={{ m: 0 }}
                name={form.bloodPressureSystolic.name}
                label={form.bloodPressureSystolic.label}
                id={form.bloodPressureSystolic.name}
              />
              <TextInputField
                name={form.bloodPressureDiastolic.name}
                label={form.bloodPressureDiastolic.label}
                id={form.bloodPressureDiastolic.name}
              />
            </FieldsContainer>
            <br />
          </>
        )}
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="intravenous and Traumatized">
        <FieldsContainer>
          <RadioGroupInput
            name={form.intravenousAccess.name}
            label={form.intravenousAccess.label}
            options={radioOptions}
          />
          <RadioGroupInput
            name={form.traumatizedInfo.name}
            label={form.traumatizedInfo.label}
            options={radioOptions}
          />
        </FieldsContainer>
        {formValues[form.intravenousAccess.name] == YES && (
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
        {formValues[form.traumatizedInfo.name] == YES && (
          <>
            <FieldsContainer>
              <RadioGroupInput
                name={form.pelvisInfo.name}
                label={form.pelvisInfo.label}
                options={radioOptions}
              />
              <RadioGroupInput
                name={form.femurAndTibiaNormalInfo.name}
                label={form.femurAndTibiaNormalInfo.label}
                options={radioOptions}
              />
            </FieldsContainer>

            {formValues[form.pelvisInfo.name] == YES && (
              <>
                <NotificationContainer message="apply pelvic binder" />
              </>
            )}
            {formValues[form.femurAndTibiaNormalInfo.name] == NO && (
              <>
                <br />
                <NotificationContainer
                  message="(Diagram) posterior and anterior, with the following options for the
                sections of the legs"
                />
                <LegAbnomalityImage />
                <br />
              </>
            )}
          </>
        )}
      </FormFieldContainerLayout>
      <FormFieldContainerLayout last={true} title="Abdominal">
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            name={form.abdnomenDistention.name}
            label={form.abdnomenDistention.label}
            options={radioOptions}
          />
          <RadioGroupInput
            name={form.anyOtherAbnormalitiesOnAbdomen.name}
            label={form.anyOtherAbnormalitiesOnAbdomen.label}
            options={radioOptions}
          />
        </FieldsContainer>
        {formValues[form.anyOtherAbnormalitiesOnAbdomen.name] == YES && (
          <>
            <AbdomenImage />
          </>
        )}
        <FieldsContainer>
          <RadioGroupInput
            name={form.abnormalitiesInfo.name}
            label={form.abnormalitiesInfo.label}
            options={radioOptions}
          />
        </FieldsContainer>
        {formValues[form.abnormalitiesInfo.name] == YES && (
          <>
            <br />

            {/* <NotificationContainer
              message=" (Picture Comes Up and indicate the following) Tenderness (Multiple
            Selection) Wound (Multiple Selection) Laceration Stab/Puncture
            Bruise Burns Wound"
            /> */}
            <AbdomenImageWithOtherForm />
            <br />
          </>
        )}

        <TextInputField
          sx={{ width: "100%", m: 0 }}
          name={form.additionalNotes.name}
          label={form.additionalNotes.label}
          id={form.additionalNotes.name}
        />
      </FormFieldContainerLayout>
    </FormikInit>
  );
};
