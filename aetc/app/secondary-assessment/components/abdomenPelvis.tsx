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
import { AbdomenImage, SecondaryAbdomenImage } from "@/components/svgImages";

const form = {
  abdominalDistention: {
    name: concepts.ABDOMINAL_DISTENTION,
    label: "Is there abdominal distention",
  },
  abnormalitiesPresent: {
    name: concepts.ABNORMALITIES_PRESENT,
    label: "Are there abnormalities",
  },
  tenderness: {
    name: concepts.TENDERNESS,
    label: "Tenderness",
  },
  hepatomegaly: {
    name: concepts.HEPATOMEGALY,
    label: "Hepatomegaly",
  },
  hepatomegalyDescription: {
    name: concepts.HEPATOMEGALY_DESCRIPTION,
    label: "Hepatomegaly Description",
  },
  splenomegaly: {
    name: concepts.SPLENOMEGALY,
    label: "Splenomegaly",
  },
  splenomegalyDescription: {
    name: concepts.SPLENOMEGALY_DESCRIPTION,
    label: "Splenomegaly Description",
  },
  kidneyBallotable: {
    name: concepts.KIDNEYS_BALLOTABLE,
    label: "Kidney Ballotable",
  },
  fullBladder: {
    name: concepts.FULL_BLADDER,
    label: "Full Bladder",
  },
  otherMasses: {
    name: concepts.OTHER_MASSES,
    label: "Other Masses",
  },
  otherMassesDescription: {
    name: concepts.OTHER_MASSES_DESCRIPTION,
    label: "Other Masses Description",
  },
  shiftingDullness: {
    name: concepts.SHIFTING_DULLNESS,
    label: "Shifting Dullness",
  },
  fluidThrill: {
    name: concepts.FLUID_THRILL,
    label: "Fluid Thrill",
  },
  bowelSounds: {
    name: concepts.BOWEL_SOUNDS,
    label: "Bowel Sounds",
  },
  bruit: {
    name: concepts.BRUIT,
    label: "Bruit",
  },
  general: {
    name: concepts.GENERAL,
    label: "General",
  },
  prostate: {
    name: concepts.PROSTATE,
    label: "Prostate",
  },
  mass: {
    name: concepts.MASS,
    label: "Mass",
  },
  massDescription: {
    name: concepts.DESCRIPTION,
    label: "Mass Description",
  },
  sphincterTone: {
    name: concepts.SPHINCTER_TONE,
    label: "Sphincter Tone",
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
  [form.tenderness.name]: Yup.string().required().label(form.tenderness.label),
  [form.hepatomegaly.name]: Yup.string()
    .required()
    .label(form.hepatomegaly.label),
  [form.hepatomegalyDescription.name]: Yup.string().label(
    form.hepatomegalyDescription.label
  ),
  [form.splenomegaly.name]: Yup.string()
    .required()
    .label(form.splenomegaly.label),
  [form.splenomegalyDescription.name]: Yup.string().label(
    form.splenomegalyDescription.label
  ),
  [form.kidneyBallotable.name]: Yup.string()
    .required()
    .label(form.kidneyBallotable.label),
  [form.fullBladder.name]: Yup.string()
    .required()
    .label(form.fullBladder.label),
  [form.otherMasses.name]: Yup.string()
    .required()
    .label(form.otherMasses.label),
  [form.otherMassesDescription.name]: Yup.string().label(
    form.otherMassesDescription.label
  ),
  [form.shiftingDullness.name]: Yup.string().required().label(form.shiftingDullness.label),
  [form.fluidThrill.name]: Yup.string().required().label(form.fluidThrill.label),
  [form.bruit.name]: Yup.string().label(form.bruit.label).required(),
  [form.bowelSounds.name]: Yup.string().label(form.bowelSounds.label).required(),
  [form.general.name]: Yup.string().label(form.general.label).required(),
  [form.prostate.name]: Yup.string().label(form.prostate.label).required(),
  [form.mass.name]: Yup.string().label(form.mass.label).required(),
  [form.massDescription.name]: Yup.string().label(form.massDescription.label),
  [form.sphincterTone.name]: Yup.string().required().label(form.sphincterTone.label),
});

