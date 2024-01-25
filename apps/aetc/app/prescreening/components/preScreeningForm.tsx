import { useState } from "react";
import {
  FieldsContainer,
  FormValuesListener,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
} from "shared-ui/src";
import * as yup from "yup";

import { NotificationContainer } from "@/components";

type props = {
  onSubmit: (values: any) => void;
};

const form = {
  referredCheckbox: {
    name: "referredCheckbox",
    label: " Is the patient referred?",
  },
  urgentCheckbox: {
    name: "urgentCheckbox",
    label: " Is the situation urgent?",
  },
  Referred: {
    name: "referred",
    label: "Patient Referred to",
  },
};

const schema = yup.object({
  [form.referredCheckbox.name]: yup
    .string()
    .required()
    .label(form.referredCheckbox.label),
  [form.urgentCheckbox.name]: yup
    .string()
    .required()
    .label(form.urgentCheckbox.label),
  [form.Referred.name]: yup.string().label(form.Referred.label),
});

const referrences = [
  { id: "Lab", label: "Lab" },
  { id: "OPD2", label: "OPD2" },
];

export function PrescreeningForm({ onSubmit }: props) {
  const [formValues, setFormValues] = useState<any>({});

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{ referredCheckbox: "", urgentCheckbox: "", referred: "" }}
      onSubmit={onSubmit}
    >
      <FormValuesListener getValues={setFormValues} />

      <FieldsContainer>
        <RadioGroupInput
          name={form.referredCheckbox.name}
          label={form.referredCheckbox.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <RadioGroupInput
          name={form.urgentCheckbox.name}
          label={form.urgentCheckbox.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>

      {formValues[form.urgentCheckbox.name] == "no" && (
        <>
          <br />
          <SearchComboBox
            name={form.Referred.name}
            label={form.Referred.label}
            options={referrences}
            multiple={false}
            sx={{ mr: "1ch" }}
          />
        </>
      )}
      {formValues[form.urgentCheckbox.name] == "yes" && (
        <NotificationContainer message="Proceed with registration" />
      )}
    </FormikInit>
  );
}
