import {
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts, NO, YES } from "@/constants";
import { getInitialValues, getFormLabels } from "@/helpers";
import { Box, Button } from "@mui/material";

import * as Yup from "yup";

const form = {
  wound: {
    name: concepts.WOUND,
    label: "Wound",
  },
  tenderness: {
    name: concepts.TENDERNESS,
    label: "Tenderness",
  },
  abnormality: {
    name: concepts.ABNORMALITIES,
    label: "Are there abnormalities?",
  },
};

const schema = Yup.object().shape({
  [form.abnormality.name]: Yup.string()
    .required()
    .label(form.abnormality.label),
  [form.wound.name]: Yup.array().label(form.wound.label),
  [form.tenderness.name]: Yup.array().label(form.tenderness.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.LACERATION, label: "Laceration" },
  { id: concepts.STAB_PUNCTURE, label: "Stab/Puncture" },
  { id: concepts.BRUISE, label: "Bruise" },
  { id: concepts.BURNS, label: "Burns" },
  { id: concepts.WOUND, label: "Wound" },
];

const yesNoOptions = [
  { value: YES, label: "Yes" },
  { value: NO, label: "No" },
];

export const OtherAbnormalityForm = (props: Props) => {
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
      <RadioGroupInput
        options={yesNoOptions}
        name={form.abnormality.name}
        label={form.abnormality.label}
      />
      <SearchComboBox
        name={form.tenderness.name}
        label={form.tenderness.label}
        options={options}
      />
      <SearchComboBox
        name={form.wound.name}
        label={form.wound.label}
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
