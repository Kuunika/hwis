"use client";
import { NO, YES, concepts, encounters } from "@/constants";
import { flattenImagesObs, getInitialValues, getObservations } from "@/helpers";
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
import {
  BreathingSoundsChestLung,
  ChestLung,
  PercussionChestLung,
} from "@/components/svgImages";
import { useSubmitEncounter } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";

const form = {
  respiratoryRate: {
    name: concepts.RESPIRATORY_RATE,
    label: "Respiratory Rate",
  },
  chestWallAbnormality: {
    name: concepts.CHEST_WALL_ABNORMALITY,
    label: "Chest Wall Abnormality",
  },
  chestWallAbnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Chest Wall Abnormalities",
  },
  otherSpecify: {
    name: concepts.OTHER,
    label: "Specify",
  },
  localizedChestAbnormality: {
    name: concepts.LOCALISED_CHEST_WALL_ABNORMALITY,
    label: "Localised Chest Wall Abnormality",
  },
  chestExpansion: {
    name: concepts.CHEST_EXPANSION,
    label: "Chest Expansion",
  },
  tactileFremitus: {
    name: concepts.TACTILE_FREMITUS,
    label: "Tactile Fremitus",
  },
  apexBeat: {
    name: concepts.APEX_BEAT,
    label: "Apex Beat",
  },
  position: {
    name: concepts.POSITIONING,
    label: "Position",
  },
  thrill: {
    name: concepts.TRILL,
    label: "Thrill",
  },
  thrillDescription: {
    name: concepts.DESCRIPTION,
    label: "Thrill Description",
  },
  heaves: {
    name: concepts.HEAVES,
    label: "Heaves",
  },
  heavesDescription: {
    name: concepts.HEAVES_DESCRIPTION,
    label: "Heaves Description",
  },
  percussion: {
    name: concepts.PERCUSSION,
    label: "Percussion",
  },
  breathingSounds: {
    name: concepts.BREATHING_SOUNDS,
    label: "Breath sounds",
  },
  vocalFremitus: {
    name: concepts.VOCAL_FREMITUS,
    label: "Vocal Fremitus",
  },
  heartSounds: {
    name: concepts.HEART_SOUNDS,
    label: "Heart Sounds",
  },
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Description of Abnormality",
  },
  location: {
    name: concepts.LOCATION,
    label: "Location of murmur",
  },
  type: {
    name: concepts.TYPE_OF_MURMUR,
    label: "Type of murmur",
  },
  additionalNotes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
  abnormalityOther: {
    name: concepts.DESCRIPTION,
    label: "Other",
  },
};

type Prop = {
  onSubmit: () => void;
};

