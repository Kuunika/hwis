import React from 'react';
import * as Yup from 'yup';
import {
  FieldsContainer,
  FormFieldContainerLayout,
  TextInputField,
  FormValuesListener,
  FormikInit,
  MainButton,
  WrapperBox,
} from 'shared-ui/src';

import { NO, YES, concepts } from "@/constants";
import { getInitialValues, notify } from "@/helpers";

type Prop = {
    onSubmit: (values: any) => void;
  };

  const form = {
    general: {
      name: "General Comments",
      label: "General comments",
    },}

const schema = Yup.object().shape({
[form.general.name]: Yup.string().required().label(form.general.label),
});

const initialValues = getInitialValues(form);

export const GeneralForm = ({onSubmit}: Prop) => {


  return (
    <FormikInit
    validationSchema={schema}
    initialValues={initialValues}
    onSubmit={onSubmit}
    submitButtonText="next"
    submitButton={true}
  >
    <FormFieldContainerLayout last={false} title="General">
 <TextInputField
                  name={form.general.name}
                  label={form.general.label}
                  id={form.general.name}
                  disabled={false}
                  multiline={true}
                />
                </FormFieldContainerLayout>
  </FormikInit>
  );
};

export default GeneralForm;
