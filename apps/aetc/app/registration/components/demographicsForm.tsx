import { FC, useContext, useEffect, useState } from "react";
;
import * as Yup from "yup";
import { useFormikContext } from "formik";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import {
  FormikInit,
  TextInputField,
  RadioGroupInput,
  SelectInputField,
  FormDatePicker,
  SearchComboBox,
  WrapperBox,
  FormValuesListener,
  MainTypography,
} from "shared-ui/src";
import {
  RegistrationCard,
  RegistrationCardTitle,
  RegistrationDescriptionText,
  RegistrationMainHeader,
} from "./common";
import {
  concepts
} from "@/constants";
import { countries } from "@/constants/contries";
import { getInitialValues } from "@/helpers";
import { useParameters } from "@/hooks";
import {
  SearchRegistrationContext,
  SearchRegistrationContextType,
} from "@/contexts";
import { getDistricts, getTraditionalAuthorities, getVillages } from "@/hooks/loadStatic";
import { LocationContext, LocationContextType } from "@/contexts/location";
import { getPatientRelationships } from "@/hooks/patientReg";
import { OverlayLoader } from "@/components/backdrop";
import { estimateBirthdate } from "@/helpers/dateTime";

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
  birthDateEstimated: {
    name: "birthdateEstimated",
    label: "Birthdate Estimated",
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
    label: "Phone Number",
  },
  guardianFirstName: {
    name: "guardianFirstName",
    label: "First Name",
  },
  guardianLastName: {
    name: "guardianLastName",
    label: "Last Name",
  },
  guardianNumber: {
    name: "guardianNumber",
    label: "Phone Number",
  },
  guardianPresent: {
    name: "guardianPresent",
    label: "Guardian Present",
  },
  age: {
    name: "age",
    label: "Estimated Age",
  },

};
const phoneRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = Yup.object().shape({
  [form.identificationNumber.name]: Yup.string().label(
    form.identificationNumber.label
  ),
  [form.firstName.name]: Yup.string().required().label(form.firstName.label),
  [form.phoneNumber.name]: Yup.string()
    .matches(phoneRegex, "phone number not valid")
    .min(10)
    .label(form.phoneNumber.label),
  [form.lastName.name]: Yup.string().required().label(form.lastName.label),
  [form.dob.name]: Yup.date()
    .when(form.birthDateEstimated.name, {
      is: (value: any) => value == 'true',
      then: () => Yup.date().required(),
    })
    .test('valid-age', 'Age must be at least 14 years and not in the future', function (value) {

      if (!value) return true;

      const selectedDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
        age--;
      }
      return age >= 14 && age >= 0;
    }),



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
    .matches(phoneRegex, "Phone Number valid")
    .min(10)
    .label(form.guardianPhoneNumber.label),


  [form.guardianFirstName.name]: Yup.string()
    .label(form.guardianFirstName.label),
  [form.guardianLastName.name]: Yup.string()
    .label(form.guardianLastName.label),
  [form.guardianNumber.name]: Yup.string()
    .matches(phoneRegex, "Phone Number valid")
    .min(10)
    .label(form.guardianNumber.label),
  [form.guardianPresent.name]: Yup.string().required()
    .label(form.guardianPresent.label),
  [form.birthDateEstimated.name]: Yup.boolean().required()
    .label(form.birthDateEstimated.label),
  [form.age.name]: Yup.number().when(form.birthDateEstimated.name, {
    is: (value: any) => (value == true) || value == 'true',
    then: () => Yup.number().required(),
  })
    .label(form.age.label),
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
    name: "Uncle",
    value: concepts.UNCLE_AUNTIE,
  },
  {
    name: "Auntie",
    value: concepts.AUNTIE,
  },
  {
    name: "Spouse",
    value: concepts.SPOUSE,
  },
  {
    name: "Siblings",
    value: concepts.SIBLING,
  },
];

export type LocationType = {
  village: number | string | undefined,
  traditionalAuthority: number | string | undefined,
  district: number | string | undefined,
}

