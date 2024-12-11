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
  { id: "Wound", label: "Wound" },
  { id: "Surgical Emphyema", label: "Surgical Emphyema" },
  { id: "Rib Deformity", label: "Rib Deformity" },
  { id: "Scar", label: "Scar" },
  { id: "Frail chest", label: "Frail chest" },
  { id: "Intercostal drain situ", label: "Intercostal drain situ" },
  { id: "Other", label: "Other" },
];

const sounds = [
  { id: concepts.CRACKLES, label: "Crackles" },
  { id: concepts.WHEEZES, label: "Wheezes" },
  { id: concepts.BRONCHIAL, label: "Bronchial" },
  { id: concepts.OTHER, label: "other" },
];

export const BreathingSoundsForm = (props: Props) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showAdded, setShowAdded] = useState(false);

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
      <FormValuesListener getValues={setFormValues} />

      <SearchComboBox
        multiple={false}
        name={form.abnormalities.name}
        label={form.abnormalities.label}
        options={[
          {
            id: concepts.ABSENT,
            label: "Absent",
          },
          {
            id: concepts.REDUCED,
            label: "Reduced",
          },
          {
            id: concepts.ADDED,
            label: "Added",
          },
        ]}
      />
      {formValues[form.abnormalities.name] == concepts.REDUCED && (
        <SearchComboBox
          sx={{ width: "100%" }}
          multiple={true}
          options={sounds}
          name={form.reduced.name}
          label={form.reduced.label}
          getValue={(values) => {
            if (values)
              setShowAdded(
                Boolean(values.find((v: any) => v.id == concepts.OTHER))
              );
          }}
        />
      )}
      <br />
      {formValues[form.abnormalities.name] == concepts.ADDED && (
        <>
          <SearchComboBox
            sx={{ width: "100%" }}
            multiple={true}
            options={sounds}
            name={form.reduced.name}
            label={form.reduced.label}
            getValue={(values) => {
              if (values)
                setShowAdded(
                  Boolean(values.find((v: any) => v.id == concepts.OTHER))
                );
            }}
          />
          {showAdded && (
            <TextInputField
              name={form.otherAdded.name}
              label={form.otherAdded.label}
              id={form.otherAdded.name}
              multiline
              rows={3}
              sx={{ width: "100%", mt: "1ch" }}
            />
          )}
        </>
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
