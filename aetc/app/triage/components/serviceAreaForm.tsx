import { SearchComboBox, FormikInit, MainButton } from "@/components";
import * as Yup from "yup";

import { getInitialValues } from "@/helpers";

type Prop = {
  onSubmit: (values: any) => void;
};

const form = {
  serviceArea: {
    name: "SERVICE_AREA",
    label: "Service Area",
  },
};

const schema = Yup.object().shape({
  [form.serviceArea.name]: Yup.array().required().label(form.serviceArea.label),
});

const initialValues = getInitialValues(form);

const serviceAreas = [
  { id: "Medical", label: "Medical" },
  { id: "Surgical", label: "Surgical" },
  { id: "Trauma", label: "Trauma" },
  { id: "Gynaecology", label: "Gynaecology" },
  { id: "Orthopaedic", label: "Orthopaedic" },
  { id: "Unknown", label: "Unknown" },
];

export const ServiceAreaForm = ({ onSubmit }: Prop) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={false}
      submitButtonText="Next"
    >
      <SearchComboBox
        name={form.serviceArea.name}
        label={form.serviceArea.label}
        options={serviceAreas}
      />

      <MainButton sx={{ m: 0.5 }} title="Next" type="submit" onClick={() => { }} />
    </FormikInit>
  );
};
