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
import {
  RegistrationCard,
  RegistrationCardTitle,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "./common";

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
    <>
      <RegistrationMainHeader>Social History</RegistrationMainHeader>
      <RegistrationDescriptionText>
        The social history form covers a range of topics, including social
        relationships, occupational history, and any other factors that may
        contribute to your overall well-being.
      </RegistrationDescriptionText>
      <FormikInit
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={schema}
        submitButtonText="next"
        submitButton={false}
      >
        <RegistrationCard>
          <RegistrationCardTitle>Marital Status</RegistrationCardTitle>
          <RadioGroupInput
            row={true}
            name={form.maritalStatus.name}
            label={""}
            options={[
              { label: "Single", value: "single" },
              { label: "Married", value: "married" },
              { label: "Widow", value: "widow/widower" },
              { label: "Divorced", value: "divorced" },
            ]}
          />
        </RegistrationCard>
        <RegistrationCard>
          <RegistrationCardTitle>Religion</RegistrationCardTitle>
          <SelectInputField
            name={form.religion.name}
            selectItems={[
              { name: "Christian", value: "christian" },
              { name: "Islam", value: "islam" },
            ]}
            label={form.religion.label}
            id={form.religion.name}
          />
        </RegistrationCard>

        <RegistrationCard>
          <RegistrationCardTitle>Occupation</RegistrationCardTitle>
          <RadioGroupInput
            row={true}
            name={form.occupation.name}
            label={""}
            options={[
              { label: "Employed", value: "employed" },
              { label: "Unemployed", value: "unemployed" },
            ]}
          />
        </RegistrationCard>
        <RegistrationCard>
          <RegistrationCardTitle>Occupation</RegistrationCardTitle>
          <SelectInputField
            name={form.methodOfTransportation.name}
            selectItems={[{ name: "Bus", value: "bus" }]}
            label={form.methodOfTransportation.label}
            id={form.methodOfTransportation.name}
          />
        </RegistrationCard>

        <RegistrationCard>
          <RegistrationCardTitle>Highest Education</RegistrationCardTitle>
          <SelectInputField
            name={form.highestEducation.name}
            selectItems={[
              { name: "Degree", value: "degree" },
              { name: "Master's Degree", value: "master" },
            ]}
            label={form.highestEducation.label}
            id={form.highestEducation.name}
          />
        </RegistrationCard>
      </FormikInit>
    </>
  );
};
