import { SectionContext, SectionContextType } from "@/contexts";
import { useDataElements } from "@/hooks";
import { FC, useContext } from "react";
import {
  FormikInit,
  MainButton,
  SelectInputField,
  TextInputField,
  WrapperBox,
  SearchComboBox,
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

export const AddFormDataElement: FC<Prop> = ({ onSubmit }) => {
  const { data: dataElements } = useDataElements().getDataElements();
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
          width={"100%"}
          sx={{ my: 0 }}
          showHelperText={false}
        />
        <SelectInputField
          id="type"
          label="Field Input"
          selectItems={types}
          name="type"
          width="100%"
          sx={{ my: 0 }}
        />
        <SearchComboBox
          name="dataElement"
          multiple={false}
          sx={{ mr: "1ch" }}
          options={
            dataElements
              ? dataElements.map((d) => ({ id: d.id, label: d.label }))
              : []
          }
          label="Data Element"
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
          title="Add"
        />
      </WrapperBox>
    </FormikInit>
  );
};
