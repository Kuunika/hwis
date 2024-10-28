import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { Box, Button } from "@mui/material";
import { useState } from "react";

import * as Yup from "yup";

const form = {
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Description of Abnormality",
  },
};

const schema = Yup.object().shape({
  [concepts.ABNORMALITIES]: Yup.string()
    .required()
    .label(form.abnormalities.label),
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

export const PercussionChestLungForm = (props: Props) => {
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
      <br />
      <SearchComboBox
        multiple={false}
        name={form.abnormalities.name}
        label={form.abnormalities.label}
        options={options}
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
