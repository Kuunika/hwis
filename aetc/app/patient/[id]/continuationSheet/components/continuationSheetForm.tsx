import { FormikInit, TextInputField } from "@/components";
import { encounters } from "@/constants";
import { getInitialValues, getObservations } from "@/helpers";
import { useServerTime } from "@/contexts/serverTimeContext";
import { useNavigation, useSubmitEncounter } from "@/hooks";
import { Box, Button } from "@mui/material";
import * as Yup from "yup";

const form = {
  notes: {
    name: "Clinical notes construct",
    label: "Notes",
  },
};

const validationSchema = Yup.object().shape({
  [form.notes.name]: Yup.string().required(form.notes.label),
});

const initialValues = getInitialValues(form);

export const ContinuationSheetForm = () => {
  const { navigateBack } = useNavigation();
  const { handleSubmit } = useSubmitEncounter(encounters.CLINICAL_NOTES, () =>
    navigateBack()
  );

  const handleSubmitForm = (values: any) => {
    const { ServerTime } = useServerTime();
    handleSubmit(getObservations(values, ServerTime.getServerTimeString()));
  };

  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
      submitButton={false}
    >
      <Box>
        <TextInputField
          label={form.notes.label}
          name={form.notes.name}
          multiline
          id={form.notes.name}
          rows={6}
          sx={{ width: "100%" }}
        />
      </Box>
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </FormikInit>
  );
};
