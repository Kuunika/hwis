"use client";
import { NotificationContainer, SearchComboBox } from "@/components";
import { NO, YES, concepts, encounters } from "@/constants";
import { getInitialValues, getObservations } from "@/helpers";
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
import { LegAbnormalityImage } from "@/components/svgImages/legAbnormality";
import {
  AbdomenImage,
  AbdomenImageWithOtherForm,
} from "@/components/svgImages";
import { Box, Typography } from "@mui/material";
import { useSubmitEncounter } from "@/hooks/useSubmitEncounter";
import { getDateTime } from "@/helpers/dateTime";

type Prop = {
  onSubmit: () => void;
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
    label: "Does the patient need intravenous access",
  },
  traumatizedInfo: {
    name: concepts.IS_PATIENT_TRAUMATIZED,
    label: "Is the patient injured",
  },

  abnormalitiesInfo: {
    name: concepts.IS_THERE_ANY_OTHER_ABNOMALITIES,
    label: "Is there any other abnormalities?",
  },
  capillaryInfo: {
    name: concepts.CAPILLARY_REFILL_TIME,
    label: "Capillary refill time",
  },
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
  reasonNotDone: {
    name: concepts.DESCRIPTION,
    label: "Reason Not Done",
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
    .number()
    .min(30)
    .max(300)
    .label(form.bloodPressureSystolic.label),
  [form.bloodPressureDiastolic.name]: yup
    .number()
    .min(10)
    .max(200)
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
  [form.reasonNotDone.name]: yup.string().label(form.reasonNotDone.label),
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
  { label: "Normal", value: concepts.NORMAL },
  { label: "Pale", value: concepts.PALE },
  { label: "Cyanosis", value: concepts.CYANOSIS },
];

const pulseRates = [
  { label: "Weak", value: concepts.WEAK },
  { label: "Strong, Regular", value: concepts.STRONG_REGULAR },
  { label: "Irregular", value: concepts.IRREGULAR },
];

const capillaryRefillTimes = [
  { label: "Less than 3 seconds", value: concepts.LESS_THAN_3_SECONDS },
  { label: "3 seconds", value: concepts.THREE_SECONDS },
  { label: "More than 3 seconds", value: concepts.MORE_THAN_THREE_SECONDS },
];

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

const notDoneReasons = [
  { label: "Patient uncooperative", id: concepts.PATIENT_UNCOOPERATIVE },
  { label: "Machine not available", id: concepts.MACHINE_NOT_AVAILABLE },
  { label: "Batteries not available", id: concepts.BATTERIES_NOT_AVAILABLE },
  {
    label: "No inappropriately sized cuff",
    id: concepts.INAPPROPRIATELY_SIZED_CUFF,
  },
  { label: "No power supply", id: concepts.NO_POWER_SUPPLY },
  { label: "Other", id: concepts.OTHER },
];

export const Circulation = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [abdomenOtherImage, setAbdomenOtherImage] = useState<Array<any>>([]);
  const [legImage, setLegImage] = useState<Array<any>>([]);

  const { handleSubmit, isLoading, isSuccess } = useSubmitEncounter(
    encounters.CIRCULATION_ASSESSMENT,
    onSubmit
  );
  const handleSubmitForm = async (values: any) => {
    await handleSubmit(getObservations(values, getDateTime()), [
      ...abdomenOtherImage,
      ...legImage,
    ]);
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmitForm}
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
              multiline
              rows={3}
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
              { label: "Done", value: concepts.DONE },
              { label: "Not Done", value: concepts.NOT_DONE },
              { label: "BP Unrecordable", value: concepts.BP_NOT_RECORDABLE },
            ]}
          />
        </FieldsContainer>
        {formValues[form.bloodPressureMeasured.name] == concepts.NOT_DONE && (
          <SearchComboBox
            multiple={false}
            name={form.reasonNotDone.name}
            label={form.reasonNotDone.label}
            options={notDoneReasons}
          />
        )}
        {formValues[form.bloodPressureMeasured.name] ==
          concepts.BP_NOT_RECORDABLE && (
          <>
            <TextInputField
              sx={{ m: 0, width: "100%" }}
              name={form.reasonNotRecorded.name}
              label={form.reasonNotRecorded.label}
              id={form.reasonNotRecorded.name}
            />
          </>
        )}
        {formValues[form.bloodPressureMeasured.name] == concepts.DONE && (
          <>
            <br />
            <FieldsContainer mr="1ch">
              <TextInputField
                sx={{ width: "100%" }}
                unitOfMeasure="mmHg"
                name={form.bloodPressureSystolic.name}
                label={form.bloodPressureSystolic.label}
                id={form.bloodPressureSystolic.name}
              />
              <TextInputField
                sx={{ width: "100%" }}
                unitOfMeasure="mmHg"
                name={form.bloodPressureDiastolic.name}
                label={form.bloodPressureDiastolic.label}
                id={form.bloodPressureDiastolic.name}
              />
            </FieldsContainer>
            {formValues[form.bloodPressureSystolic.name] &&
              formValues[form.bloodPressureDiastolic.name] && (
                <>
                  <Box>
                    <Typography variant="subtitle1">
                      Mean Arterial Pressure:{" "}
                      {(Number(formValues[form.bloodPressureDiastolic.name]) *
                        2 +
                        Number(formValues[form.bloodPressureSystolic.name])) /
                        3}{" "}
                      mmHg
                    </Typography>
                  </Box>
                </>
              )}
            <br />
          </>
        )}
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Trauma">
        <RadioGroupInput
          row
          name={form.traumatizedInfo.name}
          label={form.traumatizedInfo.label}
          options={radioOptions}
        />
        {formValues[form.traumatizedInfo.name] == YES && (
          <>
            <RadioGroupInput
              row
              name={form.pelvisInfo.name}
              label={form.pelvisInfo.label}
              options={radioOptions}
            />
            {formValues[form.pelvisInfo.name] == YES && (
              <>
                <NotificationContainer message="apply pelvic binder" />
              </>
            )}
            <RadioGroupInput
              row
              name={form.femurAndTibiaNormalInfo.name}
              label={form.femurAndTibiaNormalInfo.label}
              options={radioOptions}
            />

            {formValues[form.femurAndTibiaNormalInfo.name] == NO && (
              <>
                <br />
                <LegAbnormalityImage
                  imageSection={form.femurAndTibiaNormalInfo.name}
                  imageEncounter={encounters.CIRCULATION_ASSESSMENT}
                  onValueChange={setLegImage}
                />
                <br />
              </>
            )}
          </>
        )}
      </FormFieldContainerLayout>

      <FormFieldContainerLayout title="Intravenous">
        <RadioGroupInput
          name={form.intravenousAccess.name}
          label={form.intravenousAccess.label}
          options={radioOptions}
        />

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
            <AbdomenImageWithOtherForm
              imageEncounter={encounters.CIRCULATION_ASSESSMENT}
              imageSection={form.abnormalitiesInfo.name}
              onValueChange={setAbdomenOtherImage}
            />
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
