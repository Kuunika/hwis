import { useState } from "react";
import {
  FieldsContainer,
  FormValuesListener,
  FormikInit,
  RadioGroupInput,
  SearchComboBox,
} from "@/components";
import * as yup from "yup";

import { NotificationContainer } from "@/components";
import { getInitialValues } from "@/helpers";
import { NO, YES, concepts } from "@/constants";
import { getServiceAreas } from "@/hooks/getServiceAreas";

type props = {
  onSubmit: (values: any) => void;
};

const form = {
  referred: {
    name: concepts.IS_PATIENT_REFERRED,
    label: "Is the patient referred?",
  },
  urgent: {
    name: concepts.IS_SITUATION_URGENT,
    label: " Is the situation urgent?",
  },
  Referred: {
    name: concepts.PATIENT_REFERRED_TO,
    label: "Patient Referred to",
  },
};

const schema = yup.object({
  [form.referred.name]: yup.string().required().label(form.referred.label),
  [form.urgent.name]: yup.string().required().label(form.urgent.label),
  [form.Referred.name]: yup.string().label(form.Referred.label),
});

export function PrescreeningForm({ onSubmit }: props) {
  const { serviceAreaOptions } = getServiceAreas();
  const [formValues, setFormValues] = useState<any>({});

  const yesno = [
    { label: "Yes", value: YES },
    { label: "No", value: NO },
  ];

  const formattedOptions = serviceAreaOptions.map((option: any) => ({
    id: option.label,
    label: option.label,
  }));

  let departments =
    formValues[form.referred.name] == YES
      ? [{ id: "OPD 2", label: "OPD 2" }, ...formattedOptions]
      : formattedOptions;

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={getInitialValues(form)}
      onSubmit={onSubmit}
    >
      <FormValuesListener getValues={setFormValues} />

      <FieldsContainer>
        <RadioGroupInput
          name={form.referred.name}
          label={form.referred.label}
          options={yesno}
        />

        <RadioGroupInput
          name={form.urgent.name}
          label={form.urgent.label}
          options={[...yesno, { label: "Elective", value: concepts.ELECTIVE }]}
        />
      </FieldsContainer>

      {formValues[form.urgent.name] == NO && (
        <>
          <br />
          <SearchComboBox
            name={form.Referred.name}
            label={form.Referred.label}
            options={departments}
            multiple={false}
            sx={{ mr: "1ch" }}
          />
        </>
      )}
      {(formValues[form.urgent.name] == YES ||
        formValues[form.urgent.name] == concepts.ELECTIVE) && (
        <NotificationContainer message="Proceed with registration" />
      )}
    </FormikInit>
  );
}
