import { FC, useContext } from "react";
import {
  FormikInit,
  TextInputField,
  SelectInputField,
  RadioGroupInput,
} from "shared-ui/src";
import { buildYup } from "schema-to-yup";
import { FormBuilderContext, FormBuilderContextType, Frag } from "@/context";

type Prop = {
  frag: Frag;
  onSubmit: (values: any) => void;
};
export const FormFragment: FC<Prop> = ({ frag, onSubmit }) => {
  const { fragment, applyRules } = useContext(
    FormBuilderContext
  ) as FormBuilderContextType;

  const formDataElements = frag.formDataElements;

  // generate initial values
  const initialValues = formDataElements?.reduce((obj: any, fd) => {
    obj[fd.dataElement] = "";
    return obj;
  }, {});

  // generate yup schema
  const properties = formDataElements?.reduce((result: any, dl) => {
    result[dl.dataElement] = {
      description: "description",
      type: "string",
      label: dl.label,
    };
    return result;
  }, {});

  // get required fields
  const required = formDataElements?.map((fd) => {
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
        if (fd.type === "text" && fd.isVisible == "1") {
          return (
            <TextInputField
              key={fd.id}
              name={fd.dataElement}
              id={fd.dataElement}
              label={fd.label}
            />
          );
        }
        if (fd.type === "select" && fd.isVisible == "1") {
          return (
            <SelectInputField
              key={fd.id}
              name={fd.dataElement}
              id={fd.dataElement}
              getValue={(value: any) => {
                applyRules(fd.id, value);
              }}
              selectItems={
                fd.options?.map((o) => ({ name: o.label, value: o.value })) ||
                []
              }
              label={fd.label}
            />
          );
        }
        if (fd.type === "radio" && fd.isVisible == "1") {
          return (
            <RadioGroupInput
              key={fd.id}
              name={fd.dataElement}
              label={fd.label}
              options={fd.options || []}
            />
          );
        }
      })}
    </FormikInit>
  );
};
