import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import useFetchMedications from "@/hooks/useFetchMedications";
import { usePresentingComplaints } from "@/hooks/usePresentingComplaints";
import { useState } from "react";
import * as Yup from "yup";

const form = {
  drug: {
    name: concepts.MEDICATION,
    label: "Drug",
  },
  history: {
    name: concepts.PRESENTING_HISTORY,
    label: "History of Presenting Complaints",
  },
};

const schema = Yup.object().shape({
  drug: Yup.array().required().label(form.drug.label),
  history: Yup.string().label(form.history.label),
});
const initialValues = getInitialValues(form);

export const DrugList = () => {
  const { medicationOptions } = useFetchMedications();

  const handleSubmit = () => {};
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <SearchComboBox
        name={form.drug.name}
        options={medicationOptions}
        multiple
        label={form.drug.label}
      />
      <br />
      {/* <TextInputField
        multiline
        rows={5}
        name={form.history.name}
        label={form.history.label}
        id={form.history.name}
        sx={{ width: "100%" }}
      /> */}
    </FormikInit>
  );
};
