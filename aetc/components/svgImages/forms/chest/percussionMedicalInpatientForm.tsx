import { FormikInit, TextInputField } from "@/components";
import { concepts } from "@/constants";
import { getFormLabels, getInitialValues } from "@/helpers";
import { Box, Button } from "@mui/material";

import * as Yup from "yup";

const form = {
  percussion: {
    name: concepts.PERCUSSION,
    label: "Percussion",
  },
};

const schema = Yup.object().shape({
  [form.percussion.name]: Yup.string().required().label(form.percussion.label),
});

type Props = {
  onSubmit: (values: any, formConceptsLabels: any) => void;
  onCancel: () => void;
};

export const PercussionMedicalInPatientForm = (props: Props) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={getInitialValues(form)}
      onSubmit={(values: any) =>
        props.onSubmit(values, getFormLabels(form, [], []))
      }
      submitButton={false}
      submitButtonText="next"
    >
      <TextInputField
        multiline
        rows={5}
        id={form.percussion.name}
        name={form.percussion.name}
        sx={{ width: "100%" }}
        label={form.percussion.label}
      />
      <Box sx={{ display: "flex", mt: "1ch", gap: "0.2ch" }}>
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
