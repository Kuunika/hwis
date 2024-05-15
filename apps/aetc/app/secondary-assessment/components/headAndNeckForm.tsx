// pages/your-page-name.js

import React from 'react';
import {
  FieldsContainer,
  FormFieldContainerLayout,
  TextInputField,
  FormValuesListener,
  FormikInit,
  MainButton,
  WrapperBox,
} from 'shared-ui/src';

type Prop = {
  onSubmit: (values: any) => void;
};

const PartsList = ["Eyes", "Mouth",]

export const HeadAndNeckForm = ({onSubmit}: Prop) => {
  return (

  <FormikInit
    validationSchema={schema}
    initialValues={initialValues}
    onSubmit={onSubmit}
    submitButtonText="next"
    submitButton={true}
  >
<TextInputField />
  </FormikInit>
 
  );
};

