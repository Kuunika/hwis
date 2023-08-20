import { Box } from '@mui/material';
import React from 'react'
import { FormikInit, RadioGroupInput, TextInputField} from "shared-ui/src";
import MultlineInput from 'shared-ui/src/form/multlineInput';
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
      >
        <Box
          sx={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            width: "40%",
            mr: "1ch",
          }}
        >
          <MultlineInput
            name="complaint"
            id="complaint"
            label="Complaint"
            maxRows={4}
          />
          <TextInputField
            name="respiratoryRate"
            id="respiratoryRate"
            label="Respiratory rate"
            rows={4}
          />
          <TextInputField
            name="oxygenSaturation"
            id="oxygenSaturation"
            label="Oxygen Saturation"
          />
          <TextInputField
            name="temperature"
            id="temperature"
            label="Temperature"
          />
          <TextInputField name="heartRate" id="heartRate" label="Heart Rate" />
          <TextInputField
            name="bloodPressure"
            id="bloodPressure"
            label="Blood Pressure"
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
            name=" eyeOpeningResponse"
            label="Eye Opening response"
            options={[
              { label: "Spontenous", value: "spontenous" },
              { label: "To speech", value: "toSpeech" },
              { label: "To pain", value: "toPain" },
              { label: "No response", value: "noResponse" },
            ]}
          />
          <Box sx={{ marginTop: "1rem" }}>
            <RadioGroupInput
              name="verbalResponse"
              label="Verbal Response"
              options={[
                { label: "Oriented", value: "oriented" },
                { label: "Confused", value: "confused" },
                { label: "Words", value: "words" },
                { label: "Sounds", value: "sounds" },
                { label: "None", value: "none" },
              ]}
            />
          </Box>
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
            name="motorResponse"
            label="Motor Response"
            options={[
              { label: "Obey", value: "obey" },
              { label: "Localising", value: "localising" },
              { label: "Normal flexion", value: "normalFlexion" },
              { label: "Abnormal flexion", value: "abnormalFlexion" },
              { label: "Extention", value: "extention" },
              { label: "None", value: "none" },
            ]}
          />
          <Box sx={{ marginTop: "1rem" }}>
            <RadioGroupInput
              name="AVPU"
              label="AVPU"
              options={[
                { label: "Awake", value: "awake" },
                { label: "Verbal", value: "verbal" },
                { label: "Pain", value: "pain" },
                { label: "Unresponsive", value: "unresponsive" },
              ]}
            />
          </Box>
        </Box>

        <Box
          sx={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            width: "40%",
            mr: "1ch",
          }}
        >
          <MultlineInput
            name="calculatedGCS"
            id="calculatedGCS"
            label="Calculated GCS"
            maxRows={4}
          />
          <TextInputField
            name="glusoce"
            id="glusoce"
            label="Glusoce"
            rows={4}
          />
        </Box>
      </Box>
    </FormikInit>
  );
}

export default Vitals