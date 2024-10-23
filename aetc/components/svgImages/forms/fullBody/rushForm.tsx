import {
  DashedContainer,
  FieldsContainer,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
  TextInputField,
} from "@/components";
import { concepts } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { Box, Button } from "@mui/material";

import * as Yup from "yup";

const form = {
  description: {
    name: concepts.DESCRIPTION,
    label: "Description of Rush",
  },
  notes: {
    name: concepts.ADDITIONAL_NOTES,
    label: "Additional Notes",
  },
};

const schema = Yup.object().shape({
  [form.description.name]: Yup.array().required().label(form.description.label),
  [form.notes.name]: Yup.string().label(form.notes.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
const options = [
  { id: concepts.BRUISE, label: "Bruise" },
  { id: concepts.PETECHIAE, label: "Petechiae" },
  { id: concepts.URTICARIA, label: "Urtcaria" },
  { id: concepts.BURNS, label: "Burns" },
  { id: concepts.BITE, label: "Bite" },
  { id: concepts.STING, label: "Sting" },
  { id: concepts.MACULE, label: "Macule" },
  { id: concepts.PAPULE, label: "Papule" },
  { id: concepts.VESICLE, label: "Vesicle" },
  { id: concepts.PUSTULE, label: "Pustule" },
  { id: concepts.SCALE, label: "Scale" },
];

export const RushForm = (props: Props) => {
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
        name={form.description.name}
        label={form.description.label}
        options={options}
      />
      <TextInputField
        sx={{
          width: "100%",
          mt: "1ch",
        }}
        name={form.notes.name}
        label={form.notes.label}
        id={form.notes.name}
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
