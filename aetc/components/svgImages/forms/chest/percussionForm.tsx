import {
  FormikInit,
  FormValuesListener,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { Box, Button } from "@mui/material";
import { useState } from "react";

import * as Yup from "yup";

const form = {
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Abnormalities",
  },
  reduced: {
    name: concepts.REDUCED,
    label: "Reduced",
  },
  added: {
    name: concepts.ADDED,
    label: "Added",
  },
  otherReduced: {
    name: concepts.OTHER,
    label: "Specify Reduced",
  },
  otherAdded: {
    name: concepts.OTHER_CONDITION,
    label: "Specify Added",
  },
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.string()
    .required()
    .label(form.abnormalities.label),
  [form.reduced.name]: Yup.array().label(form.reduced.label),
  [form.otherAdded.name]: Yup.string().label(form.otherAdded.label),
  [form.otherReduced.name]: Yup.string().label(form.otherReduced.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};

const options = [
  { id: concepts.HYPERRESONANT, label: "Hyperresonant" },
  { id: concepts.DULL, label: "Dull" },
  { id: concepts.STONY_DULL, label: "Stony Dull" },
];

export const PercussionForm = (props: Props) => {
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
      <SearchComboBox
        multiple={false}
        name={form.abnormalities.name}
        label={form.abnormalities.label}
        options={options}
      />
      <Box sx={{ display: "flex", mt: "1ch", gap: "0.2ch" }}>
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
