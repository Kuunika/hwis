import { FormikInit } from "..";
import { buildYup } from "schema-to-yup";

interface ValidationType {
  required?: boolean;
  min?: number;
  max?: number;
}

type FormInputTypes = "text" | "select" | "search" | "multiline" | "radio";

interface Option {
  label: string;
  value: string | number;
}

export interface Field {
  name: string;
  type: string;
  label: string;
  validations: ValidationType;
  placeHolder: string;
  formInputType: FormInputTypes;
  options?: Option[];
}

const FieldToYupSchema = (fields: Field[]) => {
  const schemaObject = fields.reduce((acc: any, field) => {
    acc[field.name] = {
      ...field,
      ...field.validations,
    };
    return acc;
  }, {});

  return buildYup(schemaObject, {});
};

type Props = {
  onSubmit: (values: any) => void;
  fields: Field[];
};

export const FormBuilder = ({ onSubmit, fields }: Props) => {
  return (
    <FormikInit
      onSubmit={onSubmit}
      validationSchema={FieldToYupSchema(fields)}
      initialValues={{}}
    >
      <></>
    </FormikInit>
  );
};
