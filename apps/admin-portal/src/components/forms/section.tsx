"use client";
import { FC } from "react";
import {
  FormikInit,
  TextInputField,
  WrapperBox,
  SearchComboBox,
} from "shared-ui/src";
import * as Yup from "yup";

import { useDataElements, useForm } from "@/hooks";
type Prop = {
  onSubmit: (values: any, actions?: any) => void;
  initialValues?: any;
};

const schema = Yup.object().shape({
  flowName: Yup.string().required().label("Flow Name"),
  forms: Yup.array().required().label("Forms"),
});

const initValues = {
  flowName: "",
  forms: "",
};

export const SectionForm: FC<Prop> = ({
  onSubmit,
  initialValues = initValues,
}) => {
  const { data: forms, isLoading } = useForm().getForms();

  return (
    <WrapperBox>
      <FormikInit
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={schema}
        submitButtonText="Preview"
      >
        <TextInputField name="flowName" id="flowName" label="Name" />
        <SearchComboBox
          name="forms"
          options={
            forms ? forms.map((f) => ({ id: f.id, label: f.fragmentName })) : []
          }
          label="Forms"
        />
      </FormikInit>
    </WrapperBox>
  );
};
