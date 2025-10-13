"use client";
import { NO, YES, concepts, encounters } from "@/constants";
import {
  flattenImagesObs,
  getInitialValues,
  getObservations,
  mapSearchComboOptionsToConcepts,
} from "@/helpers";
import { useState } from "react";
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

import { getActivePatientDetails, useSubmitEncounter } from "@/hooks";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { LungFrontMaleImage } from "@/components/svgImages/LungFrontMale";
import { LungFrontFemaleImage } from "@/components/svgImages/LungFrontFemale";
import { CheckBoxNext } from "@/components/form/checkBoxNext";
import { useServerTime } from "@/contexts/serverTimeContext";
import { Box } from "@mui/material";
import { LungBackMaleImage } from "@/components/svgImages/LungBackMale";
import { LungBackFemaleImage } from "@/components/svgImages/LungBackFemale";
import { LungLeftFemaleImage } from "@/components/svgImages/LungLeftFemale";
import { LungLeftMaleImage } from "@/components/svgImages/LungLeftMale";
import { LungRightFemaleImage } from "@/components/svgImages/LungRightFemale";
import { LungRightMaleImage } from "@/components/svgImages/LungRightMale";
import ComponentSlider from "@/components/slider/slider";
import { number } from "yup";

const form = {
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate",
  },
  chestWallAbnormality: {
    name: concepts.CHEST_WALL_ABNORMALITY,
    label: "Chest Wall Abnormality",
    children: [
      {
        multiple: true,
        concept: concepts.ABNORMALITIES,
        label: "Abnormalities",
      },
    ],
  },
  chestWallAbnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Chest Wall Abnormalities",
    child: true,
  },
  otherSpecify: {
    name: concepts.OTHER,
    label: "Specify",
  },
  localizedChestAbnormality: {
    name: concepts.LOCALISED_CHEST_WALL_ABNORMALITY,
    label: "Localised Chest Wall Abnormality",
    children: [
      {
        concept: concepts.IMAGE_PART_NAME,
        label: "Localised Chest wall Abnormality Image",
        image: true,
        parentConcept: concepts.LOCALISED_CHEST_WALL_ABNORMALITY,
      },
    ],
  },
  chestExpansion: {
    name: concepts.CHEST_EXPANSION,
    label: "Chest Expansion",
    children: [
      {
        concept: concepts.IMAGE_PART_NAME,
        label: "Chest Expansion Image",
        image: true,
        parentConcept: concepts.CHEST_EXPANSION,
      },
    ],
  },
  tactileFremitus: {
    name: concepts.TACTILE_FREMITUS,
    label: "Tactile Fremitus",
    children: [
      {
        concept: concepts.IMAGE_PART_NAME,
        label: "Tactile Fremitus Image",
        image: true,
        parentConcept: concepts.TACTILE_FREMITUS,
      },
    ],
  },
  percussion: {
    name: concepts.PERCUSSION,
    label: "Percussion",
    children: [
      {
        concept: concepts.IMAGE_PART_NAME,
        label: "Percussion Image",
        image: true,
        parentConcept: concepts.PERCUSSION,
      },
    ],
  },
  image: {
    name: concepts.IMAGE_PART_NAME,
    label: "Image",
    image: true,
  },
  apexBeat: {
    name: concepts.APEX_BEAT,
    label: "Apex Beat",
    children: [
      {
        concept: concepts.POSITIONING,
        label: "Position",
      },
    ],
  },
  position: {
    name: concepts.POSITIONING,
    label: "Position",
    child: true,
  },
  thrill: {
    name: concepts.TRILL,
    label: "Thrill",
    children: [
      {
        concept: concepts.DESCRIPTION,
        label: "Thrill Description",
        type: "string",
      },
    ],
  },
  thrillDescription: {
    name: concepts.DESCRIPTION,
    label: "Thrill Description",
    child: true,
  },
  heaves: {
    name: concepts.HEAVES,
    label: "Heaves",
    children: [
      {
        concept: concepts.HEAVES_DESCRIPTION,
        label: "Heaves Description",
        type: "string",
      },
    ],
  },
  heavesDescription: {
    name: concepts.HEAVES_DESCRIPTION,
    label: "Heaves Description",
    child: true,
  },

  // breathingSounds: {
  //   name: concepts.BREATHING_SOUNDS,
  //   label: "Breath sounds",
  // },
  // vocalFremitus: {
  //   name: concepts.VOCAL_FREMITUS,
  //   label: "Vocal Fremitus",
  // },
  heartSounds: {
    name: concepts.HEART_SOUNDS,
    label: "Heart Sounds",
    children: [
      {
        concept: concepts.ABNORMALITIES,
        label: "Abnormality Description",
        type: "string",
      },
    ],
  },
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Description of Abnormality",
    child: true,
  },
  location: {
    name: concepts.LOCATION,
    label: "Location of murmur",
    children: [
      {
        concept: concepts.TYPE_OF_MURMUR,
        label: "Type of murmur",
        type: "string",
      },
    ],
  },
  type: {
    name: concepts.TYPE_OF_MURMUR,
    label: "Type of murmur",
    child: true,
  },
  additionalNotes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
  abnormalityOther: {
    name: concepts.NOTES,
    label: "Other",
  },
  globalChestWallAbnormality: {
    name: concepts.GLOBAL_CHEST_WALL_ABNORMALITY,
    label: "Global chest wall abnormality",
  },
  globalChestWallAbnormalityList: {
    name: "global abnormalities",
    label: "abnormalities",
  },
  globalChestWallAbnormalityOther: {
    name: "global abnormalities other",
    label: "specify",
  },
};
export const chestFormConfig: any = form;

