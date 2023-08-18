import { Box } from '@mui/material';
import React from 'react'
import { FormikInit, MainButton, RadioGroupInput } from 'shared-ui/src';
import * as Yup from "yup"

type Prop ={
    onSubmit: ()=> void;
}

const PersistentPain = ({onSubmit}: Prop) => {
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            marginTop: "5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            // alignItems: "center",
            width: "100%",
            mr: "1ch",
          }}
        >
          <RadioGroupInput
            name=" concern"
            label="Does the Patient have active Seizure, Focal Neurologic Findings, Headache, Weakness, Confusion, Severe Pain or Other Cause for Concern"
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </Box>
        <Box
          sx={{
            marginTop: "5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            // alignItems: "center",
            width: "100%",
            mr: "1ch",
          }}
        >
          <RadioGroupInput
            name="moderate"
            label="Does the Patient have Moderate Pain or a Reason to be seen in under 1 hour"
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </Box>
      </Box>
    </FormikInit>
  );
}

export default PersistentPain
