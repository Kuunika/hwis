import { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  FormikInit,
  TextInputField,
  RadioGroupInput,
} from "shared-ui/src/form";
import { MainButton, WrapperBox } from "shared-ui/src";
import { useFormikField } from "shared-ui/src/form/hooks";

type Prop = {
  onSubmit: (values: any) => void;
};

const validationSchema = Yup.object().shape({
  label: Yup.string().required().label("Label"),
  hasWeight: Yup.string(),
  value: Yup.string().required().label("Value"),
});

export const OptionForm = ({ onSubmit }: Prop) => {
  const [hasWeight, setHasWeight] = useState("no");

  return (
    <FormikInit
      initialValues={{ label: "", value: "", hasWeight }}
      validationSchema={validationSchema}
      submitButton={false}
      onSubmit={(values, options) => {
        onSubmit(values);
        options.resetForm();
      }}
    >
      <FormObserver />
      <WrapperBox display={"flex"} flexDirection={"column"} width={"35ch"}>
        <TextInputField name="label" id="label" label="Option" />
        <RadioGroupInput
          name="hasWeight"
          label="Has Weight"
          getValue={(value: any) => setHasWeight(value)}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        {hasWeight == "yes" ? (
          <TextInputField name="value" id="label" label="Value" />
        ) : null}

        <br />
        <MainButton
          title="add option"
          variant="text"
          type="submit"
          onClick={() => {}}
          sx={{
            alignSelf: "flex-start",
          }}
        />
        <br />
      </WrapperBox>
    </FormikInit>
  );
};

const FormObserver = () => {
  const { value, setFieldValue, values } = useFormikField("hasWeight");

  useEffect(() => {
    if (value == "no") {
      //@ts-ignore
      setFieldValue("value", values["label"]);
      return;
    }
  }, [value]);
  return null;
};
