import { Box, Button } from "@mui/material";
import * as Yup from "yup";
import { FormikInit, SearchComboBox } from "@/components";
import { getFormLabels, getInitialValues } from "@/helpers";
import { concepts } from "@/constants";

const form = {
  description: {
    name: concepts.DESCRIPTION,
    label: "Description",
  },
};

const options = [
  { id: "Deformity", label: "Deformity" },
  { id: "Crepitus", label: "Crepitus" },
  { id: "Tenderness", label: "Tenderness" },
];

const schema = Yup.object().shape({
  [form.description.name]: Yup.string()
    .required()
    .label(form.description.label),
});
type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};
export const LegDeformityForm = (props: Props) => {
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
        multiple={false}
        name={form.description.name}
        label={form.description.label}
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
