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
import { getInitialValues } from "@/helpers";
import { NO, YES, concepts } from "@/constants";

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

const referrences = [

  { id: "EAR NOSE AND THROAT (ENT)", label: "EAR NOSE AND THROAT (ENT)" },
  { id: "OPHTHALMOLOGY", label: "OPHTHALMOLOGY" },
  { id: "ORTHOPAEDIC", label: "ORTHOPAEDIC" },
  { id: "CLINICS", label: "CLINICS" },
  { id: "PAEDIATRIC OPD", label: "PAEDIATRIC OPD" },
  { id: "RADIOLOGY", label: "RADIOLOGY" },
  { id: "DENTAL", label: "DENTAL" },
  { id: "DERMATOLOGY/LEPRA", label: "DERMATOLOGY / LEPRA" },
  { id: "PSYCHIATRY", label: "PSYCHIATRY" },
  { id: "LOCAL HEALTH CENTRE", label: "LOCAL HEALTH CENTRE" },
  { id: "4C", label: "4C" },
  { id: "ONCOLOGY", label: "ONCOLOGY" },
  { id: "DENTAL", label: "DENTAL" },
  { id: "STI", label: "STI" },
  { id: "OPD 1", label: "OPD 1" },
  { id: "PHYSIOTHERAPY", label: "PHYSIOTHERAPY" },
  { id: "EYE/ OPHTHALMOLOGY OPD", label: "EYE/ OPHTHALMOLOGY OPD" },
  { id: "OBSTETRICS AND GYNAECOLOGY OPD", label: "OBSTETRICS AND GYNAECOLOGY OPD" },
];

export function PrescreeningForm({ onSubmit }: props) {
  const [formValues, setFormValues] = useState<any>({});

  const yesno = [
    { label: "Yes", value: YES },
    { label: "No", value: NO },
  ];

  let departments = formValues[form.referred.name] == YES ? [...referrences, { id: "OPD2", label: "OPD2" }] : referrences

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
          options={yesno}
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
      {formValues[form.urgent.name] == YES && (
        <NotificationContainer message="Proceed with registration" />
      )}
    </FormikInit>
  );
}
