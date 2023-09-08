import { FC } from "react";
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
  { name: "Text Field Input", value: "text" },
  { name: "Radio Input", value: "radio" },
  { name: "Select Input", value: "radio" },
  { name: "Checkbox Input", value: "radio" },
];

const dataTypes = [
  { name: "Number", value: "number" },
  { name: "Text", value: "text" },
  { name: "Boolean", value: "bool" },
];

export const AddFormDataElement: FC<Prop> = ({ onSubmit }) => {
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
        <TextInputField name="label" id="label" label="Label" width={"50%"} />
        <SelectInputField
          id="type"
          label="Type"
          selectItems={types}
          name="type"
        />
        <SelectInputField
          id="dataElement"
          label="DataElement"
          selectItems={dataTypes}
          name="dataElement"
        />
        <SelectInputField
          id="dataType"
          label="DataType"
          selectItems={dataTypes}
          name="dataType"
        />
        <MainButton
          sx={{ width: "30ch", py: "2ch" }}
          type="submit"
          onClick={() => {}}
          title="Add Element"
        />
      </WrapperBox>
    </FormikInit>
  );
};
