import { Box } from '@mui/material';
import React from 'react'
import { FormikInit, RadioGroupInput } from 'shared-ui/src';
import * as Yup from "yup";


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
      consciousness: "",
      glucose: "",
      gsc: "",
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            // alignItems: "center",
            width: "100%",
            mr: "1ch",
          }}
        >
          <RadioGroupInput
            name=" consciousness"
            label="Does the patient have a reduced Level of consciousness ?"
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

export default Consciousness