import { FC } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  RadioGroupInput,
  SelectInputField,
  FieldsContainer,
} from "shared-ui/src";
import { concepts } from "@/constants";

const form = {
  maritalStatus: {
    name: concepts.MARITAL_STATUS,
    label: "Marital Status",
  },
  occupation: {
    name: concepts.OCCUPATION,
    label: "Occupation",
  },
  religion: {
    name: concepts.RELIGION,
    label: "Religion",
  },
  highestEducation: {
    name: concepts.HIGHEST_EDUCATION,
    label: "Highest Education",
  },
  methodOfTransportation: {
    name: concepts.METHOD_OF_TRANSPORTATION,
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

type Prop = {
  initialValues: any;
  onSubmit: () => void;
};

export const SocialHistoryForm: FC<Prop> = ({ onSubmit, initialValues }) => {
  return (
    <FormikInit
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={schema}
      submitButtonText="next"
    >
      <br />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <FieldsContainer sx={{ alignItems: "flex-start" }}>
          <RadioGroupInput
            sx={{ mr: "10ch" }}
            name={form.maritalStatus.name}
            label={form.maritalStatus.label}
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
        </FieldsContainer>
        <br />
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
