import { Box, Button } from "@mui/material";
import * as Yup from "yup";
import {
  DashedContainer,
  FieldsContainer,
  FormikInit,
  FormValuesListener,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts, NO, YES } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { useState } from "react";

const form = {
  deformity: {
    name: concepts.DEFORMITY,
    label: "Deformity",
  },
  deformityDescription: {
    name: concepts.DEFORMITY_DESCRIPTION,
    label: "Deformity Description",
  },
  fracture: {
    name: concepts.FRACTURE,
    label: "Fracture",
  },
  fractureDescription: {
    name: concepts.FRACTURE_DESCRIPTION,
    label: "Fracture Description",
  },
  burns: {
    name: concepts.BURNS,
    label: "Burns",
  },
  burnsDescription: {
    name: concepts.BURNS_DESCRIPTION,
    label: "Burns Description",
  },
  mass: {
    name: concepts.MASS,
    label: "Mass",
  },
  tenderness: {
    name: concepts.TENDERNESS,
    label: "Tenderness",
  },
  crepitus: {
    name: concepts.CREPITUS,
    label: "Crepitus",
  },
  massDescription: {
    name: concepts.MASS_DESCRIPTION,
    label: "Mass Description",
  },
  laceration: {
    name: concepts.LACERATION,
    label: "Laceration",
  },
  lacerationLength: {
    name: concepts.LACERATION_LENGTH,
    label: "Laceration Length",
  },
  lacerationDepth: {
    name: concepts.LACERATION_DEPTH,
    label: "Laceration Depth",
  },
  lacerationOther: {
    name: concepts.LACERATION_OTHER,
    label: "Laceration Other Descriptors",
  },
  scars: {
    name: concepts.SCARS,
    label: "scars",
  },
  rash: {
    name: concepts.RASH,
    label: "rash",
  },
};

const schema = Yup.object().shape({
  [form.deformity.name]: Yup.string().required().label(form.deformity.label),
  [form.deformityDescription.name]: Yup.string().label(
    form.deformityDescription.label
  ),
  [form.fracture.name]: Yup.string().required().label(form.fracture.label),
  [form.fractureDescription.name]: Yup.string().label(
    form.fractureDescription.label
  ),
  [form.crepitus.name]: Yup.string().required().label(form.crepitus.label),
  [form.mass.name]: Yup.string().required().label(form.mass.label),
  [form.massDescription.name]: Yup.string().label(form.massDescription.label),
  [form.laceration.name]: Yup.string().required().label(form.laceration.label),
  [form.lacerationDepth.name]: Yup.string().label(form.lacerationDepth.label),
  [form.lacerationLength.name]: Yup.string().label(form.lacerationLength.label),
  [form.lacerationOther.name]: Yup.string().label(form.lacerationOther.label),
  [form.scars.name]: Yup.string().required().label(form.scars.label),
  [form.rash.name]: Yup.string().required().label(form.rash.label),
});
const burnsOptions = [
  { value: concepts.SUPERFICIAL, label: "Superficial" },
  { value: concepts.PARTIAL, label: "Partial" },
  { value: concepts.THICKNESS, label: "Thickness" },
  { value: concepts.FULL_THICKNESS, label: "Full Thickness" },
];

const radioOptions = [
  { value: YES, label: "YES" },
  { value: NO, label: "NO" },
];

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};

const initialsValues = getInitialValues(form);

export const ExtremitiesLegForm = (props: Props) => {
  const [formValues, setFormValues] = useState<any>({});
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={(values: any) =>
        props.onSubmit(values, getFormLabels(form, [], radioOptions))
      }
      submitButton={false}
      submitButtonText="next"
    >
      <FormValuesListener getValues={setFormValues} />
      <RadioGroupInput
        row
        options={radioOptions}
        name={form.deformity.name}
        label={form.deformity.label}
      />
      {formValues[form.deformity.name] == YES && (
        <TextInputField
          id={form.deformityDescription.name}
          label={form.deformityDescription.label}
          name={form.deformityDescription.name}
        />
      )}
      <RadioGroupInput
        row
        options={radioOptions}
        name={form.fracture.name}
        label={form.fracture.label}
      />

      {formValues[form.fracture.name] == YES && (
        <TextInputField
          id={form.fractureDescription.name}
          label={form.fractureDescription.label}
          name={form.deformityDescription.name}
        />
      )}

      <RadioGroupInput
        row
        options={radioOptions}
        name={form.crepitus.name}
        label={form.crepitus.label}
      />
      <RadioGroupInput
        row
        options={radioOptions}
        name={form.tenderness.name}
        label={form.tenderness.label}
      />

      <RadioGroupInput
        row
        options={radioOptions}
        name={form.rash.name}
        label={form.rash.label}
      />
      <RadioGroupInput
        row
        options={radioOptions}
        name={form.scars.name}
        label={form.scars.label}
      />

      <RadioGroupInput
        row
        options={radioOptions}
        name={form.burns.name}
        label={form.burns.label}
      />
      {formValues[form.burns.name] == YES && (
        <RadioGroupInput
          row
          options={burnsOptions}
          label={form.burnsDescription.label}
          name={form.burnsDescription.name}
        />
      )}
      <RadioGroupInput
        row
        options={radioOptions}
        name={form.mass.name}
        label={form.mass.label}
      />

      {formValues[form.mass.name] == YES && (
        <TextInputField
          sx={{ width: "100%" }}
          id={form.massDescription.name}
          name={form.massDescription.name}
          label={form.massDescription.label}
        />
      )}

      <RadioGroupInput
        row
        options={radioOptions}
        name={form.laceration.name}
        label={form.laceration.label}
      />
      {formValues[form.laceration.name] == YES && (
        <>
          <TextInputField
            sx={{ width: "100%" }}
            id={form.lacerationLength.name}
            name={form.lacerationLength.name}
            label={form.lacerationLength.label}
          />
          <TextInputField
            sx={{ width: "100%" }}
            id={form.lacerationDepth.name}
            name={form.lacerationDepth.name}
            label={form.lacerationDepth.label}
          />
          <TextInputField
            sx={{ width: "100%" }}
            id={form.lacerationOther.name}
            name={form.lacerationOther.name}
            label={form.lacerationOther.label}
          />
        </>
      )}
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
