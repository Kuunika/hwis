import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts } from "@/constants";
import { getInitialValues } from "@/helpers";
import useFetchMedications from "@/hooks/useFetchMedications";

import { useState } from "react";
import * as Yup from "yup";

const form = {
  drug: {
    name: concepts.MEDICATION,
    label: "Drug",
  },
  other: {
    name: concepts.OTHER,
    label: "Other Medications",
  },
};

const schema = Yup.object().shape({
  drug: Yup.array().required().label(form.drug.label),
  other: Yup.string().label(form.other.label),
});
const initialValues = getInitialValues(form);

export const DrugList = ({ onSubmit }: { onSubmit: () => void }) => {
  const [showOther, setShowOther] = useState(false);
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
        options={[...medicationOptions, { id: concepts.OTHER, label: "Other" }]}
        getValue={(values: any) => {
          setShowOther(
            Boolean(values.find((v: any) => v.id == concepts.OTHER))
          );
        }}
        multiple
        label={form.drug.label}
      />
      <br />
      {showOther && (
        <TextInputField
          multiline
          rows={5}
          name={form.other.name}
          label={form.other.label}
          id={form.other.name}
          sx={{ width: "100%" }}
        />
      )}
    </FormikInit>
  );
};
