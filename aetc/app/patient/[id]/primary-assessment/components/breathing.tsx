import {
  FormDatePicker,
  FormTimePicker,
  NotificationContainer,
} from "@/components";
import { NO, YES, concepts, encounters } from "@/constants";
import React, { useState } from "react";
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
  flattenImagesObs,
  getInitialValues,
  getObservations,
  mapSubmissionToCodedArray,
} from "@/helpers";
import { useSubmitEncounter } from "@/hooks/useSubmitEncounter";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import ComponentSlider from "@/components/slider/slider";
import { LungFrontMaleImage } from "@/components/svgImages/LungFrontMale";
import { LungFrontFemaleImage } from "@/components/svgImages/LungFrontFemale";
import { getActivePatientDetails } from "@/hooks";
import { LungBackMaleImage } from "@/components/svgImages/LungBackMale";
import { LungBackFemaleImage } from "@/components/svgImages/LungBackFemale";
import { LungLeftFemaleImage } from "@/components/svgImages/LungLeftFemale";
import { LungRightMaleImage } from "@/components/svgImages/LungRightMale";
import { LungLeftMaleImage } from "@/components/svgImages/LungLeftMale";
import { LungRightFemaleImage } from "@/components/svgImages/LungRightFemale";
import { useServerTime } from "@/contexts/serverTimeContext";

