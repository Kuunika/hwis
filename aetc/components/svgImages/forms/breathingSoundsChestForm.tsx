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
  specify: {
    name: concepts.SPECIFY,
    label: "Specify",
  },
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.string()
    .required()
    .label(form.abnormalities.label),
  [form.specify.name]: Yup.string().label(form.specify.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.ABSENT, label: "Absent" },
  { id: concepts.REDUCED, label: "Reduced" },
  { id: concepts.ADDED, label: "Added" },
  { id: concepts.CRACKLES, label: "Crackles" },
  { id: concepts.WHEEZES, label: "Wheezes" },
  { id: concepts.BRONCHIAL, label: "Bronchial" },
  { id: concepts.OTHER, label: "Others" },
];

export const BreathingSoundsChestLungForm = (props: Props) => {
  const [showOther, setOther] = useState(false);
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
        getValue={(values) => {
          if (values) setOther(Boolean(values == concepts.OTHER));
        }}
        label={form.abnormalities.label}
        options={options}
      />
      <br />
      {showOther && (
        <TextInputField
          name={form.specify.name}
          label={form.specify.label}
          id={form.specify.name}
        />
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
