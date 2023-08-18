import { Box } from '@mui/material';
import React from 'react'
import { FormikInit, MainButton, RadioGroupInput } from 'shared-ui/src';
import * as Yup from "yup";
 
const schema = Yup.object().shape({
  circulation: Yup.string().required().label("Is Circulation Abnormal"),
  present:     Yup.string().required().label("Are Any of the Following Present?"), 
});

const initialValues = {
  circulation: "",
  present:"",
};
type Prop={
    onSubmit: ()=> void
}

const BloodCirculation = ({onSubmit}:Prop) => {
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
            marginTop: "-12rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mr: "1ch",
          }}
        >
          <RadioGroupInput
            name="circulation"
            label="Is Circulation Abnormal ?"
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </Box>

        <Box
          sx={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mr: "1ch",
          }}
        >
          <RadioGroupInput
            name=" present"
            label="Are Any of the Following Present? ?"
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

export default BloodCirculation
