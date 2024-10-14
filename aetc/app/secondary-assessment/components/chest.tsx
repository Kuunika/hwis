import { GenericDialog, NotificationContainer } from "@/components";
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
import { ChestLung } from "@/components/svgImages";
import { Box } from "@mui/material";

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

  isAirwayPatent: {
    name: concepts.AIRWAY_PATENT,
    label: "Is Airway Patent",
  },
  isPatientInjured: {
    name: concepts.PATIENT_INJURED,
    label: "Is Patient Injured",
  },
  neckCollar: {
    name: concepts.NECK_COLLAR_APPLIED,
    label: "Neck Collar Applied",
  },
  weakness: {
    name: concepts.WEAKNESS,
    label: "Weakness",
  },
  headBlocks: {
    name: concepts.HEAD_BLOCKS_APPLIED,
    label: "Head Blocks Applied",
  },
  airWayThreatenedReason: {
    name: concepts.AIRWAY_REASON,
    label: "Reason",
  },
  otherReason: {
    name: "otherReason",
    label: "Specify",
  },
  intervention: {
    name: concepts.AIRWAY_OPENING_INTERVENTION,
    label: "Airway Opening Intervention",
  },
  nasopharyngealSize: {
    name: concepts.NASOPHARYNGEAL_AIRWAY,
    label: "Nasopharyngeal Airway Size",
  },
  oropharyngealSize: {
    name: concepts.OROPHARYNGEAL_AIRWAY,
    label: "oropharyngeal Airway Size",
  },
};

type Prop = {
  onSubmit: (values: any) => void;
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

const chestExpansionOptions = [
  { value: concepts.NORMAL, label: "Normal" },
  { value: concepts.REDUCED, label: "Reduced" },
  { value: concepts.INCREASED, label: "Increased" },
];
export const ChestForm = ({ onSubmit }: Prop) => {
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
      <FormFieldContainerLayout title="Lungs">
    
        <TextInputField
          sx={{width:"100%"}}
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
      {formValues[form.localizedChestAbnormality.name] == YES && <ChestLung />}
      <RadioGroupInput
            row={true}
            name={form.chestExpansion.name}
            options={chestExpansionOptions}
            label={form.chestExpansion.label}
          />
          {(formValues[form.chestExpansion.name]==concepts.REDUCED || formValues[form.chestExpansion.name]==concepts.INCREASED) && <ChestLung />}
          <RadioGroupInput
           row={true}
            name={form.tactileFremitus.name}
            options={chestExpansionOptions}
            label={form.tactileFremitus.label}
          />
          {(formValues[form.tactileFremitus.name]==concepts.REDUCED || formValues[form.tactileFremitus.name]==concepts.INCREASED) && <ChestLung />}
      </FormFieldContainerLayout>
    </FormikInit>
  );
};
