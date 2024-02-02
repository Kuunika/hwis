import { FC, ReactNode, useEffect, useState } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import { useFormikContext } from "formik";

import {
  FormikInit,
  TextInputField,
  RadioGroupInput,
  SelectInputField,
  FieldsContainer,
  MainPaper,
  MainTypography,
  DatePickerInput,
  FormDatePicker,
  SearchComboBox,
} from "shared-ui/src";
import {
  RegistrationCard,
  RegistrationCardTitle,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "./common";
import { districts } from "@/constants";
import { countries } from "@/constants/contries";

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

const init = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  dob: "",
  gender: "",
  currentDistrict: "",
  currentTraditionAuthority: "",
  currentVillage: "",
  closeLandMark: "",
  nextOfKinName: "",
  nextOfKinRelationship: "",
  nextOfKinPhoneNumber: "",
  id: "",
  identificationNumber: "",
  homeDistrict: "",
  homeTraditionalAuthority: "",
  homeVillage: "",
  guardianName: "",
  guardianPhoneNumber: "",
};

type Prop = {
  initialValues?: any;
  onSubmit: (value: any) => void;
  setContext: (context: any) => void;
};

export const DemographicsForm: FC<Prop> = ({
  onSubmit,
  initialValues = init,
  setContext,
}) => {
  const [gender, setGender] = useState();

  return (
    <>
      <RegistrationMainHeader>Demographics</RegistrationMainHeader>
      <RegistrationDescriptionText>
        The demographics form has been thoughtfully crafted to collect patient
        information, including personal details, contact information
      </RegistrationDescriptionText>
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitButtonText="next"
        submitButton={false}
      >
        <TrackFormikContext setFormContext={setContext} />
        <RegistrationCard>
          <RegistrationCardTitle>Personal Information</RegistrationCardTitle>
          <TextInputField
            name={form.identificationNumber.name}
            id={form.identificationNumber.name}
            label={form.identificationNumber.label}
          />
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
          <RadioGroupInput
            getValue={(value) => setGender(value)}
            name={form.gender.name}
            label={form.gender.label}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
          />
          <FormDatePicker label={form.dob.label} name={form.dob.name} />
          <TextInputField
            name={form.phoneNumber.name}
            id={form.phoneNumber.name}
            label={form.phoneNumber.label}
          />
        </RegistrationCard>

        <RegistrationCard>
          <RegistrationCardTitle>Home Location</RegistrationCardTitle>
          <SearchComboBox
            name={form.nationality.name}
            label={form.nationality.label}
            multiple={false}
            options={countries.map((c) => ({
              id: c.nationality,
              label: c.nationality,
            }))}
          />
          <SearchComboBox
            name={form.homeDistrict.name}
            label={form.homeDistrict.label}
            multiple={false}
            options={districts.map((d) => ({
              id: d.district_name,
              label: d.district_name,
            }))}
          />
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
        </RegistrationCard>

        <RegistrationCard>
          <RegistrationCardTitle>Current Location</RegistrationCardTitle>
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
        </RegistrationCard>

        <RegistrationCard>
          <RegistrationCardTitle>Guardian Information</RegistrationCardTitle>
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
        </RegistrationCard>
      </FormikInit>
    </>
  );
};

export const TrackFormikContext = ({
  setFormContext,
}: {
  setFormContext: (context: any) => void;
}) => {
  const context = useFormikContext();

  useEffect(() => {
    setFormContext(() => context);
  }, [context.dirty, context.isValid, context.values]);

  return null;
};
