"use client"
import { Box } from '@mui/material';
import React from 'react'
import { FormikInit, MainButton, RadioGroupInput } from 'shared-ui/src';
import * as Yup from "yup";

const schema = Yup.object().shape({
  airway: Yup.string().required().label("Is Airway Compromised"),
  breathing: Yup.string().required().label("Is Breathing Normal"),
  availability: Yup.string()
    .required()
    .label("Are any of the following present"),
  concern: Yup.string().required().label("Does the Patient have active Seizure, Focal Neurologic Findings, Headache, Weakness, Confusion, Severe Pain or Other Cause for Concern"),
  moderate: Yup.string().required().label("Does the Patient have Moderate Pain or a Reason to be seen in under 1 hour")
});
const initialValues={
    airway:"",
    breathing:"",
    availability:"",
    concern:"",
    moderate:""
}

type Prop ={
    onSubmit: () => void;
}

const AirwayAndBreathing = ({onSubmit}:Prop) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
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
            name=" breathing"
            label="Is Breathing Normal ?"
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
            alignItems: "center",
            width: "100%",
            mr: "1ch",
          }}
        >
          <RadioGroupInput
            name="airway"
            label="Is Airway Compromised ?"
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
            alignItems: "center",
            width: "100%",
            mr: "1ch",
          }}
        >
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
        <Box
          sx={{
            alignSelf: "flex-start", 
            mt: "auto", 
          }}
        >
          <MainButton
            variant="primary"
            type="submit"
            title="submit"
            onClick={onSubmit}
          />
        </Box>
      </Box>
    </FormikInit>
  );
}

export default AirwayAndBreathing