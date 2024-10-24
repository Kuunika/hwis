"use client";
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
import { getOnePatient } from "@/hooks/patientReg";
import { useParameters } from "@/hooks";

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
  generalInspection: {
    name: concepts.GENERAL_INSPECTION,
    label: "General",
  },
  circumcisionStatus: {
    name: concepts.CIRCUMCISION_STATUS,
    label: "Is the patient circumcised?",
  },
  unusualAppearance: {
    name: concepts.UNUSUAL_SIZE_APPEARANCE_OF_CLITORIS,
    label: "is there unusual appearance of clitoris",
  },
  urethralMeatus: {
    name: concepts.URETHRAL_MEATUS,
    label: "Urethral Meatus",
  },
  vagina: {
    name: concepts.VAGINA,
    label: "Vagina",
  },
  scrotum: {
    name: concepts.SCROTUM,
    label: "Scrotum",
  },
  periymen: {
    name: concepts.PERIHYMEN,
    label: "PERIHYMEN",
  },
  digitalVaginalExamination: {
    name: concepts.DIGITAL_VAGINAL_EXAMINATION,
    label: "Digital Vaginal Examination",
  },
  pelvicExamination: {
    name: concepts.PELVIC_EXAMINATION,
    label: "Pelvic Examination",
  },
  additionalNotes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
  testicles: {
    name: concepts.TESTICLES,
    label: "Does the scrotum have both testicles",
  },
  testiclesNotes: {
    name: concepts.TESTICLES_NOTES,
    label: "Scrotum Notes",
  },
  digitalVaginalExaminationNotes: {
    name: concepts.DIGITAL_VAGINAL_EXAMINATION_NOTES,
    label: "Vaginal Examination Notes",
  },
  unusualAppearanceNotes: {
    name: concepts.UNUSUAL_APPEARANCE_NOTES,
    label: "Unusual Appearance Notes",
  },
  periymenNotes: {
    name: concepts.PERIHYMEN_NOTES,
    label: "Perihymen Notes",
  },
  vaginaNotes: {
    name: concepts.VAGINA_NOTES,
    label: "Vagina Notes",
  },
  generalNotes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Notes",
  },
  urethralMeatusNotes: {
    name: concepts.URETHRAL_NOTES,
    label: "Urethral Notes",
  },
  scrotumNotes: {
    name: concepts.SCROTUM_NOTES,
    label: "Scrotum Notes",
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
  [form.shiftingDullness.name]: Yup.string()
    .required()
    .label(form.shiftingDullness.label),
  [form.fluidThrill.name]: Yup.string()
    .required()
    .label(form.fluidThrill.label),
  [form.bruit.name]: Yup.string().label(form.bruit.label).required(),
  [form.bowelSounds.name]: Yup.string()
    .label(form.bowelSounds.label)
    .required(),
  [form.general.name]: Yup.string().label(form.general.label).required(),
  [form.prostate.name]: Yup.string().label(form.prostate.label).required(),
  [form.mass.name]: Yup.string().label(form.mass.label).required(),
  [form.massDescription.name]: Yup.string().label(form.massDescription.label),
  [form.sphincterTone.name]: Yup.string()
    .required()
    .label(form.sphincterTone.label),
  [form.periymen.name]: Yup.array().label(form.periymen.label),
  [form.scrotum.name]: Yup.array().label(form.scrotum.label),
  [form.vagina.name]: Yup.array().label(form.vagina.label),
  [form.urethralMeatus.name]: Yup.array().label(form.urethralMeatus.label),
  [form.unusualAppearance.name]: Yup.string().label(
    form.unusualAppearance.label
  ),
  [form.circumcisionStatus.name]: Yup.string().label(
    form.circumcisionStatus.label
  ),
  [form.generalInspection.name]: Yup.array().label(
    form.generalInspection.label
  ),
  [form.pelvicExamination.name]: Yup.string().label(
    form.pelvicExamination.label
  ),
  [form.additionalNotes.name]: Yup.string().label(form.additionalNotes.label),
  [form.testicles.name]: Yup.string().label(form.testicles.label),
  [form.testiclesNotes.name]: Yup.string().label(form.testiclesNotes.label),
  [form.digitalVaginalExaminationNotes.name]: Yup.string().label(
    form.digitalVaginalExaminationNotes.label
  ),
  [form.unusualAppearanceNotes.name]: Yup.string().label(
    form.unusualAppearanceNotes.label
  ),
  [form.periymenNotes.name]: Yup.string().label(form.periymenNotes.label),
  [form.vaginaNotes.name]: Yup.string().label(form.vaginaNotes.label),
  [form.generalNotes.name]: Yup.string().label(form.generalNotes.label),
  [form.urethralMeatusNotes.name]: Yup.string().label(
    form.urethralMeatusNotes.label
  ),
  [form.scrotumNotes.name]: Yup.string().label(form.scrotumNotes.label),
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

const generalInspectionOptions = [
  { id: concepts.ULCERATIONS, label: "Ulceration/Lacerations" },
  { id: concepts.BITE_MARKS, label: "Bite marks" },
  { id: concepts.OEDEMA, label: "Oedema" },
  { id: concepts.HAEMATOMA, label: "Hematomas" },
  { id: concepts.DISCOLORATIONS, label: "Discolorations" },
];
const urethralOptions = [
  { id: concepts.INFLAMMATION, label: "Inflammation" },
  { id: concepts.OEDEMA, label: "Oedema" },
  { id: concepts.LESIONS, label: "Lesions around periurethral tissue" },
  { id: concepts.BLEEDING, label: "Bleeding or Discharge from the Uretha" },
];
const digitalVaginalOptions = [
  { id: concepts.FOREIGN_BODIES, label: "Foreign Bodies" },
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.PALPABLE_ABNORMALITIES, label: "Palpable Abnormalities" },
  { id: concepts.BLEEDING, label: "On Withdrawal of fingers bleeding" },
  { id: concepts.DISCHARGE, label: "Discharge" },
];
const perihymenOptions = [
  { id: concepts.ABRASIONS, label: "Abrasions" },
  { id: concepts.LACERATION, label: "Lacerations Scarring" },
];

