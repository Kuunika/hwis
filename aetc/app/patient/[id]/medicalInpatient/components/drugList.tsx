import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
import { getInitialValues, mapSearchComboOptionsToConcepts } from "@/helpers";
import { getDateTime } from "@/helpers/dateTime";
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
  [form.drug.name]: Yup.array().required().label(form.drug.label),
  [form.other.name]: Yup.string().label(form.other.label),
});
const initialValues = getInitialValues(form);

export const DrugList = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  const [showOther, setShowOther] = useState(false);
  const { medicationOptions } = useFetchMedications();
  const { ServerTime } = useServerTime();


  const handleSubmit = (values: any) => {
    const obsDatetime = ServerTime.getServerTimeString();

    const selectedMedications = values[form.drug.name] || [];

    // Create individual observations for each selected medication
    const medicationObservations = selectedMedications.map((medication: any) => {
      if (medication.id === concepts.OTHER) {
        return {
          concept: concepts.OTHER_MEDICATION,
          value_text: values[form.other.name] || "Other medication specified",
          obsDatetime,
        };
      }

      // Regular medications → store drug name in value_text
      return {
        concept: form.drug.name,
        value_text: medication.label,   // 👈 this ensures "Amiodarone" is stored
        obsDatetime,
      };
    });

    // Create the parent medication observation group
    const obs = [
      {
        concept: form.drug.name,
        value_text: "Medication",
        groupMembers: medicationObservations,
        obsDatetime,
      },
    ];

    // Handle "Other" if typed in
    const hasOtherSelected = selectedMedications.some((med: any) => med.id === concepts.OTHER);
    if (hasOtherSelected && values[form.other.name]) {
      obs.push({
        concept: concepts.OTHER_MEDICATION,
        value_text: values[form.other.name],
        obsDatetime,
        groupMembers: undefined
      });
    }

    onSubmit(obs);
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButtonText="next"
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
