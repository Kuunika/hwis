"use client";
import { SectionContext, SectionContextType } from "@/contexts";
import { FC, useContext } from "react";
import { FormikInit, TextInputField, WrapperBox } from "shared-ui/src";
import * as Yup from "yup";
type Prop = {
  onSubmit: (values: any) => void;
  initialValues?: any;
};

const schema = Yup.object().shape({
  name: Yup.string().required().label("Form Name"),
});

export const AddFormName: FC<Prop> = ({ onSubmit, initialValues }) => {
  const { addFormName } = useContext(SectionContext) as SectionContextType;
  return (
    <FormikInit
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={schema}
      submitButtonText="next"
      submitButton={false}
      enableReinitialize={true}
    >
      <TextInputField
        getValue={(value) => addFormName(value)}
        width="100%"
        name="name"
        id="name"
        label="Form Name"
      />
    </FormikInit>
  );
};
