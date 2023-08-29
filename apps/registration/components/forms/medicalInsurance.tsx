import { FC, useState } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  SelectInputField,
  TextInputField,
  RadioGroupInput,
} from "shared-ui/src";

const schema = Yup.object().shape({
  paymentOption: Yup.string().label("Payment Option"),
  insuranceProvider: Yup.string().label("Insurance Provider"),
  insuranceIdNo: Yup.string().label("Patient Insurance Id Number"),
  insuranceSchema: Yup.string().label("Insurance Schema"),
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
  const [payment, setPayment] = useState("");
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <Box>
        <RadioGroupInput
          name="gender"
          getValue={(value: any) => setPayment(value)}
          label="Select mode of payment"
          options={[
            { label: "Cash", value: "cash" },
            { label: "Insurance", value: "insurance" },
          ]}
        />

        {payment === "insurance" && (
          <>
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
          </>
        )}
      </Box>
    </FormikInit>
  );
};
