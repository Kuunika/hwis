import { FC } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  TextInputField,
  RadioGroupInput,
  SelectInputField,
} from "shared-ui/src";

const schema = Yup.object().shape({
  firstName: Yup.string().required().label("first name"),
  lastName: Yup.string().required().label("last name"),
  dob: Yup.string().label("date of birth"),
  gender: Yup.string().required().label("gender"),
  currentDistrict: Yup.string().required().label("current district"),
  currentTraditionAuthority: Yup.string()
    .required()
    .label("current tradition authority"),
  currentVillage: Yup.string().required().label("current village"),
  closeLandMark: Yup.string().required().label("close land mark"),
  nextOfKinName: Yup.string().required().label("next of kin name"),
  nextOfKinRelationship: Yup.string()
    .required()
    .label("next of kin relationship"),
  nextOfKinPhoneNumber: Yup.string()
    .required()
    .label("next of kin phone number"),
  id: Yup.string().required().label("name of kin identification number"),
  homeDistrict: Yup.string().required().label("hone district"),
  homeTraditionalAuthority: Yup.string()
    .required()
    .label("home traditional authority"),
  homeVillage: Yup.string().required().label("home village"),
  guardianName: Yup.string().required().label("guardian name"),
  guardianPhoneNumber: Yup.string().required().label("guardian phone number"),
});

const initialValues = {
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
  homeDistrict: "",
  homeTraditionalAuthority: "",
  homeVillage: "",
  guardianName: "",
  guardianPhoneNumber: "",
};

type Prop = {
  onSubmit: () => void;
};

export const DemographicsForm: FC<Prop> = ({ onSubmit }) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            mr: "1ch",
          }}
        >
          <TextInputField name="id" id="id" label="Identification Number" />
          <TextInputField name="firstName" id="firstName" label="First Name" />
          <TextInputField name="lastName" id="lastName" label="Last Name" />
          <RadioGroupInput
            name="gender"
            label="Gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
          />
          <SelectInputField
            name="currentDistrict"
            id="currentDistrict"
            label="Current District"
            selectItems={[{ name: "Blantyre", value: "blantyre" }]}
          />

          <SelectInputField
            name="currentTraditionAuthority"
            id="currentTraditionAuthority"
            label="Current Tradition Authority"
            selectItems={[{ name: "Blantyre", value: "blantyre" }]}
          />
          <SelectInputField
            name="currentVillage"
            id="currentVillage"
            label="Current Village"
            selectItems={[{ name: "Blantyre", value: "blantyre" }]}
          />
          <TextInputField
            name="closeLandMark"
            id="closeLandMark"
            label="Closest Landmark/Plot number"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            mx: "1ch",
          }}
        >
          <TextInputField
            name="nextOfKinName"
            id="nextOfKinName"
            label="Next Of Kin Name"
          />
          <TextInputField
            name="nextOfKinRelationship"
            id="nextOfKinRelationship"
            label="Next Of Kin Relationship"
          />
          <TextInputField
            name="nextOfKinPhoneNumber"
            id="nextOfKinPhoneNumber"
            label="Next Of Kin Relationship"
          />
          <SelectInputField
            name="homeDistrict"
            id="homeDistrict"
            label="Home District"
            selectItems={[{ name: "Blantyre", value: "blantyre" }]}
          />
          <SelectInputField
            name="homeTraditionalAuthority"
            id="homeTraditionalAuthority"
            label="Home Tradition Authority"
            selectItems={[{ name: "Blantyre", value: "blantyre" }]}
          />
          <SelectInputField
            name="homeVillage"
            id="homeVillage"
            label="Home Village"
            selectItems={[{ name: "Blantyre", value: "blantyre" }]}
          />
          <TextInputField
            name="guardianName"
            id="guardianName"
            label="Guardian Number"
          />
          <TextInputField
            name="guardianPhoneNumber"
            id="guardianPhoneNumber"
            label="Guardian Phone Number"
          />
        </Box>
      </Box>
    </FormikInit>
  );
};
