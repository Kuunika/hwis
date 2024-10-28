import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts } from "@/constants";
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
};

const schema = Yup.object().shape({
  [form.wound.name]: Yup.array().required().label(form.wound.label),
  [form.tenderness.name]: Yup.array().required().label(form.tenderness.label),
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