type Prop = {
  onSubmit: () => void;
};

const schema = Yup.object().shape({
  [form.respiratoryRate.name]: Yup.number()
    .required("This field is required.")
    .min(0)
    .max(90)
    .label(form.respiratoryRate.label),
  // .test(
  //   "not-between",
  //   `${form.respiratoryRate.label} must be below 10 or above 40`,
  //   (value) => value < 10 || value > 40
  // )
  // .label(form.respiratoryRate.label),
  [form.chestWallAbnormality.name]: Yup.string().label(
    form.chestWallAbnormality.label
  ),
  [form.chestWallAbnormalities.name]: Yup.string().label(
    form.chestWallAbnormalities.label
  ),
  [form.localizedChestAbnormality.name]: Yup.string()
    .required()
    .label(form.localizedChestAbnormality.label),
  [form.otherSpecify.name]: Yup.string().label(form.otherSpecify.label),
  [form.chestExpansion.name]: Yup.string()
    .required()
    .label(form.chestExpansion.label),
  [form.tactileFremitus.name]: Yup.string()
    .required()
    .label(form.tactileFremitus.label),
  [form.apexBeat.name]: Yup.string().required().label(form.apexBeat.label),
  [form.position.name]: Yup.string().label(form.position.label),
  [form.thrill.name]: Yup.string().required().label(form.thrill.label),
  [form.thrillDescription.name]: Yup.string().label(
    form.thrillDescription.label
  ),
  [form.heaves.name]: Yup.string().required().label(form.heaves.label),
  [form.heavesDescription.name]: Yup.string().label(
    form.heavesDescription.label
  ),
  [form.percussion.name]: Yup.string().required().label(form.percussion.label),
  // [form.breathingSounds.name]: Yup.string()
  //   .required()
  //   .label(form.breathingSounds.label),
  // [form.vocalFremitus.name]: Yup.string()
  //   .required()
  //   .label(form.vocalFremitus.label),
  [form.heartSounds.name]: Yup.string()
    .required()
    .label(form.heartSounds.label),
  [form.abnormalities.name]: Yup.array().label(form.abnormalities.label),
  [form.location.name]: Yup.string().label(form.location.label),
  [form.type.name]: Yup.string().label(form.type.label),
  [form.additionalNotes.name]: Yup.string().label(form.additionalNotes.label),
  [form.abnormalityOther.name]: Yup.string().label(form.abnormalityOther.label),
  [form.globalChestWallAbnormality.name]: Yup.string()
    .label(form.globalChestWallAbnormality.label)
    .required(),
  [form.globalChestWallAbnormalityList.name]: Yup.array().label(
    form.globalChestWallAbnormalityList.label
  ),
  [form.globalChestWallAbnormalityOther.name]: Yup.array().label(
    form.globalChestWallAbnormalityOther.label
  ),
});

