import { FormikInit, TextInputField } from "@/components";
import { concepts, encounters } from "@/constants";
import { getInitialValues, getObservations } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
import {
  getActivePatientDetails,
  useNavigation,
  useSubmitEncounter,
} from "@/hooks";
import { fetchConceptAndCreateEncounter } from "@/hooks/encounter";
import { getPatient } from "@/services/patient";
import { Box, Button } from "@mui/material";
import * as Yup from "yup";

const form = {
  subjective: {
    name: concepts.SUBJECTIVE,
    label: "Subjective",
  },
  objective: {
    name: concepts.OBJECTIVE,
    label: "Objective",
  },
  assessment: {
    name: concepts.ASSESSMENT,
    label: "Assessment",
  },
  plan: {
    name: concepts.PLAN,
    label: "Plan",
  },
  implementation: {
    name: concepts.IMPLEMENTATION,
    label: "Implementation",
  },
};

const validationSchema = Yup.object().shape({
  [form.subjective.name]: Yup.string().required(form.subjective.label),
  [form.objective.name]: Yup.string().required(form.objective.label),
  [form.assessment.name]: Yup.string().required(form.assessment.label),
  [form.plan.name]: Yup.string().required(form.plan.label),
  [form.implementation.name]: Yup.string().required(form.implementation.label),
});

const initialValues = getInitialValues(form);

export const SoapForm = () => {
  const { navigateBack } = useNavigation();
  const { handleSubmit } = useSubmitEncounter(
    encounters.NURSING_CARE_NOTES,
    () => navigateBack()
  );

  const handleSubmitForm = (values: any) => {
    handleSubmit(getObservations(values, getDateTime()));
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
          label={form.subjective.label}
          name={form.subjective.name}
          multiline
          id={form.subjective.name}
          rows={4}
          sx={{ width: "100%" }}
        />
        <TextInputField
          label={form.objective.label}
          name={form.objective.name}
          multiline
          id={form.objective.name}
          rows={4}
          sx={{ width: "100%" }}
        />
        <TextInputField
          label={form.assessment.label}
          name={form.assessment.name}
          multiline
          id={form.assessment.name}
          rows={4}
          sx={{ width: "100%" }}
        />
        <TextInputField
          label={form.plan.label}
          name={form.plan.name}
          multiline
          id={form.plan.name}
          rows={4}
          sx={{ width: "100%" }}
        />
        <TextInputField
          label={form.implementation.label}
          name={form.implementation.name}
          multiline
          id={form.implementation.name}
          rows={4}
          sx={{ width: "100%" }}
        />
      </Box>
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </FormikInit>
  );
};