const prostateOptions = [
  { id: concepts.NORMAL, label: "Normal" },
  { id: concepts.ENLARGED, label: "Enlarged" },
  { id: concepts.HIGH_RIDING, label: "High Riding" },
];
const generalOptions = [
  { id: concepts.NORMAL, label: "Normal" },
  { id: concepts.EMPTY_RECTUM, label: "Empty rectum" },
  { id: concepts.MALAENA, label: "Malaena" },
  { id: concepts.FRESH_BLOOD, label: "Fresh blood (Haematochezia)" },
];
const sphincterOptions = [
  { id: concepts.NORMAL, label: "Normal" },
  { id: concepts.REDUCED, label: "Reduced" },
  { id: concepts.ABSENT, label: "Absent" },
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

const bowelSounds = [
  { id: concepts.HYPERACTIVE, label: "Hyperactive" },
  { id: concepts.REDUCED_BOWEL_SOUNDS, label: "Reduced" },
  { id: concepts.ABSENT, label: "Absent" },

];
export const AbdomenPelvisForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showSpecify, setShowSpecify] = useState(false);


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
          <RadioGroupInput
            options={radioOptions}
            name={form.abdominalDistention.name}
            label={form.abdominalDistention.label}
          />
          <RadioGroupInput
            options={radioOptions}
            name={form.abnormalitiesPresent.name}
            label={form.abnormalitiesPresent.label}
          />
        </FieldsContainer>
        {formValues[form.abnormalitiesPresent.name] == concepts.YES && (
          <SecondaryAbdomenImage />
        )}
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Palpation">
        <FieldsContainer>
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.hepatomegaly.name}
            label={form.hepatomegaly.label}
          />
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.splenomegaly.name}
            label={form.splenomegaly.label}
          />
        </FieldsContainer>
        <FieldsContainer mr="5px">
          <>
            {formValues[form.hepatomegaly.name] == YES && (
              <TextInputField
                id={form.hepatomegalyDescription.name}
                name={form.hepatomegalyDescription.name}
                label={form.hepatomegalyDescription.label}
              />
            )}
          </>
          <>
            {formValues[form.splenomegaly.name] == YES && (
              <TextInputField
                id={form.splenomegalyDescription.name}
                name={form.splenomegalyDescription.name}
                label={form.splenomegalyDescription.label}
              />
            )}
          </>
        </FieldsContainer>
        <FieldsContainer>
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.kidneyBallotable.name}
            label={form.kidneyBallotable.label}
          />
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.fullBladder.name}
            label={form.fullBladder.label}
          />
        </FieldsContainer>
        <FieldsContainer>
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.tenderness.name}
            label={form.tenderness.label}
          />
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.otherMasses.name}
            label={form.otherMasses.label}
          />
        </FieldsContainer>
        {formValues[form.otherMasses.name] == YES && (
          <TextInputField
            id={form.otherMassesDescription.name}
            name={form.otherMassesDescription.name}
            label={form.otherMassesDescription.label}
          />
        )}
        <FieldsContainer>
          {formValues[form.tenderness.name] == YES && <AbdomenImage />}
        </FieldsContainer>
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Percussion">
        <FieldsContainer>
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.shiftingDullness.name}
            label={form.shiftingDullness.label}
          />
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.fluidThrill.name}
            label={form.fluidThrill.label}
          />
        </FieldsContainer>
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Auscultation">
          <RadioGroupInput
            row
            options={radioOptions}
            name={form.bruit.name}
            label={form.bruit.label}
          />
          <SearchComboBox multiple={false} options={bowelSounds} name={form.bowelSounds.name} label={form.bowelSounds.label} />
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Digital Rectal Examination">
        <SearchComboBox multiple={false} options={generalOptions} label={form.general.label} name={form.general.name} />
        <SearchComboBox sx={{mt:'1ch'}} multiple={false} options={prostateOptions} label={form.prostate.label} name={form.prostate.name} />
        <RadioGroupInput row sx={{mt:'1ch'}} name={form.mass.name} label={form.mass.label} options={radioOptions} />
        {formValues[form.mass.name]==YES && <TextInputField sx={{width:'100%'}} id={form.massDescription.name} name={form.massDescription.name} label={form.massDescription.label} />}
        <SearchComboBox sx={{mt:'1ch'}} multiple={false} options={sphincterOptions} label={form.sphincterTone.label} name={form.sphincterTone.name} />
      
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
