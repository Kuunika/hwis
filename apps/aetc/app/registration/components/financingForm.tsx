import { FC, useState } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  SelectInputField,
  TextInputField,
  RadioGroupInput,
} from "shared-ui/src";

const form = {
  paymentOption: {
    name: "paymentOption",
    label: "Payment Option",
  },
  insuranceProvider: {
    name: "insuranceProvider",
    label: "Insurance Provider",
  },
  insuranceIdNo: {
    name: "insuranceIdNo",
    label: "Insurance Id Number",
  },
  insuranceSchema: {
    name: "insuranceSchema",
    label: "Insurance Scheme",
  },
};

const schema = Yup.object().shape({
  [form.paymentOption.name]: Yup.string().label(form.paymentOption.label),
  [form.insuranceProvider.name]: Yup.string().label(
    form.insuranceProvider.label
  ),
  [form.insuranceIdNo.name]: Yup.string().label(form.insuranceIdNo.label),
  [form.insuranceSchema.name]: Yup.string().label(form.insuranceSchema.label),
});

type Props = {
  onSubmit: () => void;
  initialValues: any;
};
export const FinancingForm: FC<Props> = ({ onSubmit, initialValues }) => {
  const [payment, setPayment] = useState("");
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <Box>
        <RadioGroupInput
          name={form.paymentOption.name}
          getValue={(value: any) => setPayment(value)}
          label={form.paymentOption.label}
          options={[
            { label: "Cash", value: "cash" },
            { label: "Insurance", value: "insurance" },
          ]}
        />

        {payment === "insurance" && (
          <>
            <SelectInputField
              label={form.insuranceProvider.label}
              id={form.insuranceProvider.name}
              name={form.insuranceProvider.name}
              selectItems={[{ name: "Masm", value: "masm" }]}
            />
            <TextInputField
              name={form.insuranceIdNo.name}
              id={form.insuranceIdNo.name}
              label={form.insuranceIdNo.label}
            />
            <SelectInputField
              label={form.insuranceSchema.label}
              id={form.insuranceSchema.name}
              name={form.insuranceSchema.name}
              selectItems={[{ name: "Masm", value: "masm" }]}
            />
          </>
        )}
      </Box>
    </FormikInit>
  );
};
