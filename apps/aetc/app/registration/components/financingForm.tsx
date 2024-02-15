import { FC, useState } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  SelectInputField,
  TextInputField,
  RadioGroupInput,
} from "shared-ui/src";
import { TrackFormikContext } from "./demographicsForm";
import {
  RegistrationCard,
  RegistrationCardTitle,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "./common";

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
  status: {
    name: "insuranceStatus",
    label: "Insurance Status",
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
  setContext: (context: any) => void;
};
export const FinancingForm: FC<Props> = ({
  onSubmit,
  initialValues,
  setContext,
}) => {
  const [payment, setPayment] = useState("");
  return (
    <>
      <RegistrationMainHeader>Financing</RegistrationMainHeader>
      <RegistrationDescriptionText>
        Capture details the patient is using for financing
      </RegistrationDescriptionText>
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitButton={false}
      >
        <TrackFormikContext setFormContext={setContext} />
        <RegistrationCard>
          <RegistrationCardTitle>financing</RegistrationCardTitle>
          <RadioGroupInput
            name={form.paymentOption.name}
            getValue={(value: any) => setPayment(value)}
            label={form.paymentOption.label}
            options={[
              { label: "Non-paying", value: "non-paying" },
              { label: "Staff", value: "staff" },
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
                selectItems={[
                  { name: "Masm", value: "masm" },
                  { name: "Escom", value: "Escom" },
                  { name: "Reserve Bank", value: "Reserve Bank" },
                  { name: "Liberty", value: "Liberty" },
                  { name: "Unimed", value: "Unimed" },
                ]}
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
                selectItems={[
                  { name: "VVIP", value: "VVIP" },
                  { name: "VIP", value: "VIP" },
                  { name: "EXEC", value: "EXEC" },
                  { name: "ECO", value: "ECO" },
                ]}
              />
              <RadioGroupInput
                name={form.status.name}
                label={form.status.label}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />
            </>
          )}
        </RegistrationCard>
      </FormikInit>
    </>
  );
};
