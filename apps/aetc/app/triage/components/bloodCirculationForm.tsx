import { Box } from "@mui/material";
import React from "react";
import { FormikInit, RadioGroupInput } from "shared-ui/src";
import * as Yup from "yup";

const schema = Yup.object().shape({
  circulation: Yup.string().required().label("Is Circulation Abnormal"),
  present: Yup.string().required().label("Are Any of the Following Present?"),
});

const initialValues = {
  circulation: "",
  present: "",
};
type Prop = {
  onSubmit: () => void;
};

export const BloodCirculationForm = ({ onSubmit }: Prop) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <RadioGroupInput
        name="circulation"
        label="Is Circulation Abnormal ?"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />
      <br />
      <br />

      <RadioGroupInput
        name="present"
        label="Are Any of the Following Present?"
        options={[
          {
            label: "Weak, Thready, Bounding or Regular/Irregular Pulse",
            value: "weak",
          },
          { label: "Reduced Urinary Output < 30ml/hr", value: "reduced" },
          {
            label: "Cool Clammy Peripherals or Cap Refill > 4 Seconds",
            value: "cool",
          },
          { label: "Haemorrhage/Significant Blood Loss", value: "loss" },
          { label: "Dehydrated Skin Turgor, Sunken Eyes", value: "skin" },
          { label: "Heart Rate < 50, > 60 or 100 - 110", value: "heart" },
          { label: "Temperature 37 - 38 C", value: "temperature" },
        ]}
      />
    </FormikInit>
  );
};
