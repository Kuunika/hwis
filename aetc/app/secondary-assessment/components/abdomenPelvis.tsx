import { NO, YES, concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
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
  SecondaryAbdomenImage,
} from "@/components/svgImages";

const form = {
  abdominalDistention: {
    name: concepts.ABDOMINAL_DISTENTION,
    label: "Is there abdominal distention",
  },
  abnormalitiesPresent: {
    name: concepts.ABNORMALITIES_PRESENT,
    label: "Are there abnormalities",
  },
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
    name: concepts.THRILL,
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
    label: "Breathing sounds",
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
};

type Prop = {
  onSubmit: (values: any) => void;
};

const schema = Yup.object().shape({
  [form.abdominalDistention.name]: Yup.string()
    .required()
    .label(form.abdominalDistention.label),
  [form.abnormalitiesPresent.name]: Yup.string()
    .required()
    .label(form.abnormalitiesPresent.label),
  
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
];
export const AbdomenPelvisForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showSpecify, setShowSpecify] = useState(false);
  const [showAbnormalities, setShowAbnormalities] = useState(false);

  const handleValueChange = (values: Array<any>) => {
    setShowSpecify(Boolean(values.find((v) => v.id == concepts.OTHER)));
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={onSubmit}
    >
      <FormValuesListener getValues={setFormValues} />
      <FormFieldContainerLayout title="Inspection">
        <FieldsContainer>

        <RadioGroupInput options={radioOptions}  name={form.abdominalDistention.name} label={form.abdominalDistention.label} />
        <RadioGroupInput options={radioOptions}  name={form.abnormalitiesPresent.name} label={form.abnormalitiesPresent.label} />
        </FieldsContainer>
        {formValues[form.abnormalitiesPresent.name]==concepts.YES && <SecondaryAbdomenImage />}
      </FormFieldContainerLayout>
      {/* <FormFieldContainerLayout title="Palpation (Heart)">
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
          <PercussionChestLung />
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
          <BreathingSoundsChestLung />
        )}
        <RadioGroupInput
          row
          name={form.vocalFremitus.name}
          label={form.vocalFremitus.label}
          options={chestExpansionOptions}
        />
        {formValues[form.vocalFremitus.name] == concepts.REDUCED ||
          (formValues[form.vocalFremitus.name] == concepts.INCREASED && (
            <BreathingSoundsChestLung />
          ))}
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
                if (values)
                  setShowAbnormalities(
                    Boolean(values.find((v: any) => v.id == concepts.MURMUR))
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
          </>
        )}
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Additional Notes">
        <TextInputField
        sx={{width:"100%"}}
          name={form.additionalNotes.name}
          label={form.additionalNotes.label}
          id={form.additionalNotes.name}
        />
      </FormFieldContainerLayout> */}
    </FormikInit>
  );
};
