import React from 'react';
import { FormikInit, SelectInputField } from 'shared-ui/src';
import * as yup from "yup";

type Props ={
    onSubmit: () => void;
    initialValues:any;
}
const form = {
  breastExam: {
    name: "breastExam",
    label: "Breast Exam",
  },
  abnornalityInfo: {
    name: "abnornalityInfo",
    label: "Specify",
  },
};

const schema = yup.object({
    [form.breastExam.name]:yup.string().required().label(form.breastExam.label),
    [form.abnornalityInfo.name]:yup.string().required().label(form.breastExam.label)
})



const BreastExam = ({onSubmit,initialValues}:Props) => {
  return (
    <FormikInit
     validationSchema={schema}
     initialValues={initialValues}
     onSubmit={onSubmit}
     submitButtonText='next'
    >
        <SelectInputField 
           id={form.breastExam.name} 
           name={form.abnornalityInfo.name} 
           label={form.abnornalityInfo.label} 
           selectItems={[{name:"Lion", value:"lion"}]}/>
    </FormikInit>
  );
}

export default BreastExam;
