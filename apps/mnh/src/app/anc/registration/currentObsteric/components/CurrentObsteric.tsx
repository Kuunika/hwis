import React, { useState } from 'react'
import {BasicDatePicker, FieldsContainer, FormikInit, RadioGroupInput, SearchComboBox, SelectInputField, TextInputField } from 'shared-ui/src';
import * as yup from "yup";
import { Box } from "@mui/material";


type Props = {
  onSubmit: () => void;
  initialValues: any;
};

const form = {
  pregnancyTest: {
    name: "pregnancyTest",
    label: "Pregnancy test done?",
  },
  testResults: {
    name: "testResults",
    label: "What are the results of the pregancy test?",
  },
  lmpInfo: {
    name: "lmpInfo",
    label: "Last Menstrual Period (LMP) known?",
  },
  lmpDate: {
    name: "lmpDate",
    label: "",
  },
  gestationalAge: {
    name: "gestationalAge",
    label: "Gestational age by abdominal palpation(CM)",
  },
  eddInfo: {
    name: "eddInfo",
    label: "Expected date of delivery (EDD) - Date",
  },
};

const schema = yup.object({
    [form.pregnancyTest.name]: yup.string().required().label(form.pregnancyTest.label),
    [form.lmpInfo.name]: yup.string().required().label(form.lmpInfo.label),
    [form.lmpDate.name]: yup.date().required().label(form.lmpDate.label),
    [form.gestationalAge.name]:yup.string().required().label(form.gestationalAge.label),
    [form.eddInfo.name]: yup.string().required().label(form.eddInfo.label),
});
const CurrentObsteric = ({ onSubmit, initialValues }: Props) => {
  const [isLmp, setLmp] = useState(false);
  const [isPositive, setPositive] = useState(false);

  const [showAdditionalRadio, setShowAdditionalRadio] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleRadioChange = (fieldName: string, value: string) => {
    if (fieldName === form.lmpInfo.name && value === "yes" ) {
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
          getValue={(value) => handleRadioResults(form.testResults.name, value)}
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
          <>
            <TextInputField
              type="date"
              name={form.lmpDate.name}
              label={form.lmpDate.label}
              id={form.lmpDate.name}
            />
            {/* {isLmp && (
              <TextInputField
                name={form.gestationalAge.name}
                label={form.gestationalAge.label}
                id={form.gestationalAge.name}
              />
            )} */}
          </>
        )}
      </FieldsContainer>
      {isLmp && (
        <FieldsContainer>
          <SelectInputField 
          id={form.gestationalAge.name} 
          name={form.gestationalAge.name} 
          label={form.gestationalAge.label} 
          selectItems={[
            { name: "14", value: "16" }, // name is  cm
            { name: "16", value: "18" },
            { name: "18", value: "21" },
            { name: "20", value: "23" },
            { name: "22", value: "25" },
            { name: "24", value: "27" },
            { name: "26", value: "30" },
            { name: "28", value: "32" },
            { name: "30", value: "34" },
            { name: "31", value: "35" },
            { name: "31.5",value: "36" },
            { name: "32", value: "37" },
            { name: "33", value: "38" },
            { name: "34", value: "39" },
            { name: "35", value: "40" },
            { name: "36", value: "42" },
            ]} 
          />
        </FieldsContainer>
      )}
      {/* <FieldsContainer>
        <TextInputField
          name={form.gestationalAge.name}
          label={form.gestationalAge.label}
          id={form.gestationalAge.name}
        />
      </FieldsContainer> */}
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