const schema = Yup.object().shape({
  [form.respiratoryRate.name]: Yup.number()
    .required()
    .min(1)
    .max(70)
    .label(form.respiratoryRate.label),
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
  [form.breathingSounds.name]: Yup.string()
    .required()
    .label(form.breathingSounds.label),
  [form.vocalFremitus.name]: Yup.string()
    .required()
    .label(form.vocalFremitus.label),
  [form.heartSounds.name]: Yup.string()
    .required()
    .label(form.heartSounds.label),
  [form.abnormalities.name]: Yup.array().label(form.abnormalities.label),
  [form.location.name]: Yup.string().label(form.location.label),
  [form.type.name]: Yup.string().label(form.type.label),
  [form.additionalNotes.name]: Yup.string().label(form.additionalNotes.label),
  [form.abnormalityOther.name]: Yup.string().label(form.abnormalityOther.label),
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
  const [vocalFremitusImagesEnc, setVocalFremitusImagesEnc] = useState<
    Array<any>
  >([]);

  const { handleSubmit, isLoading } = useSubmitEncounter(
    encounters.CHEST_ASSESSMENT,
    onSubmit
  );

  const handleSubmitForm = async (values: any) => {
    const formValues = { ...values };
    const obs = [
      {
        concept: form.chestExpansion.name,
        value: formValues[form.chestExpansion.name],
        obsDatetime: getDateTime(),
        group_members: flattenImagesObs(chestExpansionImagesEnc),
      },
      {
        concept: form.tactileFremitus.name,
        value: formValues[form.tactileFremitus.name],
        obsDatetime: getDateTime(),
        group_members: flattenImagesObs(tactileFremitusImagesEnc),
      },
      {
        concept: form.breathingSounds.name,
        value: formValues[form.breathingSounds.name],
        obsDatetime: getDateTime(),
        group_members: flattenImagesObs(breathingSoundsImagesEnc),
      },
      {
        concept: form.percussion.name,
        value: formValues[form.percussion.name],
        obsDatetime: getDateTime(),
        group_members: flattenImagesObs(percussionImagesEnc),
      },
      {
        concept: form.localizedChestAbnormality.name,
        value: formValues[form.localizedChestAbnormality.name],
        obsDatetime: getDateTime(),
        group_members: flattenImagesObs(localizedChestImagesEnc),
      },
      {
        concept: form.vocalFremitus.name,
        value: formValues[form.vocalFremitus.name],
        obsDatetime: getDateTime(),
        group_members: flattenImagesObs(vocalFremitusImagesEnc),
      },
    ];

    const datetime = getDateTime();

    const abnormalitiesObs = formValues[form.abnormalities.name].map(
      (opt: any) => {
        return {
          concept: form.abnormalities.name,
          value: opt.id,
          obsDatetime: datetime,
        };
      }
    );
    const chestWallAbnormalitiesObs = formValues[
      form.chestWallAbnormalities.name
    ].map((opt: any) => {
      return {
        concept: form.chestWallAbnormalities.name,
        value: opt.id,
        obsDatetime: datetime,
      };
    });

    delete formValues[form.abnormalities.name];
    delete formValues[form.chestWallAbnormalities.name];
    delete formValues[form.chestExpansion.name];
    delete formValues[form.localizedChestAbnormality.name];
    delete formValues[form.percussion.name];
    delete formValues[form.breathingSounds.name];
    delete formValues[form.tactileFremitus.name];
    delete formValues[form.vocalFremitus.name];

    await handleSubmit([
      ...getObservations(formValues, getDateTime()),
      ...obs,
      ...abnormalitiesObs,
      ...chestWallAbnormalitiesObs,
    ]);
  };

  const handleValueChange = (values: Array<any>) => {
    setShowSpecify(Boolean(values.find((v) => v.id == concepts.OTHER)));
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={handleSubmitForm}
    >
      <FormValuesListener getValues={setFormValues} />
      <FormFieldContainerLayout title="Palpation (Lungs)">
        <TextInputField
          sx={{ width: "100%" }}
          name={form.respiratoryRate.name}
          label={form.respiratoryRate.label}
          id={form.respiratoryRate.name}
        />
        <RadioGroupInput
          sx={{ flex: 1 }}
          row={true}
          name={form.chestWallAbnormality.name}
          label={form.chestWallAbnormality.label}
          options={radioOptions}
        />

        {formValues[form.chestWallAbnormality.name] == YES && (
          <SearchComboBox
            sx={{ mb: "2ch" }}
            getValue={handleValueChange}
            options={chestWallAbnormalities}
            name={form.chestWallAbnormalities.name}
            label={form.chestWallAbnormalities.label}
          />
        )}
        {showSpecify && formValues[form.chestWallAbnormality.name] == YES && (
          <TextInputField
            sx={{ width: "100%" }}
            name={form.otherSpecify.name}
            label={form.otherSpecify.label}
            id={form.otherSpecify.name}
          />
        )}

        <RadioGroupInput
          sx={{ flex: 1 }}
          row={true}
          name={form.localizedChestAbnormality.name}
          label={form.localizedChestAbnormality.label}
          options={radioOptions}
        />
        {formValues[form.localizedChestAbnormality.name] == YES && (
          <ChestLung
            onValueChange={setLocalizedChestImagesEnc}
            imageEncounter={encounters.CHEST_ASSESSMENT}
            imageSection={form.localizedChestAbnormality.name}
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
          <ChestLung
            onValueChange={setChestExpansionImagesEnc}
            imageEncounter={encounters.CHEST_ASSESSMENT}
            imageSection={form.chestExpansion.name}
            selectable={true}
          />
        )}
        <RadioGroupInput
          row={true}
          name={form.tactileFremitus.name}
          options={chestExpansionOptions}
          label={form.tactileFremitus.label}
        />
        {(formValues[form.tactileFremitus.name] == concepts.REDUCED ||
          formValues[form.tactileFremitus.name] == concepts.INCREASED) && (
          <ChestLung
            selectable={true}
            onValueChange={setTactileFremitusImagesEnc}
            imageEncounter={encounters.CHEST_ASSESSMENT}
            imageSection={form.tactileFremitus.name}
          />
        )}
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Palpation (Heart)">
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
            name={form.heavesDescription.name}
            id={form.heavesDescription.name}
            label={form.heavesDescription.label}
          />
        )}
        <RadioGroupInput
          row={true}
          name={form.percussion.name}
          options={percussionOptions}
          label={form.percussion.label}
        />
        {formValues[form.percussion.name] == concepts.ABNORMAL && (
          <PercussionChestLung
            onValueChange={setPercussionImagesEnc}
            imageSection={form.percussion.name}
            imageEncounter={encounters.CHEST_ASSESSMENT}
          />
        )}
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Auscultation (Lungs)">
        <RadioGroupInput
          row
          name={form.breathingSounds.name}
          label={form.breathingSounds.label}
          options={percussionOptions}
        />
        {formValues[form.breathingSounds.name] == concepts.ABNORMAL && (
          <BreathingSoundsChestLung
            imageEncounter={encounters.CHEST_ASSESSMENT}
            imageSection={form.breathingSounds.name}
            onValueChange={setBreathingSoundsImagesEnc}
          />
        )}
        <RadioGroupInput
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
                  rows={2}
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
        />
      </FormFieldContainerLayout>
    </FormikInit>
  );
};
