import { Box } from '@mui/material';
import React from 'react'
import { FormikInit } from 'shared-ui/src';
import * as Yup from 'yup'

const schema = Yup.object().shape({
  complaint: Yup.string().required().label("Complaint"),
  respiratoryRate: Yup.string().required().label("Respiratory rate"),
  oxygenSaturation: Yup.string().required().label("Oxygen Saturation"),
  temperature: Yup.string().required().label("Temperature"),
  heartRate: Yup.string().required().label("Heart Rate"),
  bloodPressure: Yup.string().required().label("Blood Pressure"),
  eyeOpeningResponse: Yup.string().required().label("Eye Opening response"),
  verbalResponse: Yup.string().required().label("Verbal Response"),
  motorResponse: Yup.string().required().label("Motor Response"),
  calculatedGCS: Yup.string().required().label("Calculated GCS"),
  avpu: Yup.string().required().label("AVPU"),
  glusoce: Yup.string().required().label("Glusoce"),
});

const initialValues = {
  complaint: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  temperature: "",
  heartRate: "",
  bloodPressure: "",
  eyeOpeningResponse: "",
  verbalResponse:"",
  motorResponse: "",
  calculatedGCS: "",
  avpu: "",
  glusoce: "",
};

type Prop={
    onSubmit: ()=>void;
}

const Vitals = ({onSubmit}:Prop) => {
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
      ></Box>
    </FormikInit>
  );
}

export default Vitals