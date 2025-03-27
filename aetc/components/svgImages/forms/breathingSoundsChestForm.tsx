import {
  FormikInit,
  FormValuesListener,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { getCachedConcept } from "@/helpers/data";
import { Box, Button } from "@mui/material";
import { useState } from "react";

import * as Yup from "yup";

const form = {
  breathSounds: {
    name: concepts.BREATHING_SOUNDS,
    label: "Breath Sounds",
  },
  addedBreathSounds: {
    name: concepts.ADDED_BREATH_SOUNDS,
    label: "Check for added breath sounds",
  },
  breathSoundsList: {
    name: concepts.BREATH_SOUNDS,
    label: "Select added breath sounds",
  },

  vocalFremitus: {
    name: concepts.VOCAL_FREMITUS,
    label: "Vocal Fremitus",
  },
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
  [form.abnormalities.name]: Yup.string().label(form.abnormalities.label),
  [form.specify.name]: Yup.string().label(form.specify.label),
  [form.added.name]: Yup.array().label(form.added.label),
  [form.breathSounds.name]: Yup.string()
    .required()
    .label(form.breathSounds.label),
  [form.breathSoundsList.name]: Yup.array().label(form.breathSoundsList.label),
  [form.vocalFremitus.name]: Yup.string()
    .required()
    .label(form.vocalFremitus.label),
  [form.addedBreathSounds.name]: Yup.string().label(
    form.addedBreathSounds.label
  ),
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
  { id: concepts.BRONCHIAL, label: "Bronchial" },
  { id: concepts.OTHER, label: "Other" },
];

const radioOptions = [
  { label: "Normal", value: concepts.NORMAL },
  { label: "Abnormal", value: concepts.ABNORMAL },
  { label: "Absent", value: concepts.ABSENT },
  { label: "Reduced", value: concepts.REDUCED },
  { label: "Added", value: concepts.ADDED },
];

const chestExpansionOptions = [
  { value: concepts.NORMAL, label: "Normal" },
  { value: concepts.REDUCED, label: "Reduced" },
  { value: concepts.INCREASED, label: "Increased" },
];

export const BreathingSoundsChestLungForm = (props: Props) => {
  const [showOther, setOther] = useState(false);
  const [showAdded, setAdded] = useState(false);
  const [formValues, setFormValues] = useState<any>({});

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={getInitialValues(form)}
      onSubmit={(values: any) =>
        props.onSubmit(
          values,
          getFormLabels(form, options, [
            ...chestExpansionOptions,
            ...radioOptions,
          ])
        )
      }
      submitButton={false}
      submitButtonText="next"
    >
      <FormValuesListener getValues={setFormValues} />
      <RadioGroupInput
        row
        name={form.breathSounds.name}
        label={form.breathSounds.label}
        options={radioOptions}
      />

      {(formValues[form.breathSounds.name] == concepts.REDUCED ||
        formValues[form.breathSounds.name] == concepts.ADDED) && (
        <>
          {formValues[form.breathSounds.name] == concepts.REDUCED && (
            <RadioGroupInput
              row
              name={form.addedBreathSounds.name}
              label={form.addedBreathSounds.label}
              options={[
                { label: "YES", value: concepts.YES },
                { label: "NO", value: concepts.NO },
              ]}
            />
          )}
          {(formValues[form.addedBreathSounds.name] == concepts.YES ||
            formValues[form.breathSounds.name] == concepts.ADDED) && (
            <>
              <SearchComboBox
                name={form.breathSoundsList.name}
                label={form.breathSoundsList.label}
                options={addedOptions}
                multiple
              />
              {Array.isArray(formValues[form.breathSoundsList.name]) &&
                formValues[form.breathSoundsList.name].find(
                  (opt: any) => opt.id == concepts.OTHER
                ) && (
                  <TextInputField
                    name={form.specify.name}
                    label={form.specify.label}
                    id={form.specify.label}
                    multiline
                    rows={5}
                    sx={{ width: "100%" }}
                  />
                )}
            </>
          )}
        </>
      )}
      {/* 
      {formValues[concepts.BREATHING_SOUNDS] == concepts.ABNORMAL && (
        <>
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
            coded
          />

          {showAdded && (
            <>
              <br />
              <SearchComboBox
                name={form.added.name}
                label={form.added.label}
                options={addedOptions}
                coded
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
        </>
      )} */}

      <RadioGroupInput
        row
        name={form.vocalFremitus.name}
        label={form.vocalFremitus.label}
        options={chestExpansionOptions}
      />

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
