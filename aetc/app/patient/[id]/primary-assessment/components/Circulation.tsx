"use client";
import { NotificationContainer, SearchComboBox } from "@/components";
import { NO, YES, concepts, encounters } from "@/constants";
import {
  flattenImagesObs,
  getInitialValues,
  getObservations,
  mapSearchComboOptionsToConcepts,
} from "@/helpers";
import React, { useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
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
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { CPRDialogForm } from "./cprDialogForm";

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
    label: "Does the patient have a pulse",
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
  // anyOtherAbnormalitiesOnAbdomen: {
  //   name: concepts.IS_THERE_OTHER_OBDONORMALITIES,
  //   label: "Is There Any Other Abnormalities on the Abdomen",
  // },
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
  mucousAbnormal: {
    name: concepts.MUCOUS_ABNORMAL,
    label: "Mucous Abnormal",
  },
  bloodPressureNotDoneOther: {
    name: concepts.SPECIFY,
    label: "Specify",
  },
  siteOfCannulation: {
    name: concepts.CANNULATION_SITE,
    label: "Cannulation Site",
  },
  diagramCannulationSite: {
    name: concepts.DIAGRAM_CANNULATION_SITE,
    label: "Cannulation Site",
  },
  pulse: {
    name: concepts.PULSE_RATE,
    label: "Pulse",
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
  [form.catheterInfo.name]: yup.array().label(form.catheterInfo.label),
  [form.femurAndTibiaNormalInfo.name]: yup
    .string()

    .label(form.femurAndTibiaNormalInfo.label),

  [form.anyOtherAbnormalities.name]: yup
    .string()
    .label(form.anyOtherAbnormalities.label),
  // [form.anyOtherAbnormalitiesOnAbdomen.name]: yup
  //   .string()
  //   .label(form.anyOtherAbnormalitiesOnAbdomen.label),
  [form.additionalNotes.name]: yup.string().label(form.additionalNotes.label),
  [form.assessPeripheries.name]: yup
    .string()
    .label(form.assessPeripheries.label),
  [form.reasonNotDone.name]: yup.string().label(form.reasonNotDone.label),
  [form.mucousAbnormal.name]: yup.array().label(form.mucousAbnormal.label),
  [form.bloodPressureNotDoneOther.name]: yup
    .string()
    .label(form.bloodPressureNotDoneOther.label),
  [form.siteOfCannulation.name]: yup
    .array()
    .label(form.siteOfCannulation.label),
  [form.diagramCannulationSite.name]: yup
    .array()
    .label(form.diagramCannulationSite.label),
  [form.pulse.name]: yup.number().label(form.pulse.label),
});

const initialValues = getInitialValues(form);

