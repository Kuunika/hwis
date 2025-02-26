import {
  FormDatePicker,
  FormTimePicker,
  NotificationContainer,
} from "@/components";
import { NO, YES, concepts, encounters } from "@/constants";
import React, { useEffect, useState } from "react";
import {
  FieldsContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import * as Yup from "yup";

import {
  LungImage,
  LungBackImage,
  LungRightSideImage,
  LungLeftSideImage,
  ChestLung,
} from "@/components/svgImages";
import { flattenImagesObs, getInitialValues, getObservations } from "@/helpers";
import { useSubmitEncounter } from "@/hooks/useSubmitEncounter";
import { getDateTime } from "@/helpers/dateTime";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import ComponentSlider from "@/components/slider/slider";

const form = {
  isPatientBreathing: {
    name: concepts.IS_BREATHING_ABNORMAL,
    label: "Is Patient Breathing",
  },
  startTimeIntervention: {
    name: concepts.START_TIME,
    label: "Start Time",
  },
  finishTimeIntervention: {
    name: concepts.END_TIME,
    label: "End Time",
  },
  deviceForIntervention: {
    name: concepts.DEVICE_USED,
    label: "Device used for intervention",
  },
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate",
  },
  oxygenSaturation: {
    name: concepts.OXYGEN_SATURATION,
    label: "Oxygen Saturation",
  },
  oxygenNeeded: {
    name: concepts.PATIENT_NEED_OXYGEN,
    label: "Patient Need Oxygen",
  },
  oxygenGiven: {
    name: concepts.OXYGEN_GIVEN,
    label: "Oxygen Given",
  },
  oxygenSource: {
    name: concepts.OXYGEN_SOURCE,
    label: "Oxygen Source",
  },
  deviceUsed: {
    name: concepts.DEVICE_USED,
    label: "Device Used",
  },
  isTracheaCentral: {
    name: concepts.IS_TRACHEA_CENTRAL,
    label: "Is Trachea Central",
  },
  deviationSide: {
    name: concepts.SIDE_DEVIATED,
    label: "Which side is it deviated to",
  },
  chestWallAbnormality: {
    name: concepts.CHEST_WALL_ABNORMALITY,
    label: "Chest Wall Abnormality",
  },
  chestExpansion: {
    name: concepts.CHEST_EXPANSION,
    label: "Chest Expansion",
  },
  additionalNotes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
  descriptionAbnormality: {
    name: concepts.DESCRIPTION,
    label: "Description of Abnormality",
  },
  // otherAbnormality: {
  //   name: "otherAbnormality",
  //   label: "Other Abnormality",
  // },
  percussion: {
    name: concepts.PERCUSSION,
    label: "Percussion",
  },
  breathSounds: {
    name: concepts.BREATHING_SOUNDS,
    label: "Breath Sounds",
  },
};

const schema = Yup.object().shape({
  [form.isPatientBreathing.name]: Yup.string()
    .required()
    .label(form.isPatientBreathing.label),
  [form.startTimeIntervention.name]: Yup.string().label(
    form.startTimeIntervention.label
  ),
  [form.finishTimeIntervention.name]: Yup.string().label(
    form.finishTimeIntervention.label
  ),
  [form.deviceForIntervention.name]: Yup.string().label(
    form.deviceForIntervention.label
  ),
  [form.respiratoryRate.name]: Yup.number()
    .when(form.isPatientBreathing.name, (values: any, schema: any) => {
      if (values[0] == concepts.YES) {
        return schema.required();
      }
      return schema;
    })
    .label(form.respiratoryRate.label)
    .min(1)
    .max(70),
  [form.oxygenSaturation.name]: Yup.number()
    .when(form.isPatientBreathing.name, (values: any, schema: any) => {
      if (values[0] == concepts.YES) {
        return schema.required();
      }
      return schema;
    })
    .label(form.oxygenSaturation.label)
    .min(10)
    .max(100),
  [form.oxygenNeeded.name]: Yup.string().label(form.oxygenNeeded.label),
  [form.oxygenGiven.name]: Yup.number()
    .when(form.oxygenNeeded.name, (values: any, schema: any) => {
      if (values[0] == concepts.YES) {
        return schema.required();
      }
      return schema;
    })
    .min(1)
    .max(15)
    .label(form.oxygenGiven.label),
  [form.oxygenSource.name]: Yup.string()
    .when(form.oxygenNeeded.name, (values: any, schema: any) => {
      if (values[0] == concepts.YES) {
        return schema.required();
      }
      return schema;
    })
    .label(form.oxygenSource.label),
  [form.deviceUsed.name]: Yup.string()
    .when(form.oxygenNeeded.name, (values: any, schema: any) => {
      if (values[0] == concepts.YES) {
        return schema.required();
      }
      return schema;
    })
    .label(form.deviceUsed.label),
  [form.isTracheaCentral.name]: Yup.string().label(form.isTracheaCentral.label),
  [form.deviationSide.name]: Yup.string().label(form.deviationSide.label),
  // [form.otherAbnormality.name]: Yup.string().label(form.otherAbnormality.label),
  [form.percussion.name]: Yup.string().label(form.percussion.label),
  // [form.descriptionAbnormality.name]: Yup.string().label(
  //   form.descriptionAbnormality.label
  // ),
  [form.chestWallAbnormality.name]: Yup.string().label(
    form.chestWallAbnormality.label
  ),
  [form.breathSounds.name]: Yup.string()
    .required()
    .label(form.breathSounds.label),
});

