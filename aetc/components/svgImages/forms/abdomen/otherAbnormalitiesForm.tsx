import {
  FormikInit,
  FormValuesListener,
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
  other: {
    name: concepts.OTHER,
    label: "Specify",
  },
  abnormalities: {
    name: concepts.ABNORMALITIES,
    label: "Abnormalities",
  },
  abnormality: {
    name: concepts.ABNORMALITIES_PRESENT,
    label: "Are there abnormalities on this Region",
  },
};

const schema = Yup.object().shape({
  [form.abnormality.name]: Yup.string()
    .required()
    .label(form.abnormality.label),
  [form.other.name]: Yup.string().label(form.other.label),
  [form.abnormalities.name]: Yup.array().label(form.abnormalities.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.TENDERNESS, label: "Tenderness" },
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.STAB_PUNCTURE, label: "Stab/Puncture" },
  { id: concepts.BRUISE, label: "Bruise" },
  { id: concepts.BURNS, label: "Burns" },
  { id: concepts.OTHER, label: "Other" },
];

const yesNoOptions = [
  { value: YES, label: "Yes" },
  { value: NO, label: "No" },
];

export const OtherAbnormalityForm = (props: Props) => {
  const [show, setShow] = useState(false);
  const [formValues, setFormValues] = useState<any>({});
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
      <FormValuesListener getValues={setFormValues} />
      <>
        <RadioGroupInput
          options={yesNoOptions}
          name={form.abnormality.name}
          label={form.abnormality.label}
          row
          getValue={(value) => setShow(value === YES)}
        />
        {show && (
          <>
            <br />
            <Typography color={"grey"} variant="h6">
              Select Descriptions if applicable
            </Typography>
            <br />
            <SearchComboBox
              name={form.abnormalities.name}
              label={form.abnormalities.label}
              options={options}
            />

            {Array.isArray(formValues[form.abnormalities.name]) &&
              formValues[form.abnormalities.name].find(
                (opt: any) => opt.id == concepts.OTHER
              ) && (
                <TextInputField
                  multiline
                  rows={5}
                  sx={{ width: "100%" }}
                  name={form.other.name}
                  label={form.other.label}
                  id={form.other.name}
                />
              )}
          </>
        )}
        <br />
      </>

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
