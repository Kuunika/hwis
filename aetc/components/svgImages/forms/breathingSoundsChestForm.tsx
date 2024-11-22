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
  added: {
    name: concepts.ADDED,
    label: "Added Sounds",
  },
};

const schema = Yup.object().shape({
  [form.abnormalities.name]: Yup.string()
    .required()
    .label(form.abnormalities.label),
  [form.specify.name]: Yup.string().label(form.specify.label),
  [form.added.name]: Yup.array().label(form.added.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.ABSENT, label: "Absent" },
  { id: concepts.REDUCED, label: "Reduced Sounds" },
  { id: concepts.ADDED, label: "Added Sounds" },
  // { id: concepts.BRONCHIAL, label: "Bronchial" },
  { id: concepts.OTHER, label: "Others" },
];

const addedOptions = [
  { id: concepts.CRACKLES, label: "Crackles" },
  { id: concepts.WHEEZES, label: "Wheezes" },
];

export const BreathingSoundsChestLungForm = (props: Props) => {
  const [showOther, setOther] = useState(false);
  const [showAdded, setAdded] = useState(false);

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
          if (!values) return;
          setOther(Boolean(values == concepts.OTHER));
          setAdded(Boolean(values == concepts.ADDED));
        }}
        label={form.abnormalities.label}
        options={options}
      />

      {showAdded && (
        <>
          <br />
          <SearchComboBox
            name={form.added.name}
            label={form.added.label}
            options={addedOptions}
          />
        </>
      )}

      <br />
      {showOther && (
        <TextInputField
          multiline
          rows={2}
          sx={{ width: "100%" }}
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
