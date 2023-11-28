import { FC, useState } from "react";
import * as Yup from "yup";
import {
  FormikInit,
  TextInputField,
  SelectInputField,
  FieldsContainer,
} from "shared-ui/src";

const form = {
  registrationNumber: {
    name: "registrationNumber",
    label: "ANC registration Number",
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
    name: "dob",
    label: "Date of Birth",
  },
  age: {
    name: "age",
    label: "Age",
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
  landmark: {
    name: "landmark",
    label: "Landmark",
  },
  phoneNumber: {
    name: "phoneNumber",
    label: "Woman's Phone number-optional",
  },
  nextOfKinFirstName: {
    name: "nextOfKinFirstName",
    label: "Next Of Kin Firstname",
  },
  nextOfKinLastname: {
    name: "nextOfKinLastname",
    label: "Next Of Kin Lastname",
  },
  nextOfKinPhoneNumber: {
    name: "nextOfKinPhoneNumber",
    label: "Next Of Kin Phone Number-Optional",
  },
};

const schema = Yup.object().shape({
  [form.registrationNumber.name]: Yup.string()
    .required()
    .label(form.registrationNumber.label),
  [form.firstName.name]: Yup.string().required().label(form.firstName.label),
  [form.lastName.name]: Yup.string().required().label(form.lastName.label),
  [form.age.name]: Yup.string().required().label(form.age.label),
  [form.currentDistrict.name]: Yup.string()
    .required()
    .label(form.currentDistrict.label),
  [form.currentTraditionalAuthority.name]: Yup.string()
    .required()
    .label(form.currentTraditionalAuthority.label),
  [form.currentVillage.name]: Yup.string()
    .required()
    .label(form.currentDistrict.label),
  [form.nextOfKinFirstName.name]: Yup.string()
    .required()
    .label(form.nextOfKinFirstName.label),
  [form.nextOfKinLastname.name]: Yup.string()
    .required()
    .label(form.nextOfKinLastname.label),
  [form.landmark.name]: Yup.string()
    .required()
    .label(form.landmark.label),
});


type Prop = {
  initialValues: any;
  onSubmit: () => void;
};

export const DemographicsForm: FC<Prop> = ({ onSubmit, initialValues }) => {

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <FieldsContainer>
        <TextInputField
          name={form.registrationNumber.name}
          id={form.registrationNumber.name}
          label={form.registrationNumber.label}
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
        <br/>
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
            name={form.age.name}
            id={form.age.name}
            label={form.age.label}
            sx={{ width: '49%' }}
        />

        {/* <span
            style={{ textDecoration: 'none', color: 'blue', fontSize: 'smaller', cursor: 'pointer' }}
            onClick={() => setModalOpen(true)}
        >
        Age unknown? Click here
      </span> */}

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
          name={form.landmark.name}
          id={form.landmark.name}
          label={form.landmark.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.nextOfKinFirstName.name}
          id={form.nextOfKinFirstName.name}
          label={form.nextOfKinFirstName.label}
        />
        <TextInputField
          name={form.nextOfKinLastname.name}
          id={form.nextOfKinLastname.name}
          label={form.nextOfKinLastname.label}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
            id={form.phoneNumber.name}
            name={form.phoneNumber.name}
            label={form.phoneNumber.label}
        />
        <TextInputField
            id={form.nextOfKinPhoneNumber.name}
            name={form.nextOfKinPhoneNumber.name}
            label={form.nextOfKinPhoneNumber.label}
        />
      </FieldsContainer>
    </FormikInit>
  );
};
