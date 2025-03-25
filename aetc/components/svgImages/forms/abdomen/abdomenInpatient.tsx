import {
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts, NO, YES } from "@/constants";
import { getInitialValues, getFormLabels } from "@/helpers";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

import * as Yup from "yup";

const form = {
  inspection: {
    name: concepts.GENERAL_INSPECTION,
    label: "Inspection",
  },
  lightPalpation: {
    name: concepts.LIGHT_PALPATION,
    label: "Light Palpation",
  },
  deepPalpation: {
    name: concepts.DEEP_PALPATION,
    label: "Deep Palpation",
  },
  auscultation: {
    name: concepts.AUSCULTATION_LUNG,
    label: "Auscultation",
  },
  dullness: {
    name: concepts.SHIFTING_DULLNESS,
    label: "Shifting Dullness",
  },
  fluidThrill: {
    name: concepts.FLUID_THRILL,
    label: "Fluid Thrill",
  },
};

const schema = Yup.object().shape({
  [form.lightPalpation.name]: Yup.string()
    .required()
    .label(form.lightPalpation.label),
  [form.inspection.name]: Yup.array().label(form.inspection.label),
  [form.deepPalpation.name]: Yup.string().label(form.deepPalpation.label),
  [form.fluidThrill.name]: Yup.string().label(form.fluidThrill.label),
  [form.dullness.name]: Yup.string().label(form.dullness.label),
  [form.auscultation.name]: Yup.string().label(form.auscultation.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.STAB_PUNCTURE, label: "Stab/Puncture" },
  { id: concepts.BRUISE, label: "Bruise" },
  { id: concepts.BURNS, label: "Burns" },
  { id: concepts.WOUND, label: "Wound" },
];

const yesNoOptions = [
  { value: YES, label: "Yes" },
  { value: NO, label: "No" },
];

export const AbdomenMedicalInpatient = (props: Props) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={getInitialValues(form)}
      onSubmit={(values: any) =>
        props.onSubmit(values, getFormLabels(form, options, yesNoOptions))
      }
      submitButton={false}
      submitButtonText="next"
    >
      <SearchComboBox
        name={form.inspection.name}
        label={form.inspection.label}
        options={options}
      />
      <TextInputField
        multiline
        rows={5}
        sx={{ width: "100%" }}
        name={form.lightPalpation.name}
        label={form.lightPalpation.label}
        id={form.lightPalpation.label}
      />
      <TextInputField
        multiline
        rows={5}
        sx={{ width: "100%" }}
        name={form.deepPalpation.name}
        label={form.deepPalpation.label}
        id={form.deepPalpation.label}
      />
      <TextInputField
        multiline
        rows={5}
        sx={{ width: "100%" }}
        name={form.auscultation.name}
        label={form.auscultation.label}
        id={form.auscultation.label}
      />
      <RadioGroupInput
        name={form.dullness.name}
        row
        label={form.dullness.label}
        options={yesNoOptions}
      />
      <RadioGroupInput
        name={form.fluidThrill.name}
        row
        label={form.fluidThrill.label}
        options={yesNoOptions}
      />
      <br />
      <Box sx={{ display: "flex", gap: "0.2ch" }}>
        <Button
          type="submit"
          sx={{ borderRadius: "1px" }}
          variant="contained"
          fullWidth
        >
          Submit
        </Button>
        <Button sx={{ borderRadius: "1px" }} fullWidth onClick={props.onCancel}>
          Cancel
        </Button>
      </Box>
    </FormikInit>
  );
};