const initialsValues = getInitialValues(form);

type Prop = {
  onSubmit: () => void;
};

const sourceOxygen = [
  {
    label: "Concentrator",
    value: concepts.CONCENTRATOR,
  },
  {
    label: "Cylinder",
    value: concepts.CYLINDER,
  },
  {
    label: "Piped Oxygen",
    value: concepts.PIPED_OXYGEN,
  },
];

const deviceUsed = [
  {
    label: "Nasal Prongs",
    id: concepts.NASAL_PRONGS,
  },
  {
    label: "Simple face mask",
    id: concepts.SIMPLE_FACE_MASK,
  },
  {
    label: "Venturi face mask",
    id: concepts.VENTURI_FACE_MASK,
  },
  {
    label: "Face mask with nebulising chamber",
    id: concepts.NEBULISING_CHAMBER,
  },
  {
    label: "Nonrebreather face mask",
    id: concepts.NON_REBREATHER,
  },
  {
    label: "Noninvasive ventilation mask",
    id: concepts.NON_INVASIVE_VENTILATION_MASK,
  },
  {
    label: "Laryngeal mask airway",
    id: concepts.LARYNGEAL,
  },
  {
    label: "Endotracheal tube",
    id: concepts.ENDOTRACHEAL,
  },
];

const descriptionOfAbnormality = [
  { id: concepts.WOUND, label: "Wound" },
  { id: concepts.FLAIL_CHEST, label: "Flail Chest" },
  { id: concepts.SURGICAL_EMPHAYEMA, label: "Surgical Emphayema" },
  { id: concepts.DEFORMITY, label: "Rib Deformity" },
  { id: concepts.OTHER, label: "Other" },
];

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];
export const BreathingForm = ({ onSubmit }: Prop) => {
  const [chestExpansionImagesEnc, setChestExpansionImagesEnc] = useState<
    Array<any>
  >([]);
  const [formValues, setFormValues] = useState<any>({});
  const [chestAbnormalitiesImage, setChestAbnormalitiesImage] = useState<
    Array<any>
  >([]);
  const [percussionImage, setPercussionImage] = useState<Array<any>>([]);

  const { handleSubmit, isLoading, isSuccess } = useSubmitEncounter(
    encounters.BREATHING_ASSESSMENT,
    onSubmit
  );

  const [lungLeft, setLungLeft] = useState<Array<any>>([]);
  const [lungRight, setLungRight] = useState<Array<any>>([]);
  const [lungFront, setLungFront] = useState<Array<any>>([]);
  const [lungBack, setLungBack] = useState<Array<any>>([]);

  const handleSubmitForm = async (values: any) => {
    const formValues = { ...values };

    const obs = [
      {
        concept: form.chestWallAbnormality.name,
        value: formValues[form.chestWallAbnormality.name],
        obsDatetime: getDateTime(),
        groupMembers: flattenImagesObs(chestAbnormalitiesImage),
      },
      {
        concept: form.percussion.name,
        value: formValues[form.percussion.name],
        obsDatetime: getDateTime(),
        groupMembers: flattenImagesObs(percussionImage),
      },
      {
        concept: form.chestExpansion.name,
        value: formValues[form.chestExpansion.name],
        obsDatetime: getDateTime(),
        groupMembers: flattenImagesObs(chestExpansionImagesEnc),
      },
      {
        concept: concepts.SITE,
        value: "Lung Left",
        obsDatetime: getDateTime(),
        groupMembers: flattenImagesObs(lungLeft),
      },
      {
        concept: concepts.SITE,
        value: "Lung Right",
        obsDatetime: getDateTime(),
        groupMembers: flattenImagesObs(lungRight),
      },
      {
        concept: concepts.SITE,
        value: "Lung Front",
        obsDatetime: getDateTime(),
        groupMembers: flattenImagesObs(lungFront),
      },
      {
        concept: concepts.SITE,
        value: "Lung Back",
        obsDatetime: getDateTime(),
        groupMembers: flattenImagesObs(lungBack),
      },
      {
        concept: concepts.SITE,
        value: "Lung Front",
        obsDatetime: getDateTime(),
        groupMembers: flattenImagesObs(lungFront),
      },
    ];

    const devices = formValues[form.deviceForIntervention.name];
    let devicesObs: any = [];

    if (Array.isArray(devices)) {
      devicesObs = devices.map((device) => {
        return {
          concept: form.deviceForIntervention.name,
          value: device.id,
          obsDateTime: getDateTime(),
        };
      });
    }

    delete formValues[form.chestWallAbnormality.name];
    delete formValues[form.percussion.name];
    delete formValues[form.deviceUsed.name];
    delete formValues[form.chestExpansion.name];

    await handleSubmit([
      ...getObservations(formValues, getDateTime()),
      ...obs,
      ...devicesObs,
    ]);
  };

  useEffect(() => {
    console.log({ lungLeft, lungRight, lungFront, lungBack });
  }, [lungLeft, lungRight, lungFront, lungBack]);

  const breathSoundsSlides = [
    {
      id: 1,
      label: "Lung Left",
      content: <LungRightSideImage onValueChange={setLungLeft} />,
    },
    {
      id: 2,
      label: "Lung Right",
      content: <LungLeftSideImage onValueChange={setLungRight} />,
    },
    {
      id: 3,
      label: "Lung Front",
      content: <LungImage breathSounds={true} onValueChange={setLungFront} />,
    },
    {
      id: 4,
      label: "Lung Back",
      content: (
        <LungBackImage breathSounds={true} onValueChange={setLungBack} />
      ),
    },
  ];

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      <FormikInit
        validationSchema={schema}
        initialValues={initialsValues}
        onSubmit={handleSubmitForm}
      >
        <FormValuesListener getValues={setFormValues} />

        <FormFieldContainerLayout title="Breathing">
          <FieldsContainer>
            <RadioGroupInput
              row
              name={form.isPatientBreathing.name}
              label={form.isPatientBreathing.label}
              options={radioOptions}
            />
          </FieldsContainer>
        </FormFieldContainerLayout>

        {formValues[form.isPatientBreathing.name] == NO && (
          <FormFieldContainerLayout title="">
            <NotificationContainer message="Assist with ventilation, Manually assist patient breathing" />

            <FieldsContainer mr="1ch">
              {/* <FormDatePicker  /> */}
              <FormTimePicker
                sx={{ width: "100%", my: "1ch" }}
                name={form.startTimeIntervention.name}
                label={form.startTimeIntervention.label}
                // id={form.startTimeIntervention.name}
              />
              <FormTimePicker
                sx={{ width: "100%", my: "1ch" }}
                name={form.finishTimeIntervention.name}
                label={form.finishTimeIntervention.label}
                // id={form.finishTimeIntervention.name}
              />
            </FieldsContainer>

            <SearchComboBox
              name={form.deviceForIntervention.name}
              label={form.deviceForIntervention.label}
              sx={{ width: "100%" }}
              multiple
              options={[
                { label: "Bag and mask", id: concepts.BAG_AND_MASK },
                {
                  label: "Laryngeal Mask Airway and bag",
                  id: concepts.LARYNGEAL_MASK_AIRWAY_AND_BAG,
                },
                {
                  label: "Endotracheal tube (ETT)",
                  id: concepts.ENDOTRACHEAL,
                },
              ]}
            />
          </FormFieldContainerLayout>
        )}

        {formValues[form.isPatientBreathing.name] == YES && (
          <>
            <FormFieldContainerLayout title="Respiratory and Oxygen">
              <FieldsContainer mr="1ch">
                <TextInputField
                  sx={{ width: "100%" }}
                  unitOfMeasure="bpm"
                  name={form.respiratoryRate.name}
                  label={form.respiratoryRate.label}
                  id={form.respiratoryRate.name}
                />
                <TextInputField
                  sx={{ width: "100%" }}
                  unitOfMeasure="%"
                  name={form.oxygenSaturation.name}
                  label={form.oxygenSaturation.label}
                  id={form.oxygenSaturation.name}
                />
              </FieldsContainer>
              <br />
              <FieldsContainer>
                <RadioGroupInput
                  name={form.oxygenNeeded.name}
                  label={form.oxygenNeeded.label}
                  options={radioOptions}
                />
                {formValues[form.oxygenNeeded.name] == YES && (
                  <RadioGroupInput
                    name={form.oxygenSource.name}
                    label={form.oxygenSource.label}
                    options={sourceOxygen}
                  />
                )}
              </FieldsContainer>

              {formValues[form.oxygenNeeded.name] == YES && (
                <>
                  <TextInputField
                    name={form.oxygenGiven.name}
                    label={form.oxygenGiven.label}
                    id={form.oxygenGiven.name}
                    sx={{ width: "100%", m: 0 }}
                    unitOfMeasure="L/min"
                  />
                  <br />
                  <br />
                  <SearchComboBox
                    name={form.deviceUsed.name}
                    label={form.deviceUsed.label}
                    options={deviceUsed}
                    multiple={false}
                  />
                  <br />
                </>
              )}
            </FormFieldContainerLayout>

            <FormFieldContainerLayout last={true} title="Trachea and Chest">
              <FieldsContainer>
                <RadioGroupInput
                  name={form.isTracheaCentral.name}
                  label={form.isTracheaCentral.label}
                  options={radioOptions}
                />
                <RadioGroupInput
                  name={form.chestWallAbnormality.name}
                  label={form.chestWallAbnormality.label}
                  options={radioOptions}
                />
              </FieldsContainer>
              {formValues[form.isTracheaCentral.name] == NO && (
                <FieldsContainer>
                  <>
                    <RadioGroupInput
                      name={form.deviationSide.name}
                      label={form.deviationSide.label}
                      options={[
                        { label: "Left", value: concepts.LEFT },
                        { label: "Right", value: concepts.RIGHT },
                      ]}
                    />
                  </>
                </FieldsContainer>
              )}
              {formValues[form.chestWallAbnormality.name] == YES && (
                <>
                  <br />
                  <NotificationContainer message="Diagram to select area" />
                  <LungImage
                    imageEncounter={encounters.BREATHING_ASSESSMENT}
                    imageSection={form.chestWallAbnormality.name}
                    onValueChange={setChestAbnormalitiesImage}
                  />
                  <br />
                  <FieldsContainer>
                    {/* <SearchComboBox
                    name={form.descriptionAbnormality.name}
                    label={form.descriptionAbnormality.label}
                    options={descriptionOfAbnormality}
                  /> */}
                    {formValues[form.descriptionAbnormality.name] ==
                      concepts.OTHER && (
                      <FieldsContainer>
                        <TextInputField
                          multiline
                          rows={3}
                          name={form.descriptionAbnormality.name}
                          label={form.descriptionAbnormality.label}
                          id={form.descriptionAbnormality.name}
                        />
                      </FieldsContainer>
                    )}
                  </FieldsContainer>
                </>
              )}
              <br />
              <FieldsContainer>
                <RadioGroupInput
                  name={form.chestExpansion.name}
                  label={form.chestExpansion.label}
                  options={[
                    { label: "Normal", value: concepts.NORMAL },
                    { label: "Reduced", value: concepts.REDUCED },
                  ]}
                />
                <RadioGroupInput
                  name={form.percussion.name}
                  label={form.percussion.label}
                  options={[
                    { label: "Normal", value: concepts.NORMAL },
                    { label: "Abnormal", value: concepts.ABNORMAL },
                  ]}
                />
              </FieldsContainer>
              {formValues[form.chestExpansion.name] == concepts.REDUCED && (
                <FieldsContainer>
                  <ChestLung
                    onValueChange={setChestExpansionImagesEnc}
                    imageEncounter={encounters.CHEST_ASSESSMENT}
                    imageSection={form.chestExpansion.name}
                    selectable={true}
                  />
                </FieldsContainer>
              )}
              <br />
              {formValues[form.percussion.name] == concepts.ABNORMAL && (
                <FieldsContainer>
                  <LungBackImage
                    imageSection={form.percussion.name}
                    imageEncounter={encounters.BREATHING_ASSESSMENT}
                    percussion={true}
                    onValueChange={setPercussionImage}
                  />
                </FieldsContainer>
              )}
              <FieldsContainer>
                <RadioGroupInput
                  name={form.breathSounds.name}
                  label={form.breathSounds.label}
                  options={[
                    { label: "Normal", value: concepts.NORMAL },
                    { label: "Abnormal", value: concepts.ABNORMAL },
                  ]}
                />
              </FieldsContainer>
              {formValues[form.breathSounds.name] == concepts.ABNORMAL && (
                <>
                  <br />
                  <ComponentSlider slides={breathSoundsSlides} />
                </>
              )}
              <FieldsContainer>
                <TextInputField
                  multiline
                  rows={3}
                  sx={{ m: 0, width: "100%" }}
                  name={form.additionalNotes.name}
                  label={form.additionalNotes.label}
                  id={form.additionalNotes.name}
                />
              </FieldsContainer>
            </FormFieldContainerLayout>
          </>
        )}
      </FormikInit>
    </ContainerLoaderOverlay>
  );
};
