import { SelectInputField, FormikInit, MainButton } from "@/components";
import * as Yup from "yup";
import { concepts, triageResult } from "@/constants";

import { getInitialValues } from "@/helpers";

type Prop = {
  onSubmit: (values: any) => void;
  triageStatus: string
};

const form = {
  Referred: {
    name: concepts.PATIENT_REFERRED_TO,
    label: "Patient Referred to",
  },
};

const schema = Yup.object().shape({
  [form.Referred.name]: Yup.string().label(form.Referred.label),
});

const initialValues = getInitialValues(form);

const serviceAreas = 
[
  { "name": "OPD 1", "value": "OPD 1" },
  { "name": "STI clinic/Room 4", "value": "STI clinic/Room 4" },
  { "name": "Dermatology/LEPRA", "value": "Dermatology/LEPRA" },
  { "name": "Paediatric A&E", "value": "Paediatric A&E" },
  { "name": "Local health centre", "value": "Local health centre" },
  { "name": "Physiotherapy", "value": "Physiotherapy" },
  { "name": "Diabetic clinic", "value": "Diabetic clinic" },
  { "name": "KS clinic", "value": "KS clinic" },
  { "name": "Neurology clinic", "value": "Neurology clinic" },
  { "name": "General medical clinic", "value": "General medical clinic" },
  { "name": "Haematology clinic", "value": "Haematology clinic" },
  { "name": "Palliative clinic", "value": "Palliative clinic" },
  { "name": "Chest clinic", "value": "Chest clinic" },
  { "name": "Hypertensive clinic", "value": "Hypertensive clinic" },
  { "name": "Epileptic clinic", "value": "Epileptic clinic" },
  { "name": "Renal clinic", "value": "Renal clinic" },
  { "name": "Umodzi/ light house", "value": "Umodzi/ light house" },
  { "name": "Psychiatry (Room 6)", "value": "Psychiatry (Room 6)" },
  { "name": "Ophthalmology (Eye)", "value": "Ophthalmology (Eye)" },
  { "name": "male general surgical", "value": "male general surgical" },
  { "name": "female general surgical", "value": "female general surgical" },
  { "name": "Plastic surgery", "value": "Plastic surgery" },
  { "name": "Breast clinic", "value": "Breast clinic" },
  { "name": "Orthopaedic specialist clinic", "value": "Orthopaedic specialist clinic" },
  { "name": "Orthopaedic OPD/Room 8", "value": "Orthopaedic OPD/Room 8" },
  { "name": "Oncology OPD (4B)", "value": "Oncology OPD (4B)" },
  { "name": "Oncology Ward(2A)", "value": "Oncology Ward(2A)" },
  { "name": "Gynae Oncology OPD (4C)", "value": "Gynae Oncology OPD (4C)" },
  { "name": "Ear Nose and Throat (ENT)", "value": "Ear Nose and Throat (ENT)" },
  { "name": "Dental", "value": "Dental" },
  { "name": "General gynecology", "value": "General gynecology" },
  { "name": "Gynecology oncology", "value": "Gynecology oncology" },
  { "name": "High risk antenatal", "value": "High risk antenatal" },
  { "name": "Family planning", "value": "Family planning" },
  { "name": "VIA", "value": "VIA" }
];

const aetcServiceAreas = [
    { "name": "Short stay ward", "value": "Short stay ward" },
    { "name": "Gynae Bench", "value": "Gynae Bench" },
    { "name": "Surgical bench", "value": "Surgical bench" },
    { "name": "Priority area", "value": "Priority area" },
    { "name": "Isolation room", "value": "Isolation room" },
    { "name": "Trauma", "value": "Trauma" },
    { "name": "Medical bench", "value": "Medical bench" },
    { "name": "Other (Free Text)", "value": "Other (Free Text)" }
]


export const ServiceAreaForm = ({ onSubmit, triageStatus }: Prop) => {
  console.log(triageStatus)
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={false}
      submitButtonText="Next"
    >
      <SelectInputField
      id={form.Referred.name}
        name={form.Referred.name}
        label={form.Referred.label}
        selectItems={triageStatus === "green"?serviceAreas: aetcServiceAreas}
      />
      <MainButton sx={{ m: 0.5 }} title="Next" type="submit" onClick={() => { }} />
    </FormikInit>
  );
};
