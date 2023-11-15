// "use client";
import { FC } from "react";
import { FormikInit, TextInputField, WrapperBox } from "shared-ui/src";
import * as Yup from "yup";
import { Container } from "../drag/container";
type Prop = {
  onSubmit: (values: any) => void;
  initialValues?: any;
};

const schema = Yup.object().shape({
  name: Yup.string().required().label("Form Name"),
});

export const Form: FC<Prop> = ({ onSubmit, initialValues }) => {
  return (
    <WrapperBox width={"50ch"}>
      <FormikInit
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={schema}
        submitButtonText="next"
      >
        <TextInputField name="name" id="name" label="Form Name" />
      </FormikInit>
    </WrapperBox>
  );
};