const form = {
  isPatientBreathing: {
    name: concepts.IS_BREATHING_ABNORMAL,
    label: "Is Patient Breathing",
    type: "string",
    options: {
      [YES]: "breathing",
      [NO]: "not breathing",
    },
    children: [
      {
        concept: concepts.START_TIME,
        label: "Start Time",
      },
      {
        concept: concepts.END_TIME,
        label: "End Time",
      },
      {
        multiple:true,
        type:"string",
        concept: concepts.DEVICE_USED_FOR_INTERVENTION,
        label: "Device used for intervention",
      },
      {
        concept: concepts.RESPIRATORY_RATE,
        label: "Respiratory Rate",
      },
      {
        concept: concepts.OXYGEN_SATURATION,
        label: "Oxygen Saturation",
      },
      {
        concept: concepts.PATIENT_NEED_OXYGEN,
        label: "Patient Need Oxygen",
        children: [
          {
            concept: concepts.OXYGEN_SOURCE,
            label: "Oxygen Source",
          },
        ],
      },
      {
        concept: concepts.OXYGEN_GIVEN,
        label: "Oxygen Given",
      },
      {
        concept: concepts.DEVICE_USED,
        label: "Device Used",
      },
      {
        concept: concepts.IS_TRACHEA_CENTRAL,
        label: "Is Trachea Central",
      },
      {
        concept: concepts.SIDE_DEVIATED,
        label: "Which side is it deviated to",
      },
      {
        concept: concepts.CHEST_WALL_ABNORMALITY,
        label: "Chest Wall Abnormality",
        hasImages: true,        
      },
      {
        concept: concepts.CHEST_EXPANSION,
        label: "Chest Expansion",
      },
      {
        concept: concepts.ADDITIONAL_NOTES,
        label: "Additional Notes",
      },
      {
        concept: concepts.DESCRIPTION,
        label: "Description of Abnormality",
      },
      {
        concept: concepts.PERCUSSION,
        label: "Percussion",
      },
      {
        concept: concepts.BREATHING_SOUNDS,
        label: "Breath Sounds",
      },
    ],
  },
  startTimeIntervention: {
    child: true,
    name: concepts.START_TIME,
    label: "Start Time",
  },
  finishTimeIntervention: {
    child: true,
    name: concepts.END_TIME,
    label: "End Time",
  },
  deviceForIntervention: {
    child: true,
    multiple:true,
    name: concepts.DEVICE_USED_FOR_INTERVENTION,
    label: "Device used for intervention",
  },
  respiratoryRate: {
    child: true,
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate",
  },
  oxygenSaturation: {
    child: true,
    name: concepts.OXYGEN_SATURATION,
    label: "Oxygen Saturation",
  },
  oxygenNeeded: {
    child: true,
    name: concepts.PATIENT_NEED_OXYGEN,
    label: "Patient Need Oxygen",
  },
  oxygenGiven: {
    child: true,
    name: concepts.OXYGEN_GIVEN,
    label: "Oxygen Given",
  },
  oxygenSource: {
    child: true,
    name: concepts.OXYGEN_SOURCE,
    label: "Oxygen Source",
  },
  deviceUsed: {
    child: true,
    name: concepts.DEVICE_USED,
    label: "Device Used",
  },
  isTracheaCentral: {
    child: true,
    name: concepts.IS_TRACHEA_CENTRAL,
    label: "Is Trachea Central",
  },
  deviationSide: {
    child: true,
    name: concepts.SIDE_DEVIATED,
    label: "Which side is it deviated to",
  },
  chestWallAbnormality: {
    child: true,
    name: concepts.CHEST_WALL_ABNORMALITY,
    label: "Chest Wall Abnormality",
  },
  chestExpansion: {
    child: true,
    name: concepts.CHEST_EXPANSION,
    label: "Chest Expansion",
  },
  additionalNotes: {
    child: true,
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
  descriptionAbnormality: {
    child: true,
    name: concepts.DESCRIPTION,
    label: "Description of Abnormality",
  },
  percussion: {
    child: true,
    name: concepts.PERCUSSION,
    label: "Percussion",
  },
  breathSounds: {
    child: true,
    name: concepts.BREATHING_SOUNDS,
    label: "Breath Sounds",
  },
};


export const breathingFormConfig = form;

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
  [form.deviceForIntervention.name]: Yup.array().label(
    form.deviceForIntervention.label
  ),
  [form.respiratoryRate.name]: Yup.number()
    .min(0)
    .max(90)
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
    .min(20)
    .max(100)
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
  [form.breathSounds.name]: Yup.string().label(form.breathSounds.label),
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
  const { ServerTime } = useServerTime();
  const { gender } = getActivePatientDetails();
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
  const [isChecked, setIsChecked] = useState(false);

  const [lungLeft, setLungLeft] = useState<Array<any>>([]);
  const [lungRight, setLungRight] = useState<Array<any>>([]);
  const [lungFront, setLungFront] = useState<Array<any>>([]);
  const [lungBack, setLungBack] = useState<Array<any>>([]);

  const handleSubmitForm = async (values: any) => {
    const formValues = { ...values };

    const obsDatetime = ServerTime.getServerTimeString();

    const obs = [
      {
        concept: form.chestWallAbnormality.name,
        value: formValues[form.chestWallAbnormality.name],
        obsDatetime,
        groupMembers: flattenImagesObs(chestAbnormalitiesImage),
      },
      {
        concept: form.percussion.name,
        value: formValues[form.percussion.name],
        obsDatetime,
        groupMembers: flattenImagesObs(percussionImage),
      },
      {
        concept: form.chestExpansion.name,
        value: formValues[form.chestExpansion.name],
  
      
        obsDatetime,
        groupMembers: flattenImagesObs(chestExpansionImagesEnc),
      },
      {
        concept: concepts.SITE,
        value: "Lung Lateral Left",
        obsDatetime,
        groupMembers: flattenImagesObs(lungLeft),
      },
      {
        concept: concepts.SITE,
        value: "Lung Lateral Right",
        obsDatetime,
        groupMembers: flattenImagesObs(lungRight),
      },
      {
        concept: concepts.SITE,
        value: "Lung Anterior",
        obsDatetime,
        groupMembers: flattenImagesObs(lungFront),
      },
      {
        concept: concepts.SITE,
        value: "Lung Posterior",
        obsDatetime,
        groupMembers: flattenImagesObs(lungBack),
      },
      // {
      //   concept: concepts.SITE,
      //   value: "Lung Front",
      //   obsDatetime,
      //   groupMembers: flattenImagesObs(lungFront),
      // },
    ];

    const devices = formValues[form.deviceForIntervention.name];
    let devicesObs: any = [];

    if (Array.isArray(devices)) {
      devicesObs = devices.map((device) => {
        return {
          concept: form.deviceForIntervention.name,
          value: device.id,
          obsDatetime,
        };
      });
    }

    delete formValues[form.chestWallAbnormality.name];
    delete formValues[form.percussion.name];
    delete formValues[form.deviceUsed.name];
    delete formValues[form.chestExpansion.name];
    delete formValues[form.deviceForIntervention.name];

    await handleSubmit([
      ...mapSubmissionToCodedArray(form, formValues, obsDatetime),
      ...obs,
      ...devicesObs,
    ]);
  };

  const breathSoundsSlides = [
    {
      id: 1,
      label: "Lung Lateral Left",
      content:
        gender == "Female" ? (
          <LungLeftFemaleImage onValueChange={setLungLeft} />
        ) : (
          <LungLeftMaleImage onValueChange={setLungLeft} />
        ),
    },
    {
      id: 2,
      label: "Lung lateral right",
      content:
        gender == "Female" ? (
          <LungRightFemaleImage onValueChange={setLungRight} />
        ) : (
          <LungRightMaleImage onValueChange={setLungRight} />
        ),
    },
    {
      id: 3,
      label: "Lung Anterior",
      content:
        gender == "Female" ? (
          <LungFrontFemaleImage
            onValueChange={setLungFront}
            form="breathSounds"
          />
        ) : (
          <LungFrontMaleImage
            onValueChange={setLungFront}
            form="breathSounds"
          />
        ),
    },
    {
      id: 4,
      label: "Lung Posterior",
      content:
        gender == "Female" ? (
          <LungBackFemaleImage
            onValueChange={setLungBack}
            form="breathSounds"
          />
        ) : (
          <LungBackMaleImage onValueChange={setLungBack} form="breathSounds" />
        ),
    },
  ];

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      {/* <CheckBoxNext
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        onNext={(obs: any) => handleSubmit(obs)}
        title="Tick if breathing is normal and there are no abnormalities"
      /> */}
      {!isChecked && (
        <FormikInit
          validationSchema={schema}
          initialValues={initialsValues}
          onSubmit={handleSubmitForm}
          submitButtonText="Next"
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
                    row
                  />
                  {formValues[form.oxygenNeeded.name] == YES && (
                    <RadioGroupInput
                      name={form.oxygenSource.name}
                      label={form.oxygenSource.label}
                      options={sourceOxygen}
                      row
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
                    row
                  />
                  <RadioGroupInput
                    name={form.chestWallAbnormality.name}
                    label={form.chestWallAbnormality.label}
                    options={radioOptions}
                    row
                  />
                </FieldsContainer>
                {formValues[form.isTracheaCentral.name] == NO && (
                  <FieldsContainer>
                    <>
                      <RadioGroupInput
                        name={form.deviationSide.name}
                        label={form.deviationSide.label}
                        row
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

                    {gender == "Male" && (
                      <LungFrontMaleImage
                        imageSection={form.chestWallAbnormality.name}
                        onValueChange={setChestAbnormalitiesImage}
                        form="breathingLung"
                      />
                    )}
                    {gender == "Female" && (
                      <LungFrontFemaleImage
                        imageSection={form.chestWallAbnormality.name}
                        onValueChange={setChestAbnormalitiesImage}
                        form="breathingLung"
                      />
                    )}

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

                <RadioGroupInput
                  name={form.chestExpansion.name}
                  label={form.chestExpansion.label}
                  row
                  options={[
                    { label: "Normal", value: concepts.NORMAL },
                    { label: "Reduced", value: concepts.REDUCED },
                  ]}
                />
                {formValues[form.chestExpansion.name] == concepts.REDUCED && (
                  <>
                    {gender == "Male" && (
                      <LungFrontMaleImage
                        onValueChange={setChestExpansionImagesEnc}
                        form="selectable"
                      />
                    )}
                    {gender == "Female" && (
                      <LungFrontFemaleImage
                        imageEncounter={encounters.BREATHING_ASSESSMENT}
                        onValueChange={setChestExpansionImagesEnc}
                        form="selectable"
                      />
                    )}
                  </>
                )}
                <br />
                <RadioGroupInput
                  name={form.percussion.name}
                  label={form.percussion.label}
                  row
                  options={[
                    { label: "Normal", value: concepts.NORMAL },
                    { label: "Abnormal", value: concepts.ABNORMAL },
                  ]}
                />

                {formValues[form.percussion.name] == concepts.ABNORMAL && (
                  <>
                    {gender == "Male" && (
                      <LungBackMaleImage
                        form="percussion"
                        onValueChange={setPercussionImage}
                      />
                    )}
                    {gender == "Female" && (
                      <LungBackFemaleImage
                        form="percussion"
                        onValueChange={setPercussionImage}
                      />
                    )}
                  </>
                )}
                <FieldsContainer>
                  <RadioGroupInput
                    name={form.breathSounds.name}
                    label={form.breathSounds.label}
                    row
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
      )}
    </ContainerLoaderOverlay>
  );
};
