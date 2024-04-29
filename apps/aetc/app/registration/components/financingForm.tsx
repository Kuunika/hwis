import { FC, useState } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  SelectInputField,
  TextInputField,
  RadioGroupInput,
  CheckboxesGroup,
} from "shared-ui/src";
import { TrackFormikContext } from "./demographicsForm";
import {
  RegistrationCard,
  RegistrationCardTitle,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "./common";
import { concepts } from "@/constants";

const form = {
  paymentOption: {
    name: concepts.PAYMENT_OPTIONS,
    label: "Payment Option",
  },
  insuranceProvider: {
    name: concepts.INSURANCE_PROVIDER,
    label: "Insurance Provider",
  },
  insuranceIdNo: {
    name: concepts.INSURANCE_NUMBER,
    label: "Insurance Id Number",
  },
  insuranceSchema: {
    name: concepts.INSURANCE_SCHEME,
    label: "Insurance Scheme",
  },
  status: {
    name: concepts.INSURANCE_STATUS,
    label: "Insurance Status",
  },
};

const schema = Yup.object().shape({
  [form.paymentOption.name]: Yup.array().label(form.paymentOption.label),
  [form.insuranceProvider.name]: Yup.string().label(
    form.insuranceProvider.label
  ),
  [form.insuranceIdNo.name]: Yup.string().label(form.insuranceIdNo.label),
  [form.insuranceSchema.name]: Yup.string().label(form.insuranceSchema.label),
});

type Props = {
  onSubmit: (values: any) => void;
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
      <RegistrationMainHeader id="4">Financing</RegistrationMainHeader>
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
          <RegistrationCardTitle>Payment Options</RegistrationCardTitle>
          <CheckboxesGroup getValue={
            (value: Array<any>) => {
              const v = value?.find(v => v.key == 'insurance' && v.value);
              if (v) {
                setPayment(v.key)
              } else {
                setPayment("")
              }
            }
          } name={form.paymentOption.name} options={[
            { label: "Non-paying", value: "non-paying" },
            { label: "Cash", value: "cash" },
            { label: "Staff", value: "staff" },
            { label: "Insurance", value: "insurance" },
          ]} />
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
                  { name: "Medhealth", value: "Medhealth" },
                  { name: "CIC Malawi", value: "CIC Malawi" },
                  { name: "MRA", value: "MRA" },
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
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </>
          )}
        </RegistrationCard>
      </FormikInit>
    </>
  );
};
