import {
  FormikInit,
  FormValuesListener,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts, NO, YES } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { getCachedConcept } from "@/helpers/data";
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
  //   TODO: change the concept
  areThereAddedSounds: {
    name: concepts.BOWEL_SOUNDS,
    label: "Are there added sounds",
  },
  added: {
    name: concepts.ADDED,
    label: "Added breath sounds",
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
  [form.areThereAddedSounds.name]: Yup.string().label(
    form.areThereAddedSounds.label
  ),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};

const sounds = [
  { id: concepts.CRACKLES, label: "Crackles" },
  { id: concepts.WHEEZES, label: "Wheezes" },
  { id: concepts.BRONCHIAL, label: "Bronchial" },
  { id: concepts.OTHER, label: "other" },
];

const yesNoOptions = [
  { label: "YES", value: YES },
  { label: "NO", value: NO },
];
const abnormalities = [
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
];

export const BreathingSoundsForm = (props: Props) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showAdded, setShowAdded] = useState(false);

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={getInitialValues(form)}
      onSubmit={(values: any) =>
        props.onSubmit(
          values,
          getFormLabels(form, [...sounds, ...abnormalities], yesNoOptions)
        )
      }
      submitButton={false}
      submitButtonText="next"
    >
      {/* <Box
        sx={{
          maxHeight: "50vh",
          overflow: "auto",
          padding: "1rem",
          backgroundColor: "white",
        }}
      > */}
      <FormValuesListener getValues={setFormValues} />
      <SearchComboBox
        multiple={false}
        name={form.abnormalities.name}
        label={form.abnormalities.label}
        options={abnormalities}
        coded
      />
      {formValues[form.abnormalities.name] == concepts.REDUCED && (
        <>
          <RadioGroupInput
            options={yesNoOptions}
            name={form.areThereAddedSounds.name}
            label={form.areThereAddedSounds.label}
            row
          />

          {formValues[form.areThereAddedSounds.name] == YES && (
            <>
              <SearchComboBox
                sx={{ width: "100%" }}
                multiple={true}
                options={sounds}
                name={form.added.name}
                label={form.added.label}
                coded
                getValue={(values) => {
                  if (values)
                    setShowAdded(
                      Boolean(
                        values.find(
                          (v: any) =>
                            v.id == getCachedConcept(concepts.OTHER)?.uuid
                        )
                      )
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
        </>
      )}
      <br />
      {formValues[form.abnormalities.name] == concepts.ADDED && (
        <>
          <SearchComboBox
            sx={{ width: "100%" }}
            multiple={true}
            options={sounds}
            coded
            name={form.reduced.name}
            label={form.reduced.label}
            getValue={(values) => {
              if (values)
                setShowAdded(
                  Boolean(
                    values.find(
                      (v: any) => v.id == getCachedConcept(concepts.OTHER)
                    )
                  )
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
      {/* </Box> */}
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
