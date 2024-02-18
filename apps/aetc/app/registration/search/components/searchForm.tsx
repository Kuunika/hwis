import { Box } from "@mui/material";
import React, { useState } from "react";
import {
  SearchComboBox,
  FormikInit,
  WrapperBox,
  TextInputField,
  RadioGroupInput,
  MainButton,
} from "shared-ui/src";
import * as Yup from "yup";

import { getInitialValues, notify } from "@/helpers";
import { NO, YES, concepts, traditionalAuthorities } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
};
const form = {
  identificationNumber: {
    name: "identificationNumber",
    label: "National Identification Number",
  },
  firstName: {
    name: "firstName",
    label: "First Name",
  },
  phoneNumber: {
    name: "phoneNumber",
    label: "Phone Number",
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
    label: "Current TA / Ward",
  },
  currentVillage: {
    name: "currentVillage",
    label: "Current Village / Location",
  },
  closeLandMark: {
    name: "closeLandMark",
    label: "Close Landmark",
  },
  nextOfKinFirstName: {
    name: "nextOfKinFirstName",
    label: "Next of kin First Name",
  },
  nextOfKinLastName: {
    name: "nextOfKinLastName",
    label: "Next Of Kin Last Name",
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
  nationality: {
    name: "nationality",
    label: "Nationality",
  },
  homeTraditionalAuthority: {
    name: "homeTraditionalAuthority",
    label: "Home Traditional Authority",
  },
  homeVillage: {
    name: "homeVillage",
    label: "Home Village",
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
  [form.phoneNumber.name]: Yup.string()
    .required()
    .label(form.phoneNumber.label),
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
  [form.nextOfKinFirstName.name]: Yup.string()
    .required()
    .label(form.nextOfKinFirstName.label),
  [form.nextOfKinLastName.name]: Yup.string()
    .required()
    .label(form.nextOfKinLastName.label),
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

  [form.guardianPhoneNumber.name]: Yup.string()
    .required()
    .label(form.guardianPhoneNumber.label),
});

const init = getInitialValues(form);

const initialValues = getInitialValues(form);

export const SearchForm = ({ onSubmit }: Prop) => {
  const spacing = {
    display: "flex",
    "& > :first-child": {
      mr: "5px",
    },
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={false}
    >
      <WrapperBox>
        <WrapperBox sx={spacing}>
          <TextInputField
            sx={{ width: "100%", my: 0 }}
            name={form.firstName.name}
            id={form.firstName.name}
            size="small"
            label={form.firstName.label}
          />
          <TextInputField
            sx={{ width: "100%", my: 0 }}
            name={form.lastName.name}
            id={form.lastName.name}
            size="small"
            label={form.lastName.label}
          />
        </WrapperBox>
        <WrapperBox sx={spacing}>
          <SearchComboBox
            width="44%"
            name={form.gender.name}
            label={form.gender.label}
            multiple={false}
            size="small"
            options={[
              { label: "Male", id: "Male" },
              { label: "Female", id: "Female" },
            ]}
          />
          <SearchComboBox
            width="100%"
            size="small"
            name={form.homeTraditionalAuthority.name}
            label={form.homeTraditionalAuthority.label}
            multiple={false}
            options={traditionalAuthorities}
          />
        </WrapperBox>
        <MainButton
          sx={{ width: "100%", height: "5ch", borderRadius: "10px" }}
          type="submit"
          onClick={() => {}}
          title={"search"}
        />
      </WrapperBox>
    </FormikInit>
  );
};
