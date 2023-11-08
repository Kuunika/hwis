import { FC, useContext, useEffect } from "react";
import { useFormikContext } from "formik";
import { SxProps } from "@mui/material";
import {
  FormikInit,
  TextInputField,
  SelectInputField,
  RadioGroupInput,
  WrapperBox,
  MainTypography,
} from "shared-ui/src";
import { buildYup } from "schema-to-yup";
import { Frag, FormBuilderContext, FormBuilderContextType } from "@/contexts";

type Prop = {
  frag: Frag;
  onSubmit: (values: any) => void;
  sx?: SxProps;
};
export const ViewFormFragment: FC<Prop> = ({ frag, onSubmit, sx }) => {
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
    <WrapperBox sx={sx}>
      <MainTypography variant="h4" textTransform={"capitalize"}>
        {frag.fragmentName} Form
      </MainTypography>
      <br />
      <FormikInit
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <WrapperBox width={"100%"} display={"flex"} flexDirection={"column"}>
          {formDataElements.map((fd) => {
            if (fd.type === "text" && fd.isVisible == "1") {
              return (
                <TextInputField
                  key={fd.id}
                  name={fd.dataElement}
                  id={fd.dataElement}
                  label={fd.label}
                  width={"25ch"}
                />
              );
            }
            if (fd.type === "select" && fd.isVisible == "1") {
              return (
                <SelectInputField
                  key={fd.id}
                  name={fd.dataElement}
                  id={fd.dataElement}
                  selectItems={
                    fd.optionSet.options?.map((o) => ({
                      name: o.label,
                      value: o.value,
                    })) || []
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
                  options={fd?.optionSet?.options || []}
                />
              );
            }
          })}
          <ListenFormValueChanges />
        </WrapperBox>
      </FormikInit>
    </WrapperBox>
  );
};

const ListenFormValueChanges = () => {
  const { setFormValues } = useContext(
    FormBuilderContext
  ) as FormBuilderContextType;
  const { values } = useFormikContext();

  useEffect(() => {
    setFormValues(values);
  }, [values]);

  return <></>;
};
