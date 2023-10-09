import { SectionContext, SectionContextType } from "@/contexts";
import { FC, useContext } from "react";
import {
  FormikInit,
  MainButton,
  SelectInputField,
  TextInputField,
  WrapperBox,
} from "shared-ui/src";
import * as Yup from "yup";

type Prop = {
  onSubmit: (values: any, actions: any) => void;
};

const schema = Yup.object().shape({
  label: Yup.string().required().label("Label"),
  type: Yup.string().required().label("Type"),
  dataElement: Yup.string().required().label("Data Element"),
  dataType: Yup.string().required().label("Data Type"),
});

const initialValues = {
  label: "",
  type: "",
  dataElement: "",
  dataType: "",
};

const types = [
  { name: "Text Field", value: "text" },
  { name: "Radio", value: "radio" },
  { name: "Select", value: "select" },
  { name: "Checkbox", value: "checkbox" },
];

const dataTypes = [
  { name: "Number", value: "number" },
  { name: "Text", value: "text" },
  { name: "Boolean", value: "bool" },
];

export const dataElements = [
  { name: "First Name", value: "firstName" },
  { name: "Last Name", value: "lastName" },
  { name: "Middle Name", value: "middleName" },
  { name: "Identification Number", value: "patientIdentificationNumber" },
  { name: "Gender", value: "gender" },
  { name: "Current Districts", value: "currentDiStrict" },
  { name: "Current Village", value: "currentDiStrict" },
  { name: "Closest Land mark", value: "closestLandMark" },
  { name: "Next Of Kin Name", value: "nextOfKinName" },
  { name: "Next Of Kin Relationship", value: "nextOfKinName" },
  { name: "Home District", value: "homeDistrict" },
  { name: "Home Village", value: "homeVillage" },
  { name: "Guardian Number", value: "guardianNumber" },
  { name: "Guardian Phone Number", value: "guardianPhoneNumber" },
  { name: "Current Traditional Authority", value: "currentTA" },
  { name: "Marital Status", value: "maritalStatus" },
  { name: "OccupationStatus", value: "occupationStatus" },
  { name: "Method Of Transportation", value: "methodOfTransportation" },
  { name: "Religion", value: "religion" },
  { name: "Highest Education", value: "highestEducation" },
  { name: "Health Facility", value: "healthFacility" },
  { name: "Mode Of Payment", value: "modeOfPayment" },
  { name: "Insurance Provider", value: "insuranceProvider" },
  { name: "Patient Insurance Id", value: "patientInsuranceId" },
  { name: "Insurance Schema ", value: "insuranceSchema" },
];

export const AddFormDataElement: FC<Prop> = ({ onSubmit }) => {
  const { getActiveSection } = useContext(SectionContext) as SectionContextType;

  const section = getActiveSection();
  return (
    <FormikInit
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={schema}
      submitButton={false}
    >
      <WrapperBox
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <TextInputField
          name="label"
          id="label"
          label="Label"
          width={"50%"}
          sx={{ my: 0 }}
        />
        <SelectInputField
          id="type"
          label="Form Field Input"
          selectItems={types}
          name="type"
          sx={{ my: 0 }}
        />
        <SelectInputField
          id="dataElement"
          label="Data Element"
          sx={{ my: 0 }}
          selectItems={
            section?.dataElements
              ? section.dataElements.map((d) => ({
                  name: d.label,
                  value: d.id,
                }))
              : []
          }
          name="dataElement"
        />
        <SelectInputField
          id="dataType"
          label="DataType"
          selectItems={dataTypes}
          name="dataType"
          sx={{ my: 0 }}
        />
        <MainButton
          sx={{ width: "30ch", py: "2ch" }}
          type="submit"
          onClick={() => {}}
          variant="secondary"
          title="Add Element"
        />
      </WrapperBox>
    </FormikInit>
  );
};
