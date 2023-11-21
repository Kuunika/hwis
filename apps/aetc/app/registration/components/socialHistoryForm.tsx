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

const form = {
  maritalStatus: {
    name: "maritalStatus",
    label: "Marital Status",
  },
  occupation: {
    name: "occupation",
    label: "Occupation",
  },
  religion: {
    name: "religion",
    label: "Religion",
  },
  highestEducation: {
    name: "highestEducation",
    label: "Highest Education",
  },
  methodOfTransportation: {
    name: "methodOfTransportation",
    label: "Method Of Transportation",
  },
};

const schema = Yup.object().shape({
  [form.maritalStatus.name]: Yup.string()
    .required()
    .label(form.maritalStatus.name),
  [form.occupation.name]: Yup.string().required().label(form.occupation.label),
  [form.religion.name]: Yup.string().required().label(form.religion.label),
  [form.highestEducation.name]: Yup.string()
    .required()
    .label(form.highestEducation.label),
  [form.methodOfTransportation.name]: Yup.string()
    .required()
    .label(form.methodOfTransportation.label),
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
            name={form.maritalStatus.name}
            label={form.maritalStatus.name}
            options={[
              { label: "Single", value: "single" },
              { label: "Married", value: "married" },
              { label: "Widow/Widower", value: "widow/widower" },
              { label: "Divorced", value: "divorced" },
            ]}
          />
          <RadioGroupInput
            name={form.occupation.name}
            label={form.occupation.label}
            options={[
              { label: "Employed", value: "employed" },
              { label: "Unemployed", value: "unemployed" },
            ]}
          />
        </FormFieldContainer>
        <SelectInputField
          name={form.methodOfTransportation.name}
          selectItems={[{ name: "Bus", value: "bus" }]}
          label={form.methodOfTransportation.label}
          id={form.methodOfTransportation.name}
        />
        <SelectInputField
          name={form.religion.name}
          selectItems={[
            { name: "Christian", value: "christian" },
            { name: "Islam", value: "islam" },
          ]}
          label={form.religion.label}
          id={form.religion.name}
        />
        <SelectInputField
          name={form.highestEducation.name}
          selectItems={[
            { name: "Degree", value: "degree" },
            { name: "Master's Degree", value: "master" },
          ]}
          label={form.highestEducation.label}
          id={form.highestEducation.name}
        />
      </Box>
    </FormikInit>
  );
};
