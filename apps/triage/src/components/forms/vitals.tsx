import { Box, useTheme } from "@mui/material";
import React from "react";
import { FormikInit, RadioGroupInput, TextInputField } from "shared-ui/src";
import MultlineInput from "shared-ui/src/form/multlineInput";
import * as Yup from "yup";
import CustomStyling from "./forms.styles";

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
  verbalResponse: "",
  motorResponse: "",
  calculatedGCS: "",
  avpu: "",
  glusoce: "",
};

type Prop = {
  onSubmit: () => void;
};

const Vitals = ({ onSubmit }: Prop) => {
  const textInputWidth = { md: "100%", sm: "100%" };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "1fr 1fr", xs: "1fr", sm: "1fr 1fr" },
          gridGap: "2ch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MultlineInput
            name="complaint"
            id="complaint"
            label="Complaint"
            maxRows={4}
          />
          <TextInputField
            width={textInputWidth}
            name="respiratoryRate"
            id="respiratoryRate"
            label="Respiratory rate"
            rows={4}
          />
          <TextInputField
            width={textInputWidth}
            name="oxygenSaturation"
            id="oxygenSaturation"
            label="Oxygen Saturation"
          />
          <TextInputField
            width={textInputWidth}
            name="temperature"
            id="temperature"
            label="Temperature"
          />
          <TextInputField
            width={textInputWidth}
            name="heartRate"
            id="heartRate"
            label="Heart Rate"
          />
          <TextInputField
            width={textInputWidth}
            name="bloodPressure"
            id="bloodPressure"
            label="Blood Pressure"
          />
          <MultlineInput
            name="calculatedGCS"
            id="calculatedGCS"
            label="Calculated GCS"
            maxRows={4}
          />
          <TextInputField
            width={textInputWidth}
            name="glusoce"
            id="glusoce"
            label="Glusoce"
            rows={4}
          />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr", sm: "1fr" },
          }}
        >
          <RadioGroupInput
            name="eyeOpeningResponse"
            label="Eye Opening response"
            options={[
              { label: "Spontenous", value: "spontenous" },
              { label: "To speech", value: "toSpeech" },
              { label: "To pain", value: "toPain" },
              { label: "No response", value: "noResponse" },
            ]}
          />
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
          <RadioGroupInput
            name="avpu"
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
    </FormikInit>
  );
};
export default Vitals;
