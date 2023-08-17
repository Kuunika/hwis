import { FC } from "react";
import * as Yup from "yup";
import { FormikInit, SelectInputField, TextInputField } from "shared-ui/src";

const schema = Yup.object().shape({
  insuranceProvider: Yup.string().required().label("Insurance Provider"),
  insuranceIdNo: Yup.string().required().label("Patient Insurance Id Number"),
  insuranceSchema: Yup.string().required().label("Insurance Schema"),
});

const initialValues = {
  insuranceProvider: "",
  insuranceIdNo: "",
  insuranceSchema: "",
};

type Props = {
  onSubmit: () => void;
};
export const MedicalInsuranceForm: FC<Props> = ({ onSubmit }) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <SelectInputField
        label="Insurance Provider"
        id="insuranceProvider"
        name="insuranceProvider"
        selectItems={[{ name: "Masm", value: "masm" }]}
      />
      <TextInputField
        name="insuranceIdNo"
        id="insuranceIdNo"
        label="Patient Insurance Id Number"
      />
      <SelectInputField
        label="Insurance Schema"
        id="insuranceSchema"
        name="insuranceSchema"
        selectItems={[{ name: "Masm", value: "masm" }]}
      />
    </FormikInit>
  );
};
