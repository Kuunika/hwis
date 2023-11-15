import { useConcepts } from "@/hooks/useConcepts";
import { FC } from "react";
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
  { name: "Search Select", value: "searchSelect" },
  { name: "Search Select Multiple", value: "searchSelectMultiple" },
  { name: "Checkbox", value: "checkbox" },
];

const dataTypes = [
  { name: "Number", value: "number" },
  { name: "Text", value: "text" },
  { name: "Boolean", value: "bool" },
];

export const AddFormDataElement: FC<Prop> = ({ onSubmit }) => {
  const { data: concepts } = useConcepts().getConcepts();

  const conceptsList = concepts?.map((c) => {
    return {
      id: c.uuid,
      label: c.names[0].name,
    };
  });

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
          sx={{ mr: "1ch" }}
        />
        <SearchComboBox
          name="dataElement"
          multiple={false}
          sx={{ mr: "1ch" }}
          options={conceptsList ? conceptsList : []}
          label="Concept"
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
