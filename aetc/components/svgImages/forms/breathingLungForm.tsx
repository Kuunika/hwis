import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { Box, Button } from "@mui/material";
import { useState } from "react";

import * as Yup from "yup";

const form = {
  description: {
    name: concepts.DESCRIPTION,
    label: "Description of Abnormality",
  },
  notes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Notes",
  },
  specify: {
    name: concepts.SPECIFY,
    label: "Specify",
  },
};

const schema = Yup.object().shape({
  [form.description.name]: Yup.array().required().label(form.description.label),
  [form.notes.name]: Yup.string().required().label(form.notes.label),
  [form.specify.name]: Yup.string().label(form.specify.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.WOUND, label: "Wound" },
  { id: concepts.SURGICAL_EMPHAYEMA, label: "Surgical Emphyema" },
  { id: concepts.RIB_DEFORMITY, label: "Rib Deformity" },
  { id: concepts.FAIL_CHEST, label: "Frail chest" },
  { id: concepts.OTHER, label: "Other" },
];

export const BreathingLungForm = (props: Props) => {
  const [showInputTextDisplay, setShowInputTextDisplay] = useState(false);

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={getInitialValues(form)}
      onSubmit={(values: any) =>
        props.onSubmit(values, getFormLabels(form, options, []))
      }
      submitButton={false}
      submitButtonText="next"
    >
      <TextInputField
        multiline
        rows={2}
        sx={{ width: "100%" }}
        id={form.notes.name}
        name={form.notes.name}
        label={form.notes.label}
      />
      <SearchComboBox
        getValue={(values) => {
          console.log({ objects: values });
          if (values)
            setShowInputTextDisplay(
              Boolean(values.find((v: any) => v.id == concepts.OTHER))
            );
        }}
        name={form.description.name}
        label={form.description.label}
        options={options}
      />
      <br />
      {showInputTextDisplay && (
        <TextInputField
          sx={{ width: "100%" }}
          multiline
          rows={3}
          id={form.specify.name}
          name={form.specify.name}
          label={form.specify.label}
        />
      )}
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
