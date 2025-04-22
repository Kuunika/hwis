import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts, encounters } from "@/constants";
import { getInitialValues } from "@/helpers";
import { useSubmitEncounter } from "@/hooks";
import { usePresentingComplaints } from "@/hooks/usePresentingComplaints";
import { useState } from "react";
import * as Yup from "yup";

const form = {
  complaints: {
    name: concepts.PRESENTING_COMPLAINTS,
    label: "Presenting Complaints",
  },
  history: {
    name: concepts.PRESENTING_HISTORY,
    label: "History of Presenting Complaints",
  },
};

const schema = Yup.object().shape({
  complaints: Yup.array().required().label(form.complaints.label),
  history: Yup.string().label(form.history.label),
});
const initialValues = getInitialValues(form);

export const PresentingComplaints = ({
  onSubmit,
}: {
  onSubmit: () => void;
}) => {
  const {} = useSubmitEncounter(encounters.MEDICAL_IN_PATIENT, onSubmit);
  const { presentingComplaints } = usePresentingComplaints();

  const handleSubmit = () => {};
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButtonText="next"
    >
      <SearchComboBox
        name={form.complaints.name}
        options={presentingComplaints}
        multiple
        label={form.complaints.label}
      />
      <br />
      <TextInputField
        multiline
        rows={5}
        name={form.history.name}
        label={form.history.label}
        id={form.history.name}
        sx={{ width: "100%" }}
      />
    </FormikInit>
  );
};