const chestWallAbnormalities = [
  { id: concepts.PECTUS_CARINATUM, label: "Pectus Carinatum" },
  { id: concepts.PECTUS_EXCAVATUM, label: "Pectus Exavatum" },
  { id: concepts.BARREL_CHEST, label: "Barrel Chest" },
  { id: concepts.OTHER, label: "Other" },
];

const initialsValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
];

const apexBeatOptions = [
  { label: "Displaced", value: concepts.DISPLACED },
  { label: "Not Displaced", value: concepts.NOT_DISPLACED },
];

const percussionOptions = [
  { label: "Normal", value: concepts.NORMAL },
  { label: "Abnormal", value: concepts.ABNORMAL },
];

const chestExpansionOptions = [
  { value: concepts.NORMAL, label: "Normal" },
  { value: concepts.REDUCED, label: "Reduced" },
  { value: concepts.INCREASED, label: "Increased" },
];

const abnormalities = [
  { id: concepts.LOUD_P2, label: "Loud p2" },
  { id: concepts.SPLITTING_P2, label: "Splitting P2" },
  { id: concepts.GALLOP_RHYTHM, label: "Gallop rhythm" },
  { id: concepts.MURMUR, label: "Murmur" },
  { id: concepts.OTHER, label: "Other" },
];

