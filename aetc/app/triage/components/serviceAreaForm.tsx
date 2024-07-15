import { SelectInputField, FormikInit, MainButton } from "@/components";
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
  [form.serviceArea.name]: Yup.string().required().label(form.serviceArea.label),
});

const initialValues = getInitialValues(form);

const serviceAreas = [
  { name: "Medical", value: "Medical" },
  { name: "Surgical", value: "Surgical" },
  { name: "Trauma", value: "Trauma" },
  { name: "Gynaecology", value: "Gynaecology" },
  { name: "Orthopaedic", value: "Orthopaedic" },
  { name: "Unknown", value: "Unknown" },
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
      <SelectInputField
      id={form.serviceArea.name}
        name={form.serviceArea.name}
        label={form.serviceArea.label}
        selectItems={serviceAreas}
      />

      <MainButton sx={{ m: 0.5 }} title="Next" type="submit" onClick={() => { }} />
    </FormikInit>
  );
};
