import { FC, ReactNode, useState } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  TextInputField,
  RadioGroupInput,
  SelectInputField,
  FieldsContainer,
  MainPaper,
  MainTypography,
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

const init = {
  firstName: "",
  lastName: "",
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
};

export const DemographicsForm: FC<Prop> = ({
  onSubmit,
  initialValues = init,
}) => {
  const [gender, setGender] = useState();

  const styleSx = {
    display: "flex",
    flexDirection: "column",
    px: "10ch",
    py: "5ch",
    mb: "2ch",
  };

  return (
    <>
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: 24,
          fontWeight: 700,
          lineHeight: "29px",
          letterSpacing: 0,
          textAlign: "center",
        }}
      >
        Demographics
      </MainTypography>
      <MainTypography
        alignSelf={"center"}
        sx={{
          fontFamily: "Inter",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "21px",
          letterSpacing: 0,
          color: "#636363",
          width: "50ch",
          textAlign: "center",
          my: "2ch",
        }}
      >
        The demographics form has been thoughtfully crafted to collect patient
        information, including personal details, contact information
      </MainTypography>
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitButtonText="next"
      >
        <MainPaper elevation={0} sx={styleSx}>
          <PaperTitle>Personal Information</PaperTitle>
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
        </MainPaper>

        <MainPaper elevation={0} sx={styleSx}>
          <PaperTitle>Home Location</PaperTitle>
          <SelectInputField
            name={form.homeDistrict.name}
            id={form.homeDistrict.name}
            label={form.homeDistrict.label}
            selectItems={[{ name: "Blantyre", value: "blantyre" }]}
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
        </MainPaper>

        <MainPaper elevation={0} sx={styleSx}>
          <PaperTitle>Current Location</PaperTitle>
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
        </MainPaper>

        <MainPaper elevation={0} sx={styleSx}>
          <PaperTitle>Guardian Information</PaperTitle>
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
        </MainPaper>
      </FormikInit>
    </>
  );
};

const PaperTitle = ({ children }: { children: ReactNode }) => {
  return (
    <MainTypography
      sx={{
        fontFamily: "Inter",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "0em",
        textAlign: "center",
        my: "2ch",
      }}
    >
      {children}
    </MainTypography>
  );
};