export const ChestForm = ({ onSubmit }: Prop) => {
  const { ServerTime } = useServerTime();
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState<any>({});
  const [showSpecify, setShowSpecify] = useState(false);
  const [showAbnormalities, setShowAbnormalities] = useState(false);
  const [showAbnormalitiesOther, setShowAbnormalitiesOther] = useState(false);
  const [localizedChestImagesEnc, setLocalizedChestImagesEnc] = useState<
    Array<any>
  >([]);
  const [chestExpansionImagesEnc, setChestExpansionImagesEnc] = useState<
    Array<any>
  >([]);
  const [tactileFremitusImagesEnc, setTactileFremitusImagesEnc] = useState<
    Array<any>
  >([]);
  const [percussionImagesEnc, setPercussionImagesEnc] = useState<Array<any>>(
    []
  );
  const [breathingSoundsImagesEnc, setBreathingSoundsImagesEnc] = useState<
    Array<any>
  >([]);
  const [
    breathingSoundsPosteriorImagesEnc,
    setBreathingSoundsPosteriorImagesEnc,
  ] = useState<Array<any>>([]);
  const [
    breathingSoundsLateralRightImagesEnc,
    setBreathingSoundsLateralRightImagesEnc,
  ] = useState<Array<any>>([]);
  const [
    breathingSoundsLateralLeftImagesEnc,
    setBreathingSoundsLateralLeftImagesEnc,
  ] = useState<Array<any>>([]);
  const [vocalFremitusImagesEnc, setVocalFremitusImagesEnc] = useState<
    Array<any>
  >([]);
  const { gender } = getActivePatientDetails();

  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.CHEST_ASSESSMENT,
    onSubmit
  );

  const auscultationSlides = [
    {
      id: 1,
      label: "Lung Lateral Left",
      content:
        gender == "Female" ? (
          <LungLeftFemaleImage
            form="breathingSoundChest"
            onValueChange={setBreathingSoundsLateralLeftImagesEnc}
          />
        ) : (
          <LungLeftMaleImage
            form="breathingSoundChest"
            onValueChange={setBreathingSoundsLateralLeftImagesEnc}
          />
        ),
    },
    {
      id: 2,
      label: "Lung lateral right",
      content:
        gender == "Female" ? (
          <LungRightFemaleImage
            form="breathingSoundChest"
            onValueChange={setBreathingSoundsLateralRightImagesEnc}
          />
        ) : (
          <LungRightMaleImage
            form="breathingSoundChest"
            onValueChange={setBreathingSoundsLateralRightImagesEnc}
          />
        ),
    },
    {
      id: 3,
      label: "Lung Anterior",
      content:
        gender == "Female" ? (
          <LungFrontFemaleImage
            onValueChange={setBreathingSoundsImagesEnc}
            form="breathingSoundChest"
          />
        ) : (
          <LungFrontMaleImage
            onValueChange={setBreathingSoundsImagesEnc}
            form="breathingSoundChest"
          />
        ),
    },
    {
      id: 4,
      label: "Lung Posterior",
      content:
        gender == "Female" ? (
          <LungBackFemaleImage
            onValueChange={setBreathingSoundsPosteriorImagesEnc}
            form="breathingSoundChest"
          />
        ) : (
          <LungBackMaleImage
            onValueChange={setBreathingSoundsPosteriorImagesEnc}
            form="breathingSoundChest"
          />
        ),
    },
  ];

  const handleSubmitForm = async (values: any) => {
    const formValues: any = { ...values };

    const obsDatetime = ServerTime.getServerTimeString();

    const obs = [
      {
        concept: form.chestExpansion.name,
        value: formValues[form.chestExpansion.name],
        obsDatetime,
        groupMembers: await flattenImagesObs(chestExpansionImagesEnc),
      },
      {
        concept: form.tactileFremitus.name,
        value: formValues[form.tactileFremitus.name],
        obsDatetime,
        groupMembers: await flattenImagesObs(tactileFremitusImagesEnc),
      },
      {
        concept: concepts.AUSCULTATION_LUNG,
        value: concepts.AUSCULTATION_LUNG,
        obsDatetime,
        groupMembers: [
          {
            concept: concepts.SITE,
            value: "Auscultation Lung Anterior",
            obsDatetime,
            groupMembers: await flattenImagesObs(breathingSoundsImagesEnc),
          },
          {
            concept: concepts.SITE,
            value: "Auscultation Lung Posterior",
            obsDatetime,
            groupMembers: await flattenImagesObs(
              breathingSoundsPosteriorImagesEnc
            ),
          },
          {
            concept: concepts.SITE,
            value: "Auscultation Lung Lateral Left",
            obsDatetime,
            groupMembers: await flattenImagesObs(
              breathingSoundsLateralLeftImagesEnc
            ),
          },
          {
            concept: concepts.SITE,
            value: "Auscultation Lung Lateral Right",
            obsDatetime,
            groupMembers: await flattenImagesObs(
              breathingSoundsLateralRightImagesEnc
            ),
          },
        ],
      },
      {
        concept: form.percussion.name,
        value: formValues[form.percussion.name],
        obsDatetime,
        groupMembers: await flattenImagesObs(percussionImagesEnc),
      },
      {
        concept: form.localizedChestAbnormality.name,
        value: formValues[form.localizedChestAbnormality.name],
        obsDatetime,
        groupMembers: await flattenImagesObs(localizedChestImagesEnc),
      },
      {
        concept: form.globalChestWallAbnormality.name,
        value: formValues[form.globalChestWallAbnormality.name],
        obsDatetime,
        groupMembers: [
          ...mapSearchComboOptionsToConcepts(
            formValues[form.globalChestWallAbnormalityList.name],
            concepts.ABNORMALITIES,
            obsDatetime
          ),
          {
            concept: concepts.OTHER,
            value: formValues[form.globalChestWallAbnormalityOther.name],
            obsDatetime,
          },
        ],
      },
    ];

    const abnormalitiesObs =
      formValues &&
      typeof formValues === "object" &&
      Array.isArray(formValues[form.abnormalities.name]) &&
      formValues[form.abnormalities.name].map((opt: { id: string }) => ({
        concept: form.abnormalities.name,
        value: opt.id,
        obsDatetime,
      }));

    delete formValues[form.abnormalities.name];
    delete formValues[form.chestWallAbnormalities.name];
    delete formValues[form.chestExpansion.name];
    delete formValues[form.localizedChestAbnormality.name];
    delete formValues[form.percussion.name];
    // delete formValues[form.breathingSounds.name];
    delete formValues[form.tactileFremitus.name];
    delete formValues[form.globalChestWallAbnormality.name];
    delete formValues[form.globalChestWallAbnormalityOther.name];
    delete formValues[form.globalChestWallAbnormalityList.name];
    // delete formValues[form.vocalFremitus.name];

    await handleSubmit([
      ...getObservations(formValues, obsDatetime),
      ...obs,
      ...(abnormalitiesObs || []),
      // ...chestWallAbnormalitiesObs,
    ]);
  };

  const handleValueChange = (values: Array<any>) => {
    setShowSpecify(Boolean(values.find((v) => v.id == concepts.OTHER)));
  };

  return (
    <ContainerLoaderOverlay loading={isLoading}>
      {/* <CheckBoxNext
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        onNext={(obs: any) => handleSubmit(obs)}
        title="Tick if circulation is normal and there are no abnormalities"
      /> */}
      {!isChecked && (
        <FormikInit
          validationSchema={schema}
          initialValues={initialsValues}
          onSubmit={handleSubmitForm}
          submitButtonText="Next"
        >
          <FormValuesListener getValues={setFormValues} />
          <FormFieldContainerLayout title="Inspection (Lungs)">
            <TextInputField
              sx={{ width: "100%" }}
              name={form.respiratoryRate.name}
              label={form.respiratoryRate.label}
              id={form.respiratoryRate.name}
            />

            <RadioGroupInput
              sx={{ flex: 1 }}
              row={true}
              name={form.globalChestWallAbnormality.name}
              label={form.globalChestWallAbnormality.label}
              options={radioOptions}
            />
            {formValues[form.globalChestWallAbnormality.name] == YES && (
              <>
                <SearchComboBox
                  name={form.globalChestWallAbnormalityList.name}
                  label={form.globalChestWallAbnormality.label}
                  options={chestWallAbnormalities}
                  multiple
                />
                {Array.isArray(
                  formValues[form.globalChestWallAbnormalityList.name]
                ) &&
                  formValues[form.globalChestWallAbnormalityList.name]?.find(
                    (op: any) => op.id == concepts.OTHER
                  ) && (
                    <TextInputField
                      name={form.globalChestWallAbnormalityOther.name}
                      label={form.globalChestWallAbnormalityOther.label}
                      id={form.globalChestWallAbnormalityOther.name}
                      multiline
                      rows={5}
                      sx={{ width: "100%", mt: "1ch" }}
                    />
                  )}
              </>
            )}
            <RadioGroupInput
              sx={{ flex: 1 }}
              row={true}
              name={form.localizedChestAbnormality.name}
              label={form.localizedChestAbnormality.label}
              options={radioOptions}
            />
            {formValues[form.localizedChestAbnormality.name] == YES && (
              <>
                {gender == "Male" && (
                  <LungFrontMaleImage
                    onValueChange={setLocalizedChestImagesEnc}
                    imageEncounter={encounters.CHEST_ASSESSMENT}
                    imageSection={form.localizedChestAbnormality.name}
                    form="chestLung"
                  />
                )}
                {gender == "Female" && (
                  <LungFrontFemaleImage
                    onValueChange={setLocalizedChestImagesEnc}
                    imageEncounter={encounters.CHEST_ASSESSMENT}
                    imageSection={form.localizedChestAbnormality.name}
                    form="chestLung"
                  />
                )}
                {/* <ChestLung
                onValueChange={setLocalizedChestImagesEnc}
                imageEncounter={encounters.CHEST_ASSESSMENT}
                imageSection={form.localizedChestAbnormality.name}
              /> */}
              </>
            )}
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Palpation (Lungs)">
            {/* <RadioGroupInput
            sx={{ flex: 1 }}
            row={true}
            name={form.chestWallAbnormality.name}
            label={form.chestWallAbnormality.label}
            options={radioOptions}
          /> */}

            {formValues[form.chestWallAbnormality.name] == YES && (
              <SearchComboBox
                sx={{ mb: "2ch" }}
                getValue={handleValueChange}
                options={chestWallAbnormalities}
                name={form.chestWallAbnormalities.name}
                label={form.chestWallAbnormalities.label}
              />
            )}
            {showSpecify &&
              formValues[form.chestWallAbnormality.name] == YES && (
                <TextInputField
                  sx={{ width: "100%" }}
                  name={form.otherSpecify.name}
                  label={form.otherSpecify.label}
                  id={form.otherSpecify.name}
                />
              )}
            <RadioGroupInput
              row={true}
              name={form.chestExpansion.name}
              options={chestExpansionOptions}
              label={form.chestExpansion.label}
            />
            {(formValues[form.chestExpansion.name] == concepts.REDUCED ||
              formValues[form.chestExpansion.name] == concepts.INCREASED) && (
              <>
                {gender == "Male" && (
                  <LungFrontMaleImage
                    onValueChange={setChestExpansionImagesEnc}
                    imageEncounter={encounters.CHEST_ASSESSMENT}
                    imageSection={form.localizedChestAbnormality.name}
                    form="selectable"
                  />
                )}
                {gender == "Female" && (
                  <LungFrontFemaleImage
                    onValueChange={setChestExpansionImagesEnc}
                    imageEncounter={encounters.CHEST_ASSESSMENT}
                    imageSection={form.localizedChestAbnormality.name}
                    form="selectable"
                  />
                )}
                {/* <ChestLung
                onValueChange={setChestExpansionImagesEnc}
                imageEncounter={encounters.CHEST_ASSESSMENT}
                imageSection={form.chestExpansion.name}
                selectable={true}
              /> */}
              </>
            )}
            <RadioGroupInput
              row={true}
              name={form.tactileFremitus.name}
              options={chestExpansionOptions}
              label={form.tactileFremitus.label}
            />
            {(formValues[form.tactileFremitus.name] == concepts.REDUCED ||
              formValues[form.tactileFremitus.name] == concepts.INCREASED) && (
              <>
                {gender == "Male" && (
                  <LungFrontMaleImage
                    onValueChange={setTactileFremitusImagesEnc}
                    imageEncounter={encounters.CHEST_ASSESSMENT}
                    imageSection={form.localizedChestAbnormality.name}
                    form="selectable"
                  />
                )}
                {gender == "Female" && (
                  <LungFrontFemaleImage
                    onValueChange={setTactileFremitusImagesEnc}
                    imageEncounter={encounters.CHEST_ASSESSMENT}
                    imageSection={form.localizedChestAbnormality.name}
                    form="selectable"
                  />
                )}
                {/* <ChestLung
                selectable={true}
                onValueChange={setTactileFremitusImagesEnc}
                imageEncounter={encounters.CHEST_ASSESSMENT}
                imageSection={form.tactileFremitus.name}
              /> */}
              </>
            )}
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Percussion">
            <RadioGroupInput
              row={true}
              name={form.percussion.name}
              options={percussionOptions}
              label={form.percussion.label}
            />
            {formValues[form.percussion.name] == concepts.ABNORMAL && (
              <>
                {gender == "Male" && (
                  <LungFrontMaleImage
                    onValueChange={setPercussionImagesEnc}
                    imageEncounter={encounters.CHEST_ASSESSMENT}
                    imageSection={form.localizedChestAbnormality.name}
                    form="percussion"
                  />
                )}
                {gender == "Female" && (
                  <LungFrontFemaleImage
                    onValueChange={setPercussionImagesEnc}
                    imageEncounter={encounters.CHEST_ASSESSMENT}
                    imageSection={form.localizedChestAbnormality.name}
                    form="percussion"
                  />
                )}
              </>
            )}
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Auscultation (Lungs)">
            <ComponentSlider slides={auscultationSlides} />
            {/* <BreathingSoundsChestLung
            imageEncounter={encounters.CHEST_ASSESSMENT}
            // imageSection={form.breathingSounds.name}
            onValueChange={setBreathingSoundsImagesEnc}
          /> */}

            {/* {formValues[form.breathingSounds.name] == concepts.ABNORMAL && (
            <BreathingSoundsChestLung
              imageEncounter={encounters.CHEST_ASSESSMENT}
              imageSection={form.breathingSounds.name}
              onValueChange={setBreathingSoundsImagesEnc}
            />
          )} */}
            {/* <RadioGroupInput
            row
            name={form.vocalFremitus.name}
            label={form.vocalFremitus.label}
            options={chestExpansionOptions}
          />
          {(formValues[form.vocalFremitus.name] == concepts.REDUCED ||
            formValues[form.vocalFremitus.name] == concepts.INCREASED) && (
            <ChestLung
              imageSection={form.vocalFremitus.name}
              imageEncounter={encounters.CHEST_ASSESSMENT}
              onValueChange={setVocalFremitusImagesEnc}
              selectable
            />
          )} */}
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Auscultation (Heart)">
            <RadioGroupInput
              row={true}
              name={form.apexBeat.name}
              options={apexBeatOptions}
              label={form.apexBeat.label}
            />
            {formValues[form.apexBeat.name] == concepts.DISPLACED && (
              <TextInputField
                sx={{ width: "100%" }}
                name={form.position.name}
                id={form.position.name}
                label={form.position.label}
              />
            )}

            <RadioGroupInput
              row={true}
              name={form.thrill.name}
              options={radioOptions}
              label={form.thrill.label}
            />
            {formValues[form.thrill.name] == YES && (
              <TextInputField
                sx={{ width: "100%" }}
                multiline
                rows={5}
                name={form.thrillDescription.name}
                id={form.thrillDescription.name}
                label={form.thrillDescription.label}
              />
            )}
            <RadioGroupInput
              row={true}
              name={form.heaves.name}
              options={radioOptions}
              label={form.heaves.label}
            />
            {formValues[form.heaves.name] == YES && (
              <TextInputField
                sx={{ width: "100%" }}
                multiline
                rows={5}
                name={form.heavesDescription.name}
                id={form.heavesDescription.name}
                label={form.heavesDescription.label}
              />
            )}
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Auscultation (Chest)">
            <RadioGroupInput
              row
              name={form.heartSounds.name}
              label={form.heartSounds.label}
              options={percussionOptions}
            />
            {formValues[form.heartSounds.name] == concepts.ABNORMAL && (
              <>
                <SearchComboBox
                  getValue={(values) => {
                    if (!values) return;
                    setShowAbnormalities(
                      Boolean(values.find((v: any) => v.id == concepts.MURMUR))
                    );
                    setShowAbnormalitiesOther(
                      Boolean(values.find((v: any) => v.id == concepts.OTHER))
                    );
                  }}
                  name={form.abnormalities.name}
                  label={form.abnormalities.label}
                  options={abnormalities}
                />

                {showAbnormalities && (
                  <>
                    <FieldsContainer sx={{ mt: "1ch" }} mr="1ch">
                      <TextInputField
                        name={form.location.name}
                        label={form.location.label}
                        id={form.location.name}
                      />
                      <TextInputField
                        name={form.type.name}
                        label={form.type.label}
                        id={form.type.name}
                      />
                    </FieldsContainer>
                  </>
                )}
                {showAbnormalitiesOther && (
                  <>
                    <br />
                    <TextInputField
                      multiline
                      rows={5}
                      sx={{ width: "100%" }}
                      name={form.abnormalityOther.name}
                      label={form.abnormalityOther.label}
                      id={form.abnormalityOther.name}
                    />
                  </>
                )}
              </>
            )}
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Additional Notes">
            <TextInputField
              sx={{ width: "100%" }}
              name={form.additionalNotes.name}
              label={form.additionalNotes.label}
              id={form.additionalNotes.name}
              multiline
              rows={5}
            />
          </FormFieldContainerLayout>
        </FormikInit>
      )}
    </ContainerLoaderOverlay>
  );
};
