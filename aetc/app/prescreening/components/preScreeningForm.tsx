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
  { "id": "OPD 1", "label": "OPD 1" },
  { "id": "STI clinic/Room 4", "label": "STI clinic/Room 4" },
  { "id": "Dermatology/LEPRA", "label": "Dermatology/LEPRA" },
  { "id": "Paediatric A&E", "label": "Paediatric A&E" },
  { "id": "Local health centre", "label": "Local health centre" },
  { "id": "Physiotherapy", "label": "Physiotherapy" },
  { "id": "Diabetic clinic", "label": "Diabetic clinic" },
  { "id": "KS clinic", "label": "KS clinic" },
  { "id": "Neurology clinic", "label": "Neurology clinic" },
  { "id": "General medical clinic", "label": "General medical clinic" },
  { "id": "Haematology clinic", "label": "Haematology clinic" },
  { "id": "Palliative clinic", "label": "Palliative clinic" },
  { "id": "Chest clinic", "label": "Chest clinic" },
  { "id": "Hypertensive clinic", "label": "Hypertensive clinic" },
  { "id": "Epileptic clinic", "label": "Epileptic clinic" },
  { "id": "Renal clinic", "label": "Renal clinic" },
  { "id": "Umodzi/ light house", "label": "Umodzi/ light house" },
  { "id": "Psychiatry (Room 6)", "label": "Psychiatry (Room 6)" },
  { "id": "Ophthalmology (Eye)", "label": "Ophthalmology (Eye)" },
  { "id": "male general surgical", "label": "male general surgical" },
  { "id": "female general surgical", "label": "female general surgical" },
  { "id": "Plastic surgery", "label": "Plastic surgery" },
  { "id": "Breast clinic", "label": "Breast clinic" },
  { "id": "Orthopaedic specialist clinic", "label": "Orthopaedic specialist clinic" },
  { "id": "Orthopaedic OPD/Room 8", "label": "Orthopaedic OPD/Room 8" },
  { "id": "Oncology OPD (4B)", "label": "Oncology OPD (4B)" },
  { "id": "Oncology Ward(2A)", "label": "Oncology Ward(2A)" },
  { "id": "Gynae Oncology OPD (4C)", "label": "Gynae Oncology OPD (4C)" },
  { "id": "Ear Nose and Throat (ENT)", "label": "Ear Nose and Throat (ENT)" },
  { "id": "Dental", "label": "Dental" },
  { "id": "General gynecology", "label": "General gynecology" },
  { "id": "Gynecology oncology", "label": "Gynecology oncology" },
  { "id": "High risk antenatal", "label": "High risk antenatal" },
  { "id": "Family planning", "label": "Family planning" },
  { "id": "VIA", "label": "VIA" }
]

export function PrescreeningForm({ onSubmit }: props) {
  const [formValues, setFormValues] = useState<any>({});

  const yesno = [
    { label: "Yes", value: YES },
    { label: "No", value: NO },
  ];

  let departments = formValues[form.referred.name] == YES ? [{ id: "OPD 2", label: "OPD 2" }, ...referrences,] : referrences

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
      {(formValues[form.urgent.name] == YES || formValues[form.urgent.name] == concepts.ELECTIVE) && (
        <NotificationContainer message="Proceed with registration" />
      )}
    </FormikInit>
  );
}








