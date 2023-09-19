import { FC } from "react";
import {
  FormikInit,
  TextInputField,
  SelectInputField,
  RadioGroupInput,
} from "shared-ui/src";
import FORM_DATA from "../../test";
import { buildYup } from "schema-to-yup";

type Validation = {
  rule: string;
  value: string;
};

type FormDataElement = {
  label: string;
  type: string;
  dataElement: string;
  rules: Array<Validation>;
  id: string;
  validations: Array<any>;
  isVisible: string;
  optionSetId?: string;
};

type Frag = {
  fragmentName: string;
  formDataElements: FormDataElement[];
};

type Prop = {
  frag: Frag;
  onSubmit: (values: any) => void;
};
export const FormFragment: FC<Prop> = ({ frag, onSubmit }) => {
  const formDataElements = frag.formDataElements;

  // generate initial values
  const initialValues = formDataElements.reduce((obj: any, fd) => {
    obj[fd.dataElement] = "";
    return obj;
  }, {});

  // generate yup schema
  const properties = formDataElements.reduce((result: any, dl) => {
    result[dl.dataElement] = {
      description: "description",
      type: "string",
      label: dl.label,
    };
    return result;
  }, {});

  // get required fields
  const required = formDataElements.map((fd) => {
    const isRequired = fd.validations.find(
      (rule) => rule.rule == "isRequired" && rule.value == "1"
    );

    if (isRequired) {
      return fd.dataElement;
    }
    return;
  });

  const schema = {
    type: "object",
    properties,
    required,
  };

  const validationSchema = buildYup(schema, {});

  return (
    <FormikInit
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {formDataElements.map((fd) => {
        if (fd.type === "text") {
          return (
            <TextInputField
              key={fd.id}
              name={fd.dataElement}
              id={fd.dataElement}
              label={fd.label}
            />
          );
        }
        if (fd.type === "select") {
          return (
            <SelectInputField
              key={fd.id}
              name={fd.dataElement}
              id={fd.dataElement}
              selectItems={[{ name: "test", value: "test" }]}
              label={fd.label}
            />
          );
        }

        if (fd.type === "radio") {
          return (
            <RadioGroupInput
              key={fd.id}
              name={fd.dataElement}
              label={fd.label}
              options={[
                { label: "Test", value: "test" },
                { label: "Test2", value: "test2" },
              ]}
            />
          );
        }
      })}
    </FormikInit>
  );
};
