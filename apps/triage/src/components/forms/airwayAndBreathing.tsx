"use client";
import { Box } from "@mui/material";
import React from "react";
import { FormikInit, RadioGroupInput } from "shared-ui/src";
import * as Yup from "yup";
import { formStyles } from "./forms.styles";

const schema = Yup.object().shape({
  airway: Yup.string().required().label("Is Airway Compromised"),
  breathing: Yup.string().required().label("Is Breathing Normal"),
  availability: Yup.string()
    .required()
    .label("Are any of the following present"),
});
const initialValues = {
  airway: "",
  breathing: "",
  availability: "",
};

type Prop = {
  onSubmit: () => void;
};

const AirwayAndBreathing = ({ onSubmit }: Prop) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <Box sx={formStyles.responsiveness}>
        <RadioGroupInput
          name="breathing"
          label="Is Breathing Normal ?"
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <RadioGroupInput
          name="airway"
          label="Is Airway Compromised ?"
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />

        <RadioGroupInput
          name="availability"
          label="Are any of the following present"
          options={[
            { label: "Oxygen Sats", value: "oxygen" },
            {
              label: "Respiration Rate < 9 or 21 - 30",
              value: "respiration",
            },
          ]}
        />
      </Box>
    </FormikInit>
  );
};

export default AirwayAndBreathing;
