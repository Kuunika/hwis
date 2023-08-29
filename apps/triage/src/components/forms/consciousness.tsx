import { Box } from '@mui/material';
import React from 'react'
import { FormikInit, MainButton, RadioGroupInput } from 'shared-ui/src';
import * as Yup from "yup";
import CustomStyling from './customStyling';


type Prop = {
    onSubmit: () => void;
};

const Consciousness = ({onSubmit}: Prop) => {
    const schema = Yup.object().shape({
      consciousness: Yup.string()
        .required()
        .label("Does the patient have a reduced Level of consciousness"),
      glucose: Yup.string().required().label("Blood glucose"),
      gcs: Yup.string().required().label("Check GCS"),
    });

    const initialValues = {
      consciousness:"",
      glucose:"",
      gcs:"",
    };
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
            ...CustomStyling
          }}
        >
          <RadioGroupInput
            name="consciousness"
            label="Does the patient have a reduced Level of consciousness ?"
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </Box>

        <Box
          sx={{
            marginTop: "5rem",
            ...CustomStyling
          }}
        >
          <RadioGroupInput
            name="glucose"
            label="Blood Glucose"
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </Box>

        <Box
          sx={{
            marginTop: "5rem",
            ...CustomStyling
          }}
        >
          <RadioGroupInput
            name="gcs"
            label="Check GCS"
            options={[
              {label: "less then 10", value: "low" },
              {label: "greater than 10 and less than 14", value: "high" },
            ]}
          />
        </Box>
      </Box>
    </FormikInit>
  );
}

export default Consciousness