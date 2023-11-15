import { FC } from "react";
import { Box } from "@mui/material";
import * as Yup from "yup";
import {
  FormikInit,
  TextInputField,
  RadioGroupInput,
  SelectInputField,
} from "shared-ui/src";
import { buildYup } from "schema-to-yup";
import testform from "@/testform";

const properties = testform.formFragments[0].dataElements.reduce(
  (result: any, dl) => {
    result[dl.dataElement.name] = { description: "description", type: dl.type };
    return result;
  },
  {}
);

const schema = {
  type: "object",
  properties,
  required: ["name", "email"],
};

const config = {
  // for error messages...
  errMessages: {
    age: {
      required: "A person must have an age",
    },
    email: {
      required: "You must enter an email address",
      format: "Not a valid email address",
    },
  },
};

const yupSchema = buildYup(schema, config);

const initialValues = {
  name: "",
  email: "",
};
type Props = {
  onSubmit: (values: any) => void;
};

export const TestForm: FC<Props> = ({ onSubmit }) => {
  const fields: FormInputType[] = [
    {
      type: "textInput",
      name: "name",
      label: "First Name",
    },
    {
      name: "email",
      type: "textInput",
      label: "Email",
    },
  ];
  return (
    <FormikInit
      validationSchema={yupSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      {fields.map(({ name, type, label }) =>
        GenerateFormInput({ name, type, label })
      )}
    </FormikInit>
  );
};

type FormInputType = {
  type: "radio" | "textInput";
  name: string;
  label: string;
};

const GenerateFormInput = ({ type, name, label }: FormInputType) => {
  if (type === "textInput") {
    return <TextInputField key={name} name={name} label={label} id={name} />;
  }
  return <></>;
};
export default yupSchema;
