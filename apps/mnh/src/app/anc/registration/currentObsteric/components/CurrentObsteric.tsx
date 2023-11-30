import React, { useState } from 'react'
import {BasicDatePicker, FieldsContainer, FormikInit, RadioGroupInput, TextInputField } from 'shared-ui/src';
import * as yup from "yup";
import { Box } from "@mui/material";


type Props = {
  onSubmit: () => void;
  initialValues: any;
};

const form ={
    pregnancyTest: {
        name: "pregnancyTest",
        label: "Pregnancy test done?",
      },
    testResults:{
      name:"testResults",
      label:"What are the results of the pregancy test?",
    }, 
    lmpInfo: {
        name: "lmpInfo",
        label: "Last Menstrual Period (LMP) known?",
      },
    lmpDate: {
        name: "lmpDate",
        label: "Enter LMP date",
      },
    gestationalAge:{
       name:"gestationalAge",
       label:"Gestational age by abdominal palpation"
    },
    eddInfo:{
      name:"eddInfo",
      label:"Expected date of delivery (EDD) - Date"
    }
}

const schema = yup.object({
    [form.pregnancyTest.name]: yup.string().required().label(form.pregnancyTest.label),
    [form.lmpInfo.name]: yup.string().required().label(form.lmpInfo.label),
    [form.lmpDate.name]: yup.string().required().label(form.lmpDate.label),
    [form.gestationalAge.name]:yup.string().required().label(form.gestationalAge.label),
    [form.eddInfo.name]: yup.string().required().label(form.eddInfo.label),
});
const CurrentObsteric = ({ onSubmit, initialValues }: Props) => {
  const [isLmp, setLmp] = useState(false);
  const [isPositive, setPositive] = useState(false);

  const [showAdditionalRadio, setShowAdditionalRadio] = useState(false);
  const [showResults, setShowResults] = useState(false)

  const handleRadioChange = (fieldName: string, value: string) => {
    if (fieldName === form.lmpInfo.name && value === "yes") {
      setLmp(true);
      setShowAdditionalRadio(true);
    } else {
      setLmp(false);
      setShowAdditionalRadio(false);
    }
  };

  const handleRadioResults = (fieldName: string, value: string)=>{
    if (fieldName === form.testResults.name && value ===  "yes"){
      setPositive(true);
      setShowResults(true)
    }
    else {
      setPositive(false);
      setShowResults(false)
    }
  }
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <FieldsContainer>
        <RadioGroupInput
          name={form.pregnancyTest.name}
          label={form.pregnancyTest.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          getValue={(value)=> handleRadioResults(form.testResults.name,value)}
        />
        {showResults && (
          <RadioGroupInput
            name={form.testResults.name}
            label={form.testResults.label}
            options={[
              { label: "Positive", value: "positive" },
              { label: "Negative", value: "negative" },
            ]}
          />
        )}
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.lmpInfo.name}
          label={form.lmpInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          getValue={(value) => handleRadioChange(form.lmpInfo.name, value)}
        />
        {showAdditionalRadio && (
          <TextInputField
            name={form.lmpDate.name}
            label={form.lmpDate.label}
            id={form.lmpDate.name}
          />
        )}
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.gestationalAge.name}
          label={form.gestationalAge.label}
          id={form.gestationalAge.name}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.eddInfo.name}
          label={form.eddInfo.label}
          id={form.eddInfo.name}
        />
      </FieldsContainer>
    </FormikInit>
  );
};

export default CurrentObsteric
