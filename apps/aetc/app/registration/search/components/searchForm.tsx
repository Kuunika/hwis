import { Box } from "@mui/material";
import React, { useState } from "react";
import {
  SearchComboBox,
  FormikInit,
  WrapperBox,
  TextInputField,
  RadioGroupInput,
  MainButton,
  DatePickerInput,
  FormDatePicker,
} from "@/components";
import * as Yup from "yup";

import { getInitialValues, notify } from "@/helpers";
import { districts, malawiVillages, traditionalAuthorities } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
  fullForm?: boolean,
  init?: any;
};
const form = {
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
    label: "Estimated Age",
  },
  gender: {
    name: "gender",
    label: "Gender",
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
};

const schema = Yup.object().shape({
  [form.firstName.name]: Yup.string().required().label(form.firstName.label),
  [form.lastName.name]: Yup.string().required().label(form.lastName.label),
  [form.dob.name]: Yup.string().label(form.dob.label),
  [form.gender.name]: Yup.string().required().label(form.gender.label),
  [form.homeDistrict.name]: Yup.string().label(form.homeDistrict.label),
  [form.homeTraditionalAuthority.name]: Yup.string().label(
    form.homeTraditionalAuthority.label
  ),
  [form.homeVillage.name]: Yup.string().label(form.homeVillage.label),
});

const initialValues = getInitialValues(form);

export const SearchForm = ({ onSubmit, init, fullForm = true }: Prop) => {
  const spacing = {
    display: "flex",
    "& > :first-child": {
      mr: "5px",
    },
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={{ ...initialValues, ...init }}
      onSubmit={onSubmit}
      submitButton={false}
    >
      <WrapperBox>
        <WrapperBox sx={{ ...spacing, alignItems: "end", py: "1ch" }}>
          <TextInputField
            sx={{ width: "100%", my: 0 }}
            name={form.firstName.name}
            id={form.firstName.name}
            size="small"
            label={form.firstName.label}
          />
          <TextInputField
            sx={{ width: "100%", my: 0, mr: "5px" }}
            name={form.lastName.name}
            id={form.lastName.name}
            size="small"
            label={form.lastName.label}
          />
          <SearchComboBox
            width="100%"
            inputSx={{ m: 0 }}
            name={form.gender.name}
            label={form.gender.label}
            multiple={false}
            size="small"
            applyPadding={false}
            options={[
              { label: "Male", id: "M" },
              { label: "Female", id: "F" },
            ]}
          />
        </WrapperBox>

        {fullForm && <><WrapperBox sx={{ ...spacing }}>
          <SearchComboBox
            width="30%"
            name={form.gender.name}
            label={form.gender.label}
            multiple={false}
            size="small"
            options={[
              { label: "Male", id: "Male" },
              { label: "Female", id: "Female" },
            ]}
          />

          <TextInputField
            sx={{ width: "100%", my: 0 }}
            name={form.dob.name}
            id={form.dob.name}
            size="small"
            label={form.dob.label}
          />
          {/* <FormDatePicker
            width={"100%"}
            name={form.dob.name}
            label={form.dob.label}
            size="small"
          /> */}
        </WrapperBox>
          <WrapperBox display={"flex"}>
            <SearchComboBox
              sx={{ mr: "0.5ch" }}
              width="45%"
              size="small"
              name={form.homeDistrict.name}
              label={form.homeDistrict.label}
              multiple={false}
              options={districts.map((d) => ({
                id: d.district_name,
                label: d.district_name,
              }))}
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
          <WrapperBox>
            <SearchComboBox
              width="100%"
              size="small"
              name={form.homeVillage.name}
              label={form.homeVillage.label}
              multiple={false}
              options={malawiVillages}
            />
          </WrapperBox>

        </>}

        <MainButton
          sx={{ width: "100%", height: "5ch", borderRadius: "10px", mt: "1ch" }}
          type="submit"
          onClick={() => { }}
          title={"search"}
        />
      </WrapperBox>
    </FormikInit>
  );
};
