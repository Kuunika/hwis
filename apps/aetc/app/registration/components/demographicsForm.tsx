import { FC, useState } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  TextInputField,
  RadioGroupInput,
  SelectInputField,
  FieldsContainer,
} from "shared-ui/src";

const form = {
  identificationNumber: {
    name: "identificationNumber",
    label: "Identification Number",
  },
  firstName: {
    name: "firstName",
    label: "First Name",
  },
  lastName: {
    name: "lastName",
    label: "Last Name",
  },
  dob: {
    name: "birthDate",
    label: "Date of Birth",
  },
  gender: {
    name: "gender",
    label: "Gender",
  },
  currentDistrict: {
    name: "currentDistrict",
    label: "Current District",
  },
  currentTraditionalAuthority: {
    name: "currentTraditionalAuthority",
    label: "Current Traditional Authority",
  },
  currentVillage: {
    name: "currentVillage",
    label: "Current Village",
  },
  closeLandMark: {
    name: "closeLandMark",
    label: "Current Village",
  },
  nextOfKinName: {
    name: "nextOfKinName",
    label: "Next Of Kin Name",
  },
  nextOfKinRelationship: {
    name: "nextOfKinRelationship",
    label: "Next Of Kin Relationship",
  },
  nextOfKinPhoneNumber: {
    name: "nextOfKinPhoneNumber",
    label: "Next Of Kin Phone Number",
  },
  homeDistrict: {
    name: "homeDistrict",
    label: "Home District",
  },
  homeTraditionalAuthority: {
    name: "homeTraditionalAuthority",
    label: "Home Traditional Authority",
  },
  homeVillage: {
    name: "homeVillage",
    label: "Home Village",
  },
  guardianName: {
    name: "guardianName",
    label: "Guardian Name",
  },
  guardianPhoneNumber: {
    name: "guardianPhoneNumber",
    label: "Guardian Phone Number",
  },
};

const schema = Yup.object().shape({
  [form.identificationNumber.name]: Yup.string()
    .required()
    .label(form.identificationNumber.label),
  [form.firstName.name]: Yup.string().required().label(form.firstName.label),
  [form.lastName.name]: Yup.string().required().label(form.lastName.label),
  [form.dob.name]: Yup.string().label(form.dob.label),
  [form.gender.name]: Yup.string().required().label(form.gender.label),
  [form.currentDistrict.name]: Yup.string()
    .required()
    .label(form.currentDistrict.label),
  [form.currentTraditionalAuthority.name]: Yup.string()
    .required()
    .label(form.currentTraditionalAuthority.label),
  [form.currentVillage.name]: Yup.string()
    .required()
    .label(form.currentDistrict.label),
  [form.closeLandMark.name]: Yup.string()
    .required()
    .label(form.closeLandMark.label),
  [form.nextOfKinName.name]: Yup.string()
    .required()
    .label(form.nextOfKinName.label),
  [form.nextOfKinRelationship.name]: Yup.string()
    .required()
    .label(form.nextOfKinRelationship.label),
  [form.nextOfKinPhoneNumber.name]: Yup.string().label(
    form.nextOfKinRelationship.label
  ),

  [form.homeDistrict.name]: Yup.string()
    .required()
    .label(form.homeDistrict.label),
  [form.homeTraditionalAuthority.name]: Yup.string()
    .required()
    .label(form.homeTraditionalAuthority.label),
  [form.homeVillage.name]: Yup.string()
    .required()
    .label(form.homeVillage.label),
  [form.guardianName.name]: Yup.string()
    .required()
    .label(form.guardianName.name),
  [form.guardianPhoneNumber.name]: Yup.string()
    .required()
    .label(form.guardianPhoneNumber.label),
});

type Prop = {
  initialValues: any;
  onSubmit: (value: any) => void;
};

export const DemographicsForm: FC<Prop> = ({ onSubmit, initialValues }) => {
  const [gender, setGender] = useState();

  console.log({ gender });

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <FieldsContainer>
        <TextInputField
          name={form.identificationNumber.name}
          id={form.identificationNumber.name}
          label={form.identificationNumber.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.firstName.name}
          id={form.firstName.name}
          label={form.firstName.label}
        />
        <TextInputField
          name={form.lastName.name}
          id={form.lastName.name}
          label={form.lastName.label}
        />
      </FieldsContainer>

      <FieldsContainer>
        <RadioGroupInput
          getValue={(value) => setGender(value)}
          name={form.gender.name}
          label={form.gender.label}
          options={[
            { label: "Male", value: "yes" },
            { label: "Female", value: "no" },
          ]}
        />
        <SelectInputField
          name={form.homeDistrict.name}
          id={form.homeDistrict.name}
          label={form.homeDistrict.label}
          selectItems={[{ name: "Blantyre", value: "blantyre" }]}
        />
      </FieldsContainer>

      <FieldsContainer sx={{ justifyContent: "space-between" }}>
        <SelectInputField
          name={form.currentDistrict.name}
          id={form.currentDistrict.name}
          label={form.currentDistrict.label}
          selectItems={[{ name: "Blantyre", value: "blantyre" }]}
        />

        <SelectInputField
          name={form.currentTraditionalAuthority.name}
          id={form.currentTraditionalAuthority.name}
          label={form.currentTraditionalAuthority.label}
          selectItems={[{ name: "Blantyre", value: "blantyre" }]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <SelectInputField
          name={form.currentVillage.name}
          id={form.currentVillage.name}
          label={form.currentVillage.label}
          selectItems={[{ name: "Blantyre", value: "blantyre" }]}
        />
        <TextInputField
          name={form.closeLandMark.name}
          id={form.closeLandMark.name}
          label={form.closeLandMark.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.nextOfKinName.name}
          id={form.nextOfKinName.name}
          label={form.nextOfKinName.label}
        />
        <TextInputField
          name={form.nextOfKinRelationship.name}
          id={form.nextOfKinRelationship.name}
          label={form.nextOfKinRelationship.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <SelectInputField
          name={form.homeTraditionalAuthority.name}
          id={form.homeTraditionalAuthority.name}
          label={form.homeTraditionalAuthority.label}
          selectItems={[{ name: "Blantyre", value: "blantyre" }]}
        />
        <SelectInputField
          name={form.homeVillage.name}
          id={form.homeVillage.name}
          label={form.homeVillage.label}
          selectItems={[{ name: "Blantyre", value: "blantyre" }]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.guardianName.name}
          id={form.guardianName.name}
          label={form.guardianName.name}
        />
        <TextInputField
          name={form.guardianPhoneNumber.name}
          id={form.guardianPhoneNumber.name}
          label={form.guardianPhoneNumber.label}
        />
      </FieldsContainer>
    </FormikInit>
  );
};
