import React from 'react'
import { FormikInit } from 'shared-ui/src';
import * as yup from "yup";
type Props = {
  onSubmit: () => void;
  initialValues: any;
};

const form = {
  vulvaInfo: {
    name: "vulvaInfo",
    label: "Check for the following",
  },
  otherInfo:{
    name:"otherInfo",
    label:"Other"
  }
};
 const schema = yup.object({
   [form.vulvaInfo.name]: yup.string().required().label(form.vulvaInfo.label),
   [form.otherInfo.name]: yup.string().required().label(form.otherInfo.label)
 });
const vulvaInspection = ({onSubmit,initialValues}:Props) => {
  return (
    <FormikInit
     validationSchema={schema}
     initialValues={initialValues}
     onSubmit={onSubmit}
     submitButtonText='next'
    >      
    </FormikInit>
  )
}

export default vulvaInspection
//searchCombo