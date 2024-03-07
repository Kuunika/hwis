import { FC } from "react";

import * as Yup from "yup";
import {
  FormikInit,
  RadioGroupInput,
  SelectInputField,

} from "shared-ui/src";
import { concepts } from "@/constants";
import {
  RegistrationCard,
  RegistrationCardTitle,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "./common";
import { TrackFormikContext } from "./demographicsForm";
import { getInitialValues } from "@/helpers";

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
    .label(form.maritalStatus.label),
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
  initialValues?: any;
  onSubmit: (values: any) => void;
  setContext: (context: any) => void;
};

export const SocialHistoryForm: FC<Prop> = ({
  onSubmit,
  initialValues = getInitialValues(form),
  setContext,
}) => {
  return (
    <>
      <RegistrationMainHeader id="2">Social History</RegistrationMainHeader>
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
        <TrackFormikContext setFormContext={setContext} />
        <RegistrationCard>
          <RegistrationCardTitle>Marital Status</RegistrationCardTitle>
          <RadioGroupInput
            row={true}
            name={form.maritalStatus.name}
            label={form.maritalStatus.label}
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
              { name: "Christianity", value: "Christianity" },
              { name: "Muslim", value: "Muslim" },
              { name: "Buddhism", value: "Buddhism" },
              { name: "Rastafarian", value: "Rastafarian" },
              { name: "Atheist", value: "Atheist" },
              { name: "Traditional", value: "Traditional" },
              { name: "Other", value: "Other" },
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
              { label: "Working", value: "working" },
              { label: "Business", value: "business" },
              { label: "Unemployed", value: "unemployed" },
              { label: "Self Employed", value: "selfemployed" },
              { label: "Student", value: "student" },
            ]}
          />
        </RegistrationCard>
        <RegistrationCard>
          <RegistrationCardTitle>Transportation</RegistrationCardTitle>
          <SelectInputField
            name={form.methodOfTransportation.name}
            selectItems={[
              { name: "Walking", value: "walking" },
              { name: "Ambulance", value: "ambulance" },
              { name: "Public transport", value: "public_transport" },
              { name: "Private transport", value: "private_transport" },
              { name: "Police vehicle", value: "police_vehicle" },
              {
                name: "Other public or company vehicle",
                value: "other_public_company_vehicle",
              },
              { name: "Motorcycle", value: "motorcycle" },
              { name: "Taxi (car/motorcycle)", value: "taxi" },
              { name: "Bicycle", value: "bicycle" },
            ]}
            label={form.methodOfTransportation.label}
            id={form.methodOfTransportation.name}
          />
        </RegistrationCard>

        <RegistrationCard>
          <RegistrationCardTitle>Highest Education</RegistrationCardTitle>
          <SelectInputField
            name={form.highestEducation.name}
            selectItems={[
              { name: "Primary", value: "primary" },
              { name: "Secondary", value: "secondary" },
              { name: "Tertiary", value: "tertiary" },
              { name: "None", value: "none" },
              { name: "Other", value: "other" },

            ]}
            label={form.highestEducation.label}
            id={form.highestEducation.name}
          />
        </RegistrationCard>
      </FormikInit>
    </>
  );
};