export const DemographicsForm: FC<Prop> = ({
  onSubmit,
  initialValues = init,
  setContext,
}) => {
  const [guardianAvailable, setGuardianAvailable] = useState('')
  const { initialRegisteredPatient, patient, registrationType, searchedPatient } = useContext(
    SearchRegistrationContext
  ) as SearchRegistrationContextType;

  const [selectedLocation, setSelectedLocation] = useState<LocationType>({ village: "", traditionalAuthority: "", district: "" })
  const [currentSelectedLocation, setCurrentSelectedLocation] = useState<LocationType>({ village: "", traditionalAuthority: "", district: "" })

  const { villages, districts, traditionalAuthorities } = useContext(LocationContext) as LocationContextType

  const [gender, setGender] = useState();
  const [checked, setChecked] = useState(false);
  const [guardianChecked, setGuardianChecked] = useState(false);
  const [formValues, setFormValues] = useState<any>({});
  const [fieldFunction, setFieldFunction] = useState<any>();
  const [_init, setInit] = useState({})
  const [nextOfKinInitialValues, setNextOfKinInitialValue] = useState({})

  const { params } = useParameters();
  const { refetch, isRefetching, data: patientRelationships, isSuccess } = getPatientRelationships(params.id as string)

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const handleGuardianChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuardianChecked(event.target.checked);
  };


  useEffect(() => {
    if (isSuccess && patientRelationships?.length > 0) {
      const nextOfKin = patientRelationships[0].person_b;
      setNextOfKinInitialValue({
        [form.nextOfKinFirstName.name]: nextOfKin.names[0].given_name,
        [form.nextOfKinLastName.name]: nextOfKin.names[0].family_name,
      })

    }
  }, [isSuccess])


  useEffect(() => {

    if (fieldFunction) {
      const { setFieldValue } = fieldFunction;
      const date = estimateBirthdate(formValues[form.age.name])?.iso;
      setFieldValue(form.dob.name, date);
    }


  }, [formValues[form.age.name]])

  useEffect(() => {
    // const found = patients?.find((p) => p.uuid == params.id);
    if (fieldFunction) {
      const { setFieldValue } = fieldFunction;
      setFieldValue(form.firstName.name, searchedPatient.firstName);
      setFieldValue(form.lastName.name, searchedPatient.lastName)
      setFieldValue(form.gender.name, searchedPatient.gender)
      setFieldValue(form.birthDateEstimated.name, false)
    }
  }, [initialRegisteredPatient]);

  useEffect(() => {
    if (fieldFunction && checked) {
      const { setFieldValue } = fieldFunction;

      setCurrentSelectedLocation(selectedLocation);
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
  }, [checked, formValues]);



  useEffect(() => {
    if (fieldFunction && guardianChecked) {
      const { setFieldValue } = fieldFunction;
      setFieldValue(
        form.guardianFirstName.name,
        formValues[form.nextOfKinFirstName.name]
      );
      setFieldValue(
        form.guardianLastName.name,
        formValues[form.nextOfKinLastName.name]
      );
      setFieldValue(
        form.guardianNumber.name,
        formValues[form.guardianPhoneNumber.name]
      );
    }
  }, [guardianChecked]);


  useEffect(() => {
    let init = {

    }

    if (registrationType == "local" || registrationType == "remote") {

      // search for relations
      refetch()

      const homeDistrict = patient?.addresses[0]?.address1
      const homeTraditionalAuthority = patient?.addresses[0]?.home_traditional_authority
      const homeVillage = patient?.addresses[0]?.address2;

      const currentDistrict = patient?.addresses[0]?.current_district;
      const currentTraditionalAuthority = patient?.addresses[0]?.current_traditional_authority;
      const currentVillage = patient?.addresses[0]?.current_village

      init = {
        [form.dob.name]: patient.birthdate,
        [form.nationality.name]: patient?.addresses[0]?.country,
        [form.homeDistrict.name]: homeDistrict,
        [form.homeTraditionalAuthority.name]: homeTraditionalAuthority,
        [form.homeVillage.name]: homeVillage,
        [form.currentDistrict.name]: currentDistrict,
        [form.currentTraditionalAuthority.name]: currentTraditionalAuthority,
        [form.currentVillage.name]: currentVillage
      }

      setInit(init)

      const homeDistrictId = districts.find(d => d.name == homeDistrict)?.district_id;
      const homeTraditionalAuthorityId = traditionalAuthorities.find(d => d.name == homeTraditionalAuthority)?.traditional_authority_id;
      const homeVillageId = villages.find(d => d.name == homeVillage)?.village_id;

      const currentDistrictId = districts.find(d => d.name == currentDistrict)?.district_id;
      const currentTraditionalAuthorityId = traditionalAuthorities.find(d => d.name == currentTraditionalAuthority)?.traditional_authority_id;
      const currentVillageId = villages.find(d => d.name == currentVillage)?.village_id;

      setCurrentSelectedLocation({ village: homeVillageId, traditionalAuthority: homeTraditionalAuthorityId, district: homeDistrictId });
      setSelectedLocation({ village: currentVillageId, traditionalAuthority: currentTraditionalAuthorityId, district: currentDistrictId })

    }

  }, [])


  return (
    <>
      <RegistrationMainHeader id="1">Demographics</RegistrationMainHeader>
      <RegistrationDescriptionText>
        The demographics form has been thoughtfully crafted to collect patient
        information, including personal details, contact information
      </RegistrationDescriptionText>
      <FormikInit
        validationSchema={schema}
        initialValues={{
          ...initialValues, ..._init, [form.firstName.name]: searchedPatient.firstName,
          [form.lastName.name]: searchedPatient.lastName,
          [form.gender.name]: searchedPatient.gender == 'M' ? 'Male' : "Female",
          ...nextOfKinInitialValues,
          [form.birthDateEstimated.name]: false
        }}
        onSubmit={onSubmit}
        submitButtonText="next"
        submitButton={false}
        enableReinitialize={true}
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

          <RadioGroupInput
            name={form.birthDateEstimated.name}
            label={form.birthDateEstimated.label}
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />

          <TextInputField
            sx={{
              display: formValues[form.birthDateEstimated.name] == 'true' ? 'flex' : 'none'
            }}
            name={form.age.name}
            id={form.age.name}
            label={form.age.label}
          />

          {formValues[form.age.name] > 0 && formValues[form.birthDateEstimated.name] == 'true' && <>
            <br />
            <MainTypography variant="body1">
              Estimated birth date  <b>{estimateBirthdate(formValues[form.age.name])?.readable}</b>
            </MainTypography>
            <br />

          </>}



          <FormDatePicker
            sx={{
              display: (formValues[form.birthDateEstimated.name] == false || formValues[form.birthDateEstimated.name] == 'false') ? 'flex' : 'none',
              width: "100%",

            }}
            width={"100%"}
            label={form.dob.label}
            name={form.dob.name}
            getValue={(value: any, validateFunc: any) => {
            }}
          />




          {/* <ErrorMessage
            name={form.dob.name}
            component="div"
            className="error-message"
            style={{ color: "red" }}
          /> */}

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
            getValue={(value) => {
              const district = districts.find(d => d.name == value);
              if (district) {
                setSelectedLocation(selection => ({ ...selection, district: district.district_id.toString() }))
              }

            }}
            options={districts ? districts.map((d) => ({
              id: d.name,
              label: d.name,
            })) : []}
          />
          <SearchComboBox
            name={form.homeTraditionalAuthority.name}
            label={form.homeTraditionalAuthority.label}
            multiple={false}
            getValue={(value) => {
              const traditionalAuthority = traditionalAuthorities.find(d => d.name == value);

              if (traditionalAuthority)
                setSelectedLocation(selection => ({ ...selection, traditionalAuthority: traditionalAuthority.traditional_authority_id.toString() }))
            }}

            options={traditionalAuthorities ? traditionalAuthorities.filter(t => t.district_id.toString() == selectedLocation.district).map(t => ({
              id: t.name,
              label: t.name
            })) : []}
          />
          <SearchComboBox
            name={form.homeVillage.name}
            label={form.homeVillage.label}
            multiple={false}
            options={villages ? villages.filter(v => v.traditional_authority_id.toString() == selectedLocation.traditionalAuthority).map((v: any) => ({
              id: v.name,
              label: v.name
            })) : []}
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
            // disabled={checked}
            multiple={false}
            getValue={(value) => {
              const district = districts.find(d => d.name == value);
              if (district)
                setCurrentSelectedLocation(selection => ({ ...selection, district: district.district_id.toString() }))
            }}
            options={districts ? districts.map((d: any) => ({
              id: d.name,
              label: d.name,
            })) : []}
          />
          <SearchComboBox
            name={form.currentTraditionalAuthority.name}
            label={form.currentTraditionalAuthority.label}
            getValue={(value) => {
              const district = traditionalAuthorities.find(d => d.name == value);
              if (district)
                setCurrentSelectedLocation(selection => ({ ...selection, traditionalAuthority: district.traditional_authority_id.toString() }))
            }}
            // disabled={checked}
            multiple={false}
            options={traditionalAuthorities ? traditionalAuthorities.filter(t => t.district_id.toString() == currentSelectedLocation.district).map(t => ({
              id: t.name,
              label: t.name
            })) : []}
          />

          <SearchComboBox
            name={form.currentVillage.name}
            label={form.currentVillage.label}
            // disabled={checked}
            multiple={false}
            options={villages ? villages.filter(v => v.traditional_authority_id.toString() == currentSelectedLocation.traditionalAuthority).map((v: any) => ({
              id: v.name,
              label: v.name
            })) : []}

          />
          <TextInputField
            name={form.closeLandMark.name}
            id={form.closeLandMark.name}
            label={form.closeLandMark.label}
          />
        </RegistrationCard>

        <RegistrationCard>
          <RegistrationCardTitle>Next of kin Information</RegistrationCardTitle>
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
          <TextInputField
            name={form.guardianPhoneNumber.name}
            id={form.guardianPhoneNumber.name}
            label={form.guardianPhoneNumber.label}
          />
        </RegistrationCard>

        <RegistrationCard>
          <RegistrationCardTitle>Guardian Information</RegistrationCardTitle>

          <RadioGroupInput
            name={form.guardianPresent.name}
            getValue={(value: any) => setGuardianAvailable(value)}
            label={form.guardianPresent.label}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />

          {guardianAvailable == "yes" && <>
            <WrapperBox>
              <FormControlLabel
                control={<Checkbox checked={guardianChecked} onChange={handleGuardianChecked} />}
                label="same as next of kin"
              />
            </WrapperBox>
            <TextInputField
              name={form.guardianFirstName.name}
              id={form.guardianFirstName.name}
              label={form.guardianFirstName.label}
            />
            <TextInputField
              name={form.guardianLastName.name}
              id={form.guardianLastName.name}
              label={form.guardianLastName.label}
            />
            <TextInputField
              name={form.guardianNumber.name}
              id={form.guardianNumber.name}
              label={form.guardianNumber.label}
            />
          </>}
          <OverlayLoader open={isRefetching} />
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
