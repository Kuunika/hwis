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
  SearchComboBox,
} from "shared-ui/src";
import { buildYup } from "schema-to-yup";
import {
  Frag,
  FormBuilderContext,
  FormBuilderContextType,
  FormDataElement,
} from "@/contexts";
import { DataElement, Form } from "@/services";

type Prop = {
  frag: Form;
  onSubmit: (values: any) => void;
  sx?: SxProps;
};
export const ViewFormFragment: FC<Prop> = ({ frag, onSubmit, sx }) => {
  const formDataElements = frag.formInputs;

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

  const getConceptSets = (dataElement: FormDataElement) => {
    return dataElement.setMembers?.map((dE) => ({
      label: dE.names[0].name,
      value: dE.uuid,
    }));
  };

  return (
    <WrapperBox sx={sx}>
      <MainTypography variant="h4" textTransform={"capitalize"}>
        {frag.formName} Form
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
                    getConceptSets(fd)?.map((c) => ({
                      name: c.label,
                      value: c.value,
                    })) || []
                  }
                  label={fd.label}
                />
              );
            }

            if (fd.type === "searchSelect" && fd.isVisible == "1") {
              return (
                <SearchComboBox
                  key={fd.id}
                  multiple={false}
                  name={fd.dataElement}
                  sx={{ my: "1ch" }}
                  options={
                    getConceptSets(fd)?.map((c) => ({
                      label: c.label,
                      id: c.value,
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
                  options={getConceptSets(fd) || []}
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
