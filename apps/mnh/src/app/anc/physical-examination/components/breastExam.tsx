import React, { useState } from "react";
import { FieldsContainer, FormikInit, SelectInputField, TextInputField } from 'shared-ui/src';
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
  otherInfo:{
    name:"otherInfo",
    label:"Other (specify)"
  }
};

const schema = yup.object({
    [form.breastExam.name]:yup.string().required().label(form.breastExam.label),
    [form.abnornalityInfo.name]:yup.string().required().label(form.breastExam.label),
    [form.otherInfo.name]: yup.string().required().label(form.otherInfo.label)
})


const BreastExam = ({onSubmit,initialValues}:Props) => {
    const [isAbnoral, setAbnormal]= useState(false);

    const [showAbnormalInfo, setShowAbnormalInfo] = useState(false);

    const handleAbnormalChange =(fieldName: string, value: string)=>{
        if (fieldName === form.breastExam.name && value === "abnormal"){
         setAbnormal(true);
         setShowAbnormalInfo(true)
    }else{
        setAbnormal(false);
        setShowAbnormalInfo(false)
    }

 };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <SelectInputField
        id={form.breastExam.name}
        name={form.breastExam.name}
        label={form.breastExam.label}
        selectItems={[
          { name: "Normal", value: "normal" },
          { name: "Abnormal", value: "abnormal" },
          { name: "Not done", value: "not done" },
        ]}
        getValue={(value) => handleAbnormalChange(form.breastExam.name, value)}
      />
      {showAbnormalInfo && (
        <FieldsContainer>
          <SelectInputField
            id={form.abnornalityInfo.name}
            name={form.abnornalityInfo.name}
            label={form.abnornalityInfo.label}
            selectItems={[
              { name: "Nodule", value: "normal" },
              { name: "Discharge of pus", value: "normal" },
              { name: "Flushing", value: "normal" },
              { name: "Bleeding", value: "abnormal" },
              { name: "Increased temperature", value: "not done" },
            ]}
          />
          <TextInputField
            name={form.otherInfo.name}
            label={form.otherInfo.label}
            id={form.otherInfo.name}
          />
        </FieldsContainer>
      )}
    </FormikInit>
  );
}

export default BreastExam;