const sizeOfCatheter = [
  { label: "14G", id: concepts.G14 },
  { label: "16G", id: concepts.G16 },
  { label: "18G", id: concepts.G18 },
  { label: "20G", id: concepts.G20 },
  { label: "22G", id: concepts.G22 },
  { label: "Central Line", id: concepts.CENTRAL_LINE },
];
const sizeOfCapillary = [
  { label: "Less than 3 seconds", value: "Less than 3 seconds" },
  { label: "3 Seconds", value: "3 Seconds" },
];
const sizeOfMucous = [
  { label: "Normal", value: concepts.NORMAL },
  { label: "Abnormal", value: concepts.ABNORMAL },
  // { label: "Pale", value: concepts.PALE },
  // { label: "Cyanosis", value: concepts.CYANOSIS },
];
const mucousAbnormal = [
  { label: "Pale", id: concepts.PALE },
  { label: "Dry", id: concepts.DRY },
  { label: "Cyanosis", id: concepts.CYANOSIS },
  { label: "Jaundice", id: concepts.JAUNDICE },
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

const sitesOfCannulation = [
  { label: "Left", id: concepts.LEFT },
  { label: "Right", id: concepts.RIGHT },
  // { label: "Central Line", id: concepts.CENTRAL_LINE },
];
const diagramSitesOfCannulation = [
  { label: "Antecubital fossa", id: concepts.ANTECUBITAL_FOSSA },
  { label: "Hand", id: concepts.HAND },
  { label: "Wrist", id: concepts.WRIST },
  { label: "Forearm", id: concepts.WRIST },
  { label: "Foot", id: concepts.FOOT },
  { label: "External Jugular", id: concepts.EXTERNAL_JUGULAR },
];

export const Circulation = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [abdomenOtherImage, setAbdomenOtherImage] = useState<Array<any>>([]);
  const [legImage, setLegImage] = useState<Array<any>>([]);
  const [abdomenImage, setAbdomenImage] = useState<Array<any>>([]);
  const [cprDialog, setCprDialog] = useState(false);
  // const [bloodNotDoneOther, setBloodNotDoneOther] = useState(false);

  const { handleSubmit, isLoading, isSuccess } = useSubmitEncounter(
    encounters.CIRCULATION_ASSESSMENT,
    onSubmit
  );
  const handleSubmitForm = async (values: any) => {
    const formValues = { ...values };

    const obs = [
      {
        concept: form.abnormalitiesInfo.name,
        value: formValues[form.abnormalitiesInfo.name],
        obsDatetime: getDateTime(),
        group_members: flattenImagesObs(abdomenOtherImage),
      },
      {
        concept: form.femurAndTibiaNormalInfo.name,
        value: formValues[form.femurAndTibiaNormalInfo.name],
        obsDatetime: getDateTime(),
        group_members: flattenImagesObs(legImage),
      },
      // {
      //   concept: form.anyOtherAbnormalitiesOnAbdomen.name,
      //   value: formValues[form.anyOtherAbnormalitiesOnAbdomen.name],
      //   obsDatetime: getDateTime(),
      //   group_members: flattenImagesObs(abdomenImage),
      // },
    ];

    console.log(formValues[form.siteOfCannulation.name]);
    console.log(formValues[form.diagramCannulationSite.name]);
    const mucusAbnormalitiesObs = mapSearchComboOptionsToConcepts(
      formValues[form.mucousAbnormal.name],
      form.mucousAbnormal.name,
      getDateTime()
    );
    const sizeOfCatheterObs = mapSearchComboOptionsToConcepts(
      formValues[form.mucousAbnormal.name],
      form.mucousAbnormal.name,
      getDateTime()
    );
    const siteOfCannulationObs = mapSearchComboOptionsToConcepts(
      formValues[form.siteOfCannulation.name],
      form.siteOfCannulation.name,
      getDateTime()
    );

    const diagramCannulationSiteObs = mapSearchComboOptionsToConcepts(
      formValues[form.diagramCannulationSite.name],
      form.diagramCannulationSite.name,
      getDateTime()
    );

    delete formValues[form.abnormalitiesInfo.name];
    delete formValues[form.femurAndTibiaNormalInfo.name];
    delete formValues[form.mucousAbnormal.name];
    delete formValues[form.catheterInfo.name];
    delete formValues[form.siteOfCannulation.name];
    delete formValues[form.diagramCannulationSite.name];

    await handleSubmit([
      ...getObservations(formValues, getDateTime()),
      ...obs,
      ...mucusAbnormalitiesObs,
      ...sizeOfCatheterObs,
      ...siteOfCannulationObs,
      ...diagramCannulationSiteObs,
    ]);
  };
  const checkCanulationSite = (valueArray: any, value: any) => {
    if (Array.isArray(valueArray)) {
      return valueArray.find((item) => item.id == value);
    }
    return false;
  };
  return (
    <ContainerLoaderOverlay loading={isLoading}>
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
              getValue={(value) => {
                if (value == NO) {
                  setCprDialog(true);
                }
              }}
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
              <CPRDialogForm
                open={cprDialog}
                onClose={() => setCprDialog(false)}
              />
            </>
          )}

          {formValues[form.pulseInfo.name] == YES && (
            <>
              <br />
              <TextInputField
                name={form.pulse.name}
                id={form.pulse.name}
                label={form.pulse.label}
                sx={{ width: "100%" }}
              />
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
          {formValues[form.mucousMembranesInfo.name] == concepts.ABNORMAL && (
            <SearchComboBox
              label="Mucus Abnormal"
              name={form.mucousAbnormal.name}
              options={mucousAbnormal}
            />
          )}
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
            <>
              <SearchComboBox
                multiple={false}
                name={form.reasonNotDone.name}
                label={form.reasonNotDone.label}
                options={notDoneReasons}
              />
              {formValues[form.reasonNotDone.name] == concepts.OTHER && (
                <TextInputField
                  multiline
                  rows={3}
                  name={form.bloodPressureNotDoneOther.name}
                  id={form.bloodPressureNotDoneOther.name}
                  label={form.bloodPressureNotDoneOther.label}
                  sx={{ width: "100%", mt: "1ch" }}
                />
              )}
            </>
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
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color:
                          Math.round(
                            (Number(
                              formValues[form.bloodPressureDiastolic.name]
                            ) *
                              2 +
                              Number(
                                formValues[form.bloodPressureSystolic.name]
                              )) /
                              3
                          ) < 65
                            ? "red"
                            : "inherit", // Use default text color if MAP is 65 or above
                      }}
                    >
                      Mean Arterial Pressure:{" "}
                      {Math.round(
                        (Number(formValues[form.bloodPressureDiastolic.name]) *
                          2 +
                          Number(formValues[form.bloodPressureSystolic.name])) /
                          3
                      )}{" "}
                      mmHg
                    </Typography>
                  </Box>
                )}

              <br />
            </>
          )}
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Circulation Specific Trauma">
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

              <SearchComboBox
                multiple
                name={form.catheterInfo.name}
                label={form.catheterInfo.label}
                options={sizeOfCatheter}
              />
              <br />
              <SearchComboBox
                multiple
                name={form.siteOfCannulation.name}
                label={form.siteOfCannulation.label}
                options={sitesOfCannulation}
              />
              {checkCanulationSite(
                formValues[form.siteOfCannulation.name],
                concepts.LEFT
              ) && (
                <>
                  <Typography my={2} variant="h6">
                    Left
                  </Typography>
                  <SearchComboBox
                    name={form.diagramCannulationSite.name}
                    label={form.diagramCannulationSite.label}
                    options={[
                      ...diagramSitesOfCannulation,
                      ...(checkCanulationSite(
                        formValues[form.catheterInfo.name],
                        concepts.CENTRAL_LINE
                      )
                        ? [
                            { id: concepts.FEMORAL, label: "Femoral" },
                            { id: concepts.SUBCLAVIAN, label: "Subclavian" },
                            {
                              id: concepts.INTERNAL_JUGULAR,
                              label: "Internal Jugular",
                            },
                          ]
                        : []),
                    ]}
                  />
                </>
              )}

              {checkCanulationSite(
                formValues[form.siteOfCannulation.name],
                concepts.RIGHT
              ) && (
                <>
                  <Typography my={2} variant="h6">
                    Right
                  </Typography>
                  <SearchComboBox
                    name={form.diagramCannulationSite.name}
                    label={form.diagramCannulationSite.label}
                    options={[
                      ...diagramSitesOfCannulation,
                      ...(checkCanulationSite(
                        formValues[form.catheterInfo.name],
                        concepts.CENTRAL_LINE
                      )
                        ? [
                            { id: concepts.FEMORAL, label: "Femoral" },
                            { id: concepts.SUBCLAVIAN, label: "Subclavian" },
                            {
                              id: concepts.INTERNAL_JUGULAR,
                              label: "Internal Jugular",
                            },
                          ]
                        : []),
                    ]}
                  />
                </>
              )}

              <br />
            </>
          )}
        </FormFieldContainerLayout>
        <FormFieldContainerLayout
          last={true}
          title="Circulation Specific Abdominal Findings"
        >
          <FieldsContainer sx={{ alignItems: "flex-start" }}>
            <RadioGroupInput
              name={form.abdnomenDistention.name}
              label={form.abdnomenDistention.label}
              options={radioOptions}
            />
            {/* <RadioGroupInput
              name={form.anyOtherAbnormalitiesOnAbdomen.name}
              label={form.anyOtherAbnormalitiesOnAbdomen.label}
              options={radioOptions}
            /> */}
            {/* </FieldsContainer> */}
            {/* {formValues[form.anyOtherAbnormalitiesOnAbdomen.name] == YES && (
            <>
              <AbdomenImage onValueChange={setAbdomenImage} />
            </>
          )} */}
            {/* <FieldsContainer> */}
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
    </ContainerLoaderOverlay>
  );
};
