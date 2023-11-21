import { FC } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  TextInputField,
  RadioGroupInput,
  SelectInputField,
  FormFieldContainer,
} from "shared-ui/src";

const schema = Yup.object().shape({
  maritalStatus: Yup.string().required().label("marital Status"),
  occupation: Yup.string().required().label("occupation"),
  religion: Yup.string().required().label("religion"),
  highestEducation: Yup.string().required().label("religion"),
  methodOfTransportation: Yup.string()
    .required()
    .label("method of transportation"),
});

const initialValues = {
  maritalStatus: "",
  occupation: "",
  religion: "",
  highestEducation: "",
  methodOfTransportation: "",
};

type Prop = {
  onSubmit: () => void;
};

export const SocialHistory: FC<Prop> = ({ onSubmit }) => {
  return (
    <FormikInit
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={schema}
      submitButtonText="next"
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <FormFieldContainer direction="row">
          <RadioGroupInput
            name="maritalStatus"
            label="MaritalStatus"
            options={[
              { label: "Single", value: "single" },
              { label: "Married", value: "married" },
              { label: "Widow/Widower", value: "widow/widower" },
              { label: "Divorced", value: "divorced" },
            ]}
          />
          <RadioGroupInput
            name="occupation"
            label="Occupation Status"
            options={[
              { label: "Employed", value: "employed" },
              { label: "Unemployed", value: "unemployed" },
            ]}
          />
        </FormFieldContainer>
        <SelectInputField
          name="methodOfTransportation"
          selectItems={[{ name: "Bus", value: "bus" }]}
          label="Method Of Transportation"
          id="methodOfTransportation"
        />
        <SelectInputField
          name="religion"
          selectItems={[
            { name: "Christian", value: "christian" },
            { name: "Islam", value: "islam" },
          ]}
          label="Religion"
          id="religion"
        />
        <SelectInputField
          name="highestEducation"
          selectItems={[
            { name: "Degree", value: "degree" },
            { name: "Master's Degree", value: "master" },
          ]}
          label="HighestEducation"
          id="highestEducation"
        />
      </Box>
    </FormikInit>
  );
};
