import { FC, ReactNode, useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import { useFormikContext } from "formik";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

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
  WrapperBox,
  FormValuesListener,
} from "shared-ui/src";
import {
  RegistrationCard,
  RegistrationCardTitle,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "./common";
import {
  concepts,
  districts,
  malawiVillages,
  traditionalAuthorities,
} from "@/constants";
import { countries } from "@/constants/contries";
import { getInitialValues } from "@/helpers";
import { getPatientsWaitingForRegistrations } from "@/hooks/patientReg";
import { useParameters } from "@/hooks";
import {
  SearchRegistrationContext,
  SearchRegistrationContextType,
} from "@/contexts";

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

type Prop = {
  initialValues?: any;
  onSubmit: (value: any) => void;
  setContext: (context: any) => void;
};

const relationships = [
  {
    name: "Parent",
    value: concepts.PARENT,
  },
  {
    name: "Guardian",
    value: concepts.GUARDIAN,
  },
  {
    name: "Uncle/Auntie",
    value: concepts.UNCLE_AUNTIE,
  },
];

export const DemographicsForm: FC<Prop> = ({
  onSubmit,
  initialValues = init,
  setContext,
}) => {
  const { patient } = useContext(
    SearchRegistrationContext
  ) as SearchRegistrationContextType;

  const [gender, setGender] = useState();
  const [checked, setChecked] = useState(false);
  const [formValues, setFormValues] = useState<any>({});
  const [fieldFunction, setFieldFunction] = useState<any>();
  const { data: patients } = getPatientsWaitingForRegistrations();
  const { params } = useParameters();

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    const found = patients?.find((p) => p.uuid == params.id);

    if (found && fieldFunction) {
      const { setFieldValue } = fieldFunction;
      setFieldValue(form.firstName.name, found.given_name);
      setFieldValue(form.lastName.name, found.family_name);
    }
  }, [patients]);

  useEffect(() => {
    if (fieldFunction && checked) {
      const { setFieldValue } = fieldFunction;
      setFieldValue(
        form.currentDistrict.name,
        formValues[form.homeDistrict.name]
      );
      setFieldValue(
        form.currentVillage.name,
        formValues[form.homeVillage.name]
      );
      setFieldValue(
        form.currentTraditionalAuthority.name,
        formValues[form.homeTraditionalAuthority.name]
      );
    }
  }, [checked]);

  return (
    <>
      <RegistrationMainHeader>Demographics</RegistrationMainHeader>
      <RegistrationDescriptionText>
        The demographics form has been thoughtfully crafted to collect patient
        information, including personal details, contact information
      </RegistrationDescriptionText>
      <FormikInit
        validationSchema={schema}
        initialValues={{ ...initialValues, ...patient }}
        onSubmit={onSubmit}
        submitButtonText="next"
        submitButton={false}
      >
        <FormValuesListener getValues={setFormValues} />
        <TrackFormikContext
          getSetFieldFunction={(func: any) => setFieldFunction(func)}
          setFormContext={setContext}
        />
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
          <FormDatePicker
            width={"100%"}
            label={form.dob.label}
            name={form.dob.name}
          />
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
          <SearchComboBox
            name={form.homeTraditionalAuthority.name}
            label={form.homeTraditionalAuthority.label}
            multiple={false}
            options={traditionalAuthorities}
          />
          <SearchComboBox
            name={form.homeVillage.name}
            label={form.homeVillage.label}
            multiple={false}
            options={malawiVillages}
          />
        </RegistrationCard>

        <RegistrationCard>
          <RegistrationCardTitle>Current Location</RegistrationCardTitle>
          <WrapperBox>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={handleChecked} />}
              label="same as home location"
            />
          </WrapperBox>
          <SearchComboBox
            name={form.currentDistrict.name}
            label={form.currentDistrict.label}
            disabled={checked}
            multiple={false}
            options={districts.map((d) => ({
              id: d.district_name,
              label: d.district_name,
            }))}
          />
          <SearchComboBox
            name={form.currentTraditionalAuthority.name}
            label={form.currentTraditionalAuthority.label}
            disabled={checked}
            multiple={false}
            options={traditionalAuthorities}
          />

          <SearchComboBox
            name={form.currentVillage.name}
            label={form.currentVillage.label}
            disabled={checked}
            multiple={false}
            options={malawiVillages}
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
            name={form.nextOfKinFirstName.name}
            id={form.nextOfKinFirstName.name}
            label={form.nextOfKinFirstName.label}
          />
          <TextInputField
            name={form.nextOfKinLastName.name}
            id={form.nextOfKinLastName.name}
            label={form.nextOfKinLastName.label}
          />
          <SelectInputField
            name={form.nextOfKinRelationship.name}
            id={form.nextOfKinRelationship.name}
            label={form.nextOfKinRelationship.label}
            selectItems={relationships}
          />
          {/* <TextInputField
            name={form.guardianName.name}
            id={form.guardianName.name}
            label={form.guardianName.label}
          /> */}
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
  getSetFieldFunction,
}: {
  setFormContext: (context: any) => void;
  getSetFieldFunction?: (func: any) => void;
}) => {
  const context = useFormikContext();

  useEffect(() => {
    setFormContext(() => context);
  }, [context.dirty, context.isValid, context.values]);

  useEffect(() => {
    if (getSetFieldFunction) getSetFieldFunction(context);
  }, []);

  return null;
};
