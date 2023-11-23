import { Box } from "@mui/material";
import React from "react";
import { FormikInit, MainButton, RadioGroupInput } from "shared-ui/src";
import * as Yup from "yup";

type Prop = {
  onSubmit: () => void;
};

export const PersistentPainForm = ({ onSubmit }: Prop) => {
  const schema = Yup.object().shape({
    concern: Yup.string()
      .required()
      .label(
        "Does the Patient have active Seizure, Focal Neurologic Findings, Headache, Weakness, Confusion, Severe Pain or Other Cause for Concern"
      ),
    moderate: Yup.string()
      .required()
      .label(
        "Does the Patient have Moderate Pain or a Reason to be seen in under 1 hour"
      ),
  });

  const initialsValues = {
    concern: "",
    moderate: "",
  };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialsValues}
      onSubmit={onSubmit}
    >
      <RadioGroupInput
        name="concern"
        label="Does the Patient have active Seizure, Focal Neurologic Findings, Headache, Weakness, Confusion, Severe Pain or Other Cause for Concern"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />

      <RadioGroupInput
        name="moderate"
        label="Does the Patient have Moderate Pain 
                   or a Reason to be seen in under 1 hour"
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />
    </FormikInit>
  );
};
