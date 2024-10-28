import { FormValueLabel } from "@/interfaces";
import { useEffect, useState } from "react";

export const useImageFormTransform = () => {
  const [submittedValues, setSubmittedValues] = useState<Array<FormValueLabel>>(
    []
  );
  const [data, setData] = useState<{
    formData: any;
    formConceptsLabels: Array<{ concept: string; label: string }>;
    section: string;
  }>({ section: "", formConceptsLabels: [], formData: {} });

  useEffect(() => {
    const formData = Object.keys(data.formData).map((key) => {
      const label = data.formConceptsLabels.find(
        ({ concept }: any) => concept == key
      )?.label;

      const labelValue = data.formConceptsLabels.find(
        (label) => label.concept == data.formData[key]
      )?.label;

      return { label, value: labelValue ?? data.formData[key] };
    });

    const section = data.section;

    if (!Boolean(section)) return;

    setSubmittedValues((values) => {
      const index = values.findIndex((v) => v.section == section);

      if (index < 0) {
        return [...values, { section, formValues: formData }];
      }

      values[index] = { section, formValues: formData };

      return [...values];
    });
  }, [data]);

  return { submittedValues, setData };
};
