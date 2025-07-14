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
import { NewAbdomenImage } from "@/components/svgImages";
import { getOnePatient } from "@/hooks/patientReg";
import { useParameters, useSubmitEncounter } from "@/hooks";
import { getDateTime } from "@/helpers/dateTime";
import { ContainerLoaderOverlay } from "@/components/containerLoaderOverlay";
import { NewAbdomenFemaleImage } from "@/components/svgImages/abdomenFemaleImage";
import { CheckBoxNext } from "@/components/form/checkBoxNext";
import { useServerTime } from "@/contexts/serverTimeContext";

const form = {
  abdominalDistention: {
    name: concepts.ABDOMINAL_DISTENTION,
    label: "Is there abdominal distention",
  },
  abnormalitiesPresent: {
    name: concepts.ABNORMALITIES_PRESENT,
    label: "Are there abnormalities",
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
    label: "Is the clitoris of unusual size/appearance",
  },
  urethralMeatus: {
    name: concepts.URETHRAL_MEATUS,
    label: "Are there any signs discharge from the urethra meatus",
  },
  vagina: {
    name: concepts.VAGINA,
    label: "Does the vagina have visible bleeding, discharge, lacerations)",
  },
  scrotum: {
    name: concepts.SCROTUM,
    label:
      "Does the scrotum have any erythema, ecchymoses, abrasions, swelling ",
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
  otherDigitalGeneral: {
    name: concepts.OTHER_RECTAL_GENERAL,
    label: "Other",
  },
  prostateOther: {
    name: concepts.PROSTRATE_DESCRIPTION,
    label: "Prostrate Description",
  },
  sphincterOther: {
    name: concepts.SPHINCTER_OTHER,
    label: "Sphincter Description",
  },
  tenderness: {
    name: concepts.TENDERNESS,
    label: "Tenderness",
  },
  laceration: {
    name: concepts.LACERATION,
    label:
      "Are there any ulcerations/lacerations, bite marks of any kind present ",
  },
  lacerationNotes: {
    name: concepts.LACERATION_NOTES,
    label: "Notes",
  },
  hematomas: {
    name: concepts.HEMATOMAS,
    label: "Are there any signs of  oedema, hematomas, discolourations",
  },
  hematomasNotes: {
    name: concepts.HEMATOMAS_NOTES,
    label: "Notes",
  },
  inflammation: {
    name: concepts.INFLAMMATION,
    label:
      "Are there any signs of inflammation, edema, lesions around periurethral tissue, bleeding",
  },
  inflammationNotes: {
    name: concepts.INFLAMMATION_NOTES,
    label: "Notes",
  },

  urethraMeatus: {
    name: concepts.URETHRAL_MEATUS,
    label: "Are there any signs discharge from the urethra meatus",
  },
  descriptionUrethral: {
    name: concepts.URETHRAL_NOTES,
    label: "Urethral Notes",
  },
  perihymen: {
    name: concepts.PERIHYMEN,
    label: "Does the perihymen have abrasions, lacerations scarring",
  },
  perihymenNotes: {
    name: concepts.PERIHYMEN_NOTES,
    label: "Notes",
  },
  examination: {
    name: concepts.GENETELIA_EXAMINATION_REQUIRED,
    label: "Does the condition necessitate genitalia examination?",
  },
  digitalRectalExaminationRequired: {
    name: concepts.DIGITAL_RECTAL_EXAMINATION_REQUIRED,
    label: "Does the condition necessitate digital rectal examination?",
  },
};

type Prop = {
  onSubmit: () => void;
};

const schema = Yup.object().shape({
  [form.abdominalDistention.name]: Yup.string()
    .required()
    .label(form.abdominalDistention.label),
  [form.abnormalitiesPresent.name]: Yup.string()
    .required()
    .label(form.abnormalitiesPresent.label),
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
  [form.general.name]: Yup.array().label(form.general.label),
  [form.prostate.name]: Yup.array().label(form.prostate.label),
  [form.mass.name]: Yup.string().label(form.mass.label),
  [form.massDescription.name]: Yup.string().label(form.massDescription.label),
  [form.sphincterTone.name]: Yup.string().label(form.sphincterTone.label),
  [form.periymen.name]: Yup.array().label(form.periymen.label),
  [form.scrotum.name]: Yup.string().label(form.scrotum.label),
  [form.vagina.name]: Yup.string().label(form.vagina.label),
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
  [form.otherDigitalGeneral.name]: Yup.string().label(
    form.otherDigitalGeneral.label
  ),
  [form.prostateOther.name]: Yup.string().label(form.prostateOther.label),
  [form.sphincterOther.name]: Yup.string().label(form.sphincterOther.label),
  [form.tenderness.name]: Yup.string().label(form.tenderness.label),
  [form.laceration.name]: Yup.string().label(form.laceration.label),
  [form.hematomas.name]: Yup.string().label(form.hematomas.label),
  [form.urethraMeatus.name]: Yup.string().label(form.urethraMeatus.label),
  [form.descriptionUrethral.name]: Yup.string().label(
    form.descriptionUrethral.label
  ),
  [form.lacerationNotes.name]: Yup.string().label(form.lacerationNotes.label),
  [form.hematomasNotes.name]: Yup.string().label(form.hematomasNotes.label),
  [form.inflammation.name]: Yup.string().label(form.inflammation.label),
  [form.inflammationNotes.name]: Yup.string().label(
    form.inflammationNotes.label
  ),
  [form.perihymen.name]: Yup.string().label(form.perihymen.label),
  [form.perihymenNotes.name]: Yup.string().label(form.perihymenNotes.label),
  [form.examination.name]: Yup.string().label(form.examination.label),
});

const prostateOptions = [
  { id: concepts.NORMAL, label: "Normal" },
  { id: concepts.ENLARGED, label: "Enlarged" },
  { id: concepts.HIGH_RIDING, label: "High Riding" },
  { id: concepts.OTHER, label: "Other" },
];
const generalOptions = [
  { id: concepts.NORMAL, label: "Normal" },
  { id: concepts.EMPTY_RECTUM, label: "Empty rectum" },
  { id: concepts.MALAENA, label: "Malaena" },
  { id: concepts.FRESH_BLOOD, label: "Fresh blood (Haematochezia)" },
  { id: concepts.HEMORROID, label: "Haemorrhoid" },
  { id: concepts.FISSURE, label: "Fissure" },
  { id: concepts.OTHER, label: "Other" },
];
const sphincterOptions = [
  { id: concepts.NORMAL, label: "Normal" },
  { id: concepts.REDUCED, label: "Reduced" },
  { id: concepts.ABSENT, label: "Absent" },
  { id: concepts.OTHER, label: "Other" },
];

const initialsValues = getInitialValues(form);

const radioOptions = [
  { label: "Yes", value: YES },
  { label: "No", value: NO },
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
  { id: concepts.TENDERNESS, label: "Tenderness" },
  {
    id: concepts.BLEEDING,
    label: "On withdrawal of the fingers look for bleeding, discharge",
  },
  // { id: concepts.DISCHARGE, label: "Discharge" },
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
  { id: concepts.NORMAL, label: "Normal" },
  { id: concepts.HYPERACTIVE, label: "Hyperactive" },
  { id: concepts.REDUCED_BOWEL_SOUNDS, label: "Reduced Bowel Sounds" },
  { id: concepts.ABSENT, label: "Absent" },
];
export const AbdomenPelvisForm = ({ onSubmit }: Prop) => {
  const { ServerTime } = useServerTime();
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState<any>({});
  const [showSpecify, setShowSpecify] = useState(false);
  const { params } = useParameters();
  const { data: patient, isLoading } = getOnePatient(params?.id as string);
  const [abnormalitiesPresentImageEnc, setAbnormalitiesPresentImageEnc] =
    useState<Array<any>>([]);
  const [tendernessImageEnc, setTendernessImageEnc] = useState<Array<any>>([]);
  const { handleSubmit, isLoading: creatingEncounter } = useSubmitEncounter(
    encounters.ABDOMEN_AND_PELVIS_ASSESSMENT,
    onSubmit
  );

  const checkIfExist = (formArrayInput: any, value: string) => {
    if (!Array.isArray(formArrayInput)) return;

    return formArrayInput?.find((op: any) => op.id == value);
  };

  const handleSubmitForm = async (values: any) => {
    const formValues = { ...values };
    const obsDatetime = ServerTime.getServerTimeString();
    const obs = [
      {
        concept: form.abnormalitiesPresent.name,
        value: formValues[form.abnormalitiesPresent.name],
        obsDatetime,
        groupMembers: flattenImagesObs(abnormalitiesPresentImageEnc),
      },
      {
        concept: concepts.PALPATION,
        value: concepts.PALPATION,
        obsDatetime,
        groupMembers: flattenImagesObs(tendernessImageEnc),
      },
    ];

    const generalInspectionObs = mapSearchComboOptionsToConcepts(
      formValues[form.generalInspection.name],
      form.generalInspection.name,
      obsDatetime
    );
    const urethralMeatusObs = mapSearchComboOptionsToConcepts(
      formValues[form.urethralMeatus.name],
      form.urethralMeatus.name,
      obsDatetime
    );
    const scrotumObs = mapSearchComboOptionsToConcepts(
      formValues[form.scrotum.name],
      form.scrotum.name,
      obsDatetime
    );
    const periymenObs = mapSearchComboOptionsToConcepts(
      formValues[form.periymen.name],
      form.periymen.name,
      obsDatetime
    );
    const vaginaObs = mapSearchComboOptionsToConcepts(
      formValues[form.vagina.name],
      form.vagina.name,
      obsDatetime
    );
    const digitalVaginalExaminationObs = mapSearchComboOptionsToConcepts(
      formValues[form.digitalVaginalExamination.name],
      form.digitalVaginalExamination.name,
      obsDatetime
    );
    const generalObs = mapSearchComboOptionsToConcepts(
      formValues[form.general.name],
      form.general.name,
      obsDatetime
    );

    delete formValues[form.generalInspection.name];
    delete formValues[form.scrotum.name];
    delete formValues[form.vagina.name];
    delete formValues[form.periymen.name];
    delete formValues[form.urethralMeatus.name];
    delete formValues[form.abnormalitiesPresent.name];
    delete formValues[form.digitalVaginalExamination.name];
    delete formValues[form.general.name];

    await handleSubmit([
      ...getObservations(formValues, obsDatetime),
      ...obs,
      ...generalInspectionObs,
      ...urethralMeatusObs,
      ...scrotumObs,
      ...periymenObs,
      ...vaginaObs,
      ...digitalVaginalExaminationObs,
      ...generalObs,
    ]);
  };

  const handleValueChange = (values: Array<any>) => {
    setShowSpecify(Boolean(values.find((v) => v.id == concepts.OTHER)));
  };

  const gender = patient && patient?.gender;

  return (
    <ContainerLoaderOverlay loading={isLoading || creatingEncounter}>
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
          submitButtonText="next"
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
              <>
                {/* <SecondaryAbdomenImage
                imageEncounter={encounters.ABDOMEN_AND_PELVIS_ASSESSMENT}
                imageSection={form.abnormalitiesPresent.name}
                onValueChange={setAbnormalitiesPresentImageEnc}
              /> */}
                {gender == "Male" && (
                  <NewAbdomenImage
                    imageEncounter={encounters.ABDOMEN_AND_PELVIS_ASSESSMENT}
                    imageSection={form.abnormalitiesPresent.name}
                    onValueChange={setAbnormalitiesPresentImageEnc}
                    formNameSection="secondaryAbdomen"
                  />
                )}
                {gender == "Female" && (
                  <NewAbdomenFemaleImage
                    imageEncounter={encounters.ABDOMEN_AND_PELVIS_ASSESSMENT}
                    imageSection={form.abnormalitiesPresent.name}
                    onValueChange={setAbnormalitiesPresentImageEnc}
                    formNameSection="secondaryAbdomen"
                  />
                )}
              </>
            )}
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Palpation">
            {gender == "Male" && (
              <NewAbdomenImage
                formNameSection="palpation"
                onValueChange={setTendernessImageEnc}
              />
            )}
            {gender == "Female" && (
              <NewAbdomenFemaleImage
                formNameSection="palpation"
                onValueChange={setTendernessImageEnc}
              />
            )}
            {/* <AbdomenImageWithOtherForm
            formNameSection="palpation"
            onValueChange={setTendernessImageEnc}
          /> */}
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Percussion Tenderness">
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
            <RadioGroupInput
              row
              options={radioOptions}
              name={form.tenderness.name}
              label={form.tenderness.label}
            />
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
            <RadioGroupInput
              row
              options={radioOptions}
              name={form.digitalRectalExaminationRequired.name}
              label={form.digitalRectalExaminationRequired.label}
            />
            {formValues[form.digitalRectalExaminationRequired.name] == YES && (
              <>
                <SearchComboBox
                  multiple
                  options={generalOptions}
                  label={form.general.label}
                  name={form.general.name}
                />
                {checkIfExist(
                  formValues[form.general.name],
                  concepts.OTHER
                ) && (
                  <>
                    <br />
                    <TextInputField
                      id={form.otherDigitalGeneral.name}
                      name={form.otherDigitalGeneral.name}
                      label={form.otherDigitalGeneral.label}
                      multiline={true}
                      rows={4}
                      sx={{ width: "100%" }}
                    />
                  </>
                )}
                {gender == "Male" && (
                  <>
                    <SearchComboBox
                      sx={{ mt: "1ch" }}
                      multiple={true}
                      options={prostateOptions}
                      label={form.prostate.label}
                      name={form.prostate.name}
                    />
                    {checkIfExist(
                      formValues[form.prostate.name],
                      concepts.OTHER
                    ) && (
                      <>
                        <br />
                        <TextInputField
                          multiline
                          rows={4}
                          sx={{ width: "100%" }}
                          name={form.prostateOther.name}
                          label={form.prostateOther.label}
                          id={form.prostateOther.name}
                        />
                      </>
                    )}
                  </>
                )}
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
                {formValues[form.sphincterTone.name] == concepts.OTHER && (
                  <>
                    <br />
                    <TextInputField
                      multiline
                      rows={4}
                      sx={{ width: "100%" }}
                      name={form.sphincterOther.name}
                      label={form.sphincterOther.label}
                      id={form.sphincterOther.name}
                    />
                  </>
                )}
              </>
            )}
          </FormFieldContainerLayout>
          <FormFieldContainerLayout title="Examination of Genitalia (inspection)">
            <RadioGroupInput
              row
              options={radioOptions}
              name={form.examination.name}
              label={form.examination.label}
            />
            {formValues[form.examination.name] == YES && (
              <>
                {gender == "Male" && (
                  <>
                    <RadioGroupInput
                      row
                      options={radioOptions}
                      name={form.circumcisionStatus.name}
                      label={form.circumcisionStatus.label}
                    />
                    <RadioGroupInput
                      row
                      options={radioOptions}
                      name={form.laceration.name}
                      label={form.laceration.label}
                    />

                    {formValues[form.laceration.name] == YES && (
                      <>
                        <br />
                        <TextInputField
                          rows={4}
                          multiline
                          sx={{ width: "100%" }}
                          name={form.lacerationNotes.label}
                          label={form.lacerationNotes.label}
                          id={form.lacerationNotes.name}
                        />
                      </>
                    )}

                    <RadioGroupInput
                      row
                      options={radioOptions}
                      name={form.hematomas.name}
                      label={form.hematomas.label}
                    />
                    {formValues[form.hematomas.name] == YES && (
                      <>
                        <br />
                        <TextInputField
                          rows={4}
                          multiline
                          sx={{ width: "100%" }}
                          name={form.hematomasNotes.label}
                          label={form.hematomasNotes.label}
                          id={form.hematomasNotes.name}
                        />
                      </>
                    )}

                    <RadioGroupInput
                      row
                      options={radioOptions}
                      name={form.inflammation.name}
                      label={form.inflammation.label}
                    />
                    {formValues[form.inflammation.name] == YES && (
                      <>
                        <br />
                        <TextInputField
                          rows={4}
                          multiline
                          sx={{ width: "100%" }}
                          name={form.inflammationNotes.label}
                          label={form.inflammationNotes.label}
                          id={form.inflammationNotes.name}
                        />
                      </>
                    )}

                    <RadioGroupInput
                      row
                      options={radioOptions}
                      name={form.urethralMeatus.name}
                      label={form.urethralMeatus.label}
                    />
                    {formValues[form.urethralMeatus.name] == YES && (
                      <>
                        <br />
                        <TextInputField
                          rows={4}
                          multiline
                          sx={{ width: "100%" }}
                          name={form.urethralMeatusNotes.label}
                          label={form.urethralMeatusNotes.label}
                          id={form.urethralMeatusNotes.name}
                        />
                      </>
                    )}

                    {/* <SearchComboBox
                options={generalInspectionOptions}
                multiple
                name={form.generalInspection.name}
                label={form.generalInspection.label}
              /> */}

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

                    {/* <SearchComboBox
                sx={{ mt: "1ch" }}
                options={urethralOptions}
                name={form.urethralMeatus.name}
                label={form.urethralMeatus.label}
              /> */}
                    {/* {formValues[form.urethralMeatus.name]?.length > 0 && (
                <TextInputField
                  multiline
                  rows={5}
                  sx={{ width: "100%", mt: "1ch" }}
                  name={form.urethralMeatusNotes.name}
                  id={form.urethralMeatusNotes.name}
                  label={form.urethralMeatusNotes.label}
                />
              )} */}

                    <RadioGroupInput
                      row
                      name={form.scrotum.name}
                      label={form.scrotum.label}
                      options={radioOptions}
                    />

                    {/* <SearchComboBox
                sx={{ mt: "1ch" }}
                options={scrotumOptions}
                name={form.scrotum.name}
                label={form.scrotum.label}
              /> */}
                    {formValues[form.scrotum.name] == YES && (
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

                    <RadioGroupInput
                      row
                      options={radioOptions}
                      name={form.perihymen.name}
                      label={form.perihymen.label}
                    />
                    {formValues[form.periymen.name] == YES && (
                      <TextInputField
                        multiline
                        rows={5}
                        sx={{ width: "100%", mt: "1ch" }}
                        name={form.periymenNotes.name}
                        id={form.periymenNotes.name}
                        label={form.periymenNotes.label}
                      />
                    )}

                    {/* <SearchComboBox
                sx={{ mt: "1ch" }}
                options={perihymenOptions}
                name={form.periymen.name}
                label={form.periymen.label}
              /> */}

                    <RadioGroupInput
                      row
                      options={radioOptions}
                      name={form.vagina.name}
                      label={form.vagina.label}
                    />

                    {formValues[form.vagina.name] == YES && (
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
              </>
            )}
          </FormFieldContainerLayout>

          {formValues[form.examination.name] == YES && (
            <>
              <FormFieldContainerLayout title="Examination of Genitalia (Palpation)">
                {gender == "Female" && (
                  <>
                    <SearchComboBox
                      sx={{ mt: "1ch" }}
                      label={form.digitalVaginalExamination.label}
                      name={form.digitalVaginalExamination.name}
                      options={digitalVaginalOptions}
                    />
                    {formValues[form.digitalVaginalExamination.name]?.length >
                      0 && (
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
            </>
          )}

          {gender == "Female" && (
            <FormFieldContainerLayout title="Speculum Examination">
              <TextInputField
                sx={{ width: "100%" }}
                name={form.pelvicExamination.name}
                label={form.pelvicExamination.label}
                id={form.pelvicExamination.name}
                multiline
                rows={5}
              />
            </FormFieldContainerLayout>
          )}
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