const vaginaOptions = [
  { id: concepts.BLEEDING, label: "Visible Bleeding" },
  { id: concepts.DISCHARGE, label: "Discharge" },
  { id: concepts.LACERATION, label: "Laceration" },
];
const scrotumOptions = [
  { id: concepts.ERYTHEMA, label: "Erythema" },
  { id: concepts.ECCHYMOSES, label: "Ecchymoses" },
  { id: concepts.ABRASIONS, label: "Abrasions" },
  { id: concepts.SWELLING, label: "Swelling" },
];

const bowelSounds = [
  { id: concepts.HYPERACTIVE, label: "Hyperactive" },
  { id: concepts.REDUCED_BOWEL_SOUNDS, label: "Reduced" },
  { id: concepts.ABSENT, label: "Absent" },
];
export const AbdomenPelvisForm = ({ onSubmit }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showSpecify, setShowSpecify] = useState(false);
  const { params } = useParameters();
  const { data: patient, isLoading } = getOnePatient(params?.id as string);

  const handleValueChange = (values: Array<any>) => {
    setShowSpecify(Boolean(values.find((v) => v.id == concepts.OTHER)));
  };

  const gender = "Male"; //patient && patient?.gender;

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
                multiline
                rows={5}
                sx={{ width: "100%" }}
                id={form.hepatomegalyDescription.name}
                name={form.hepatomegalyDescription.name}
                label={form.hepatomegalyDescription.label}
              />
            )}
          </>
          <>
            {formValues[form.splenomegaly.name] == YES && (
              <TextInputField
                multiline
                rows={5}
                sx={{ width: "100%" }}
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
            multiline
            rows={5}
            sx={{ width: "100%" }}
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
        <SearchComboBox
          multiple={false}
          options={bowelSounds}
          name={form.bowelSounds.name}
          label={form.bowelSounds.label}
        />
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Digital Rectal Examination">
        <SearchComboBox
          multiple={false}
          options={generalOptions}
          label={form.general.label}
          name={form.general.name}
        />
        <SearchComboBox
          sx={{ mt: "1ch" }}
          multiple={false}
          options={prostateOptions}
          label={form.prostate.label}
          name={form.prostate.name}
        />
        <RadioGroupInput
          row
          sx={{ mt: "1ch" }}
          name={form.mass.name}
          label={form.mass.label}
          options={radioOptions}
        />
        {formValues[form.mass.name] == YES && (
          <TextInputField
            multiline
            rows={5}
            sx={{ width: "100%" }}
            id={form.massDescription.name}
            name={form.massDescription.name}
            label={form.massDescription.label}
          />
        )}
        <SearchComboBox
          sx={{ mt: "1ch" }}
          multiple={false}
          options={sphincterOptions}
          label={form.sphincterTone.label}
          name={form.sphincterTone.name}
        />
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Examination of Genitalia (inspection)">
        {gender == "Male" && (
          <>
            <SearchComboBox
              options={generalInspectionOptions}
              name={form.generalInspection.name}
              label={form.generalInspection.label}
            />
            {formValues[form.generalInspection.name]?.length > 0 && (
              <TextInputField
                multiline
                rows={5}
                sx={{ width: "100%", mt: "1ch" }}
                name={form.generalNotes.name}
                id={form.generalNotes.name}
                label={form.generalNotes.label}
              />
            )}
            <RadioGroupInput
              row
              options={radioOptions}
              name={form.circumcisionStatus.name}
              label={form.circumcisionStatus.label}
            />
            <SearchComboBox
              sx={{ mt: "1ch" }}
              options={urethralOptions}
              name={form.urethralMeatus.name}
              label={form.urethralMeatus.label}
            />
            {formValues[form.urethralMeatus.name]?.length > 0 && (
              <TextInputField
                multiline
                rows={5}
                sx={{ width: "100%", mt: "1ch" }}
                name={form.urethralMeatusNotes.name}
                id={form.urethralMeatusNotes.name}
                label={form.urethralMeatusNotes.label}
              />
            )}
            <SearchComboBox
              sx={{ mt: "1ch" }}
              options={scrotumOptions}
              name={form.scrotum.name}
              label={form.scrotum.label}
            />
            {formValues[form.scrotum.name]?.length > 0 && (
              <TextInputField
                multiline
                rows={5}
                sx={{ width: "100%", mt: "1ch" }}
                name={form.scrotumNotes.name}
                id={form.scrotumNotes.name}
                label={form.scrotumNotes.label}
              />
            )}
          </>
        )}
        {gender == "Female" && (
          <>
            <RadioGroupInput
              row
              options={radioOptions}
              name={form.unusualAppearance.name}
              label={form.unusualAppearance.label}
            />
            {formValues[form.unusualAppearance.name] == YES && (
              <TextInputField
                multiline
                rows={5}
                sx={{ width: "100%", mt: "1ch" }}
                name={form.unusualAppearanceNotes.name}
                id={form.unusualAppearanceNotes.name}
                label={form.unusualAppearanceNotes.label}
              />
            )}
            <SearchComboBox
              sx={{ mt: "1ch" }}
              options={perihymenOptions}
              name={form.periymen.name}
              label={form.periymen.label}
            />
            {formValues[form.periymen.name]?.length > 0 && (
              <TextInputField
                multiline
                rows={5}
                sx={{ width: "100%", mt: "1ch" }}
                name={form.periymenNotes.name}
                id={form.periymenNotes.name}
                label={form.periymenNotes.label}
              />
            )}
            <SearchComboBox
              sx={{ mt: "1ch" }}
              options={vaginaOptions}
              name={form.vagina.name}
              label={form.vagina.label}
            />
            {formValues[form.vagina.name]?.length > 0 && (
              <TextInputField
                multiline
                rows={5}
                sx={{ width: "100%", mt: "1ch" }}
                name={form.vaginaNotes.name}
                id={form.vaginaNotes.name}
                label={form.vaginaNotes.label}
              />
            )}
          </>
        )}
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Examination of Genitalia (Palpation)">
        {gender == "Female" && (
          <>
            <SearchComboBox
              sx={{ mt: "1ch" }}
              label={form.digitalVaginalExamination.label}
              name={form.digitalVaginalExamination.name}
              options={digitalVaginalOptions}
            />
            {formValues[form.digitalVaginalExamination.name]?.length > 0 && (
              <TextInputField
                multiline
                rows={5}
                sx={{ width: "100%", mt: "1ch" }}
                name={form.digitalVaginalExaminationNotes.name}
                id={form.digitalVaginalExaminationNotes.name}
                label={form.digitalVaginalExaminationNotes.label}
              />
            )}
          </>
        )}
        {gender == "Male" && (
          <>
            <RadioGroupInput
              name={form.testicles.name}
              label={form.testicles.label}
              row
              options={radioOptions}
            />

            {formValues[form.testicles.name] == NO && (
              <TextInputField
                multiline
                rows={5}
                sx={{ width: "100%", mt: "2ch" }}
                name={form.testiclesNotes.name}
                id={form.testiclesNotes.name}
                label={form.testiclesNotes.label}
              />
            )}
          </>
        )}
      </FormFieldContainerLayout>
      {gender == "Female" && (
        <FormFieldContainerLayout title="Pelvic Examination">
          <TextInputField
            sx={{ width: "100%" }}
            name={form.pelvicExamination.name}
            label={form.pelvicExamination.label}
            id={form.pelvicExamination.name}
          />
        </FormFieldContainerLayout>
      )}
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
