import { FormikInit, SearchComboBox, TextInputField } from "@/components";
import { concepts } from "@/constants";
import { useServerTime } from "@/contexts/serverTimeContext";
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
  [form.drug.name]: Yup.array().required().label(form.drug.label),
  [form.other.name]: Yup.string().label(form.other.label),
});

const initialValues = getInitialValues(form);

export const DrugList = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  const [showOther, setShowOther] = useState(false);
  const [noneSelected, setNoneSelected] = useState(false);
  const { medicationOptions } = useFetchMedications();
  const { ServerTime } = useServerTime();

  const handleSubmit = (values: any) => {
    const formValues = { ...values };
    const obsDatetime = ServerTime.getServerTimeString();
    const selectedDrugs = formValues[form.drug.name] || [];

    // If "None" is selected, submit just that
    if (selectedDrugs.some((d: any) => d.id === concepts.NONE)) {
      const obs = [
        {
          concept: form.drug.name,
          value: "No medications",
          obsDatetime,
        },
      ];
      onSubmit(obs);
      return;
    }

    const drugObs = selectedDrugs.map((drug: any) => {
      if (drug.id === concepts.OTHER) {
        return {
          concept: concepts.MEDICATION,
          value: formValues[form.other.name] || "Other drug specified",
          obsDatetime,
        };
      }

      return {
        concept: concepts.MEDICATION,
        value: drug.label,
        obsDatetime,
      };
    });

    const obs = [
      {
        concept: form.drug.name,
        value: "Medication",
        groupMembers: drugObs,
        obsDatetime,
      },
    ];

    onSubmit(obs);
  };

  // ✅ Include "None" and "Other" options
  const options = [
    { id: concepts.NONE, label: "None" },
    ...medicationOptions,
    { id: concepts.OTHER, label: "Other" },
  ];

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButtonText="next"
    >
      <SearchComboBox
        name={form.drug.name}
        options={options}
        multiple
        label={form.drug.label}
        getValue={(values: any) => {
          const hasNone = values.some((v: any) => v.id === concepts.NONE);
          setNoneSelected(hasNone);

          // Hide "Other" field if "None" is selected
          if (hasNone) {
            setShowOther(false);
          } else {
            setShowOther(Boolean(values.find((v: any) => v.id === concepts.OTHER)));
          }
        }}
      />

      <br />

      {showOther && !noneSelected && (
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
