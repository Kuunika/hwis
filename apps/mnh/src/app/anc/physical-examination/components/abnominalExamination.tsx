import React from 'react'
import { FieldsContainer, FormikInit, RadioGroupInput, SelectInputField, TextInputField } from 'shared-ui/src';
import * as yup from "yup";
import { useState } from 'react';

type Props ={
    onSubmit:()=> void;
    initialValues: any
}

 const form = {
   scarInfo: {
     name: "sacrInfo",
     label: "Scar ?",
   },
   fundalHeight: {
     name: "fundalHeight",
     label: "Fundal Height",
   },
   foetalLie: {
     name: "FoetalLie",
     label: "Foetal lie",
   },
   foetalPresentation: {
     name: "foetalPresentation",
     label: "Foetal Presentation",
   },
   pregnancyTest: {
     name: "pregnancyTest",
     label: "Was Pregnancy test done?",
   },
   pregancyResult: {
     name: "pregancyResult",
     label: "Pregancy Result",
   },
   fatalHeart: {
     name: "fatalHeart",
     label: "Fatal Heart",
   },
 };

 const schema = yup.object({
    [form.scarInfo.name]:yup.string().required().label(form.scarInfo.label),
    [form.fundalHeight.name]:yup.string().required().label(form.fundalHeight.label),
    [form.foetalLie.name]:yup.string().required().label(form.foetalLie.label),
    [form.foetalPresentation.name]:yup.string().required().label(form.foetalPresentation.label),
    [form.pregnancyTest.name]: yup.string().label(form.pregnancyTest.label), //add another one
    [form.pregancyResult.name]: yup.string().label(form.pregancyResult.label),
    [form.fatalHeart.name]: yup.string().required().label(form.fatalHeart.label)
 })


const AbnominalExamination = ({onSubmit,initialValues}:Props) => {
    const [isScar,setScar] = useState(false);
    const [isFoetallLie, setFoetalLie] = useState(false);
    const [isPregnancyResult, setPregnancyResult] = useState(false);
    const [isPregnancyResult1, setPregnancyResult1] = useState(false);
    const [isFoetalPresentation, setFoetalPresantation] = useState(false)

    const [showScar, setShowScar]= useState(false);
    const [showFoetalLie, setShowFoetalLie] = useState(false);
    const [showPregnancyResult, setshowPregnancyResult] = useState(false)
    const [showPregnancyResult1, setshowPregnancyResult1] = useState(false);
    const [showFoetalPresentation, setShowFoetalPresentation] = useState(false);
    
    const handleOscarChange = (fieldName:string,value:string)=>{
        if(fieldName === form.scarInfo.name && value === "yes"){
            setScar(true);
            setShowScar(true)
        }else{
            setScar(false)
            setShowScar(false)
        }
    }

    const handlefoetalLieChange = (fieldName: string, value: string) => {
      if (
        fieldName === form.foetalLie.name  && value === "Nil palpable")
       {
        setFoetalLie(true);
        setShowFoetalLie(true);
      } else {
        setFoetalLie(false);
        setShowFoetalLie(false);
      }
    };
    const handlePregnancyResultChange =(fieldName: string, value: string)=>{
        if(fieldName === form.pregnancyTest.name  && value === "yes" ){
            setPregnancyResult(true)
            setshowPregnancyResult(true)
        }else{
            setPregnancyResult(false)
            setshowPregnancyResult(false)
        }
    }
        const handlePregnancyResultChange1 = (
          fieldName: string,
          value: string
        ) => {
          if (fieldName === form.pregnancyTest.name && value === "yes") {
            setPregnancyResult1(true);
            setshowPregnancyResult1(true);
          } else {
            setPregnancyResult1(false);
            setshowPregnancyResult1(false);
          }
        };

    const handleFoetalPresentationChange = ( fieldName: string,value: string) => {
      if (
        fieldName === form.foetalPresentation.name &&
        value === "Nil palpable"
      ) {
        setFoetalPresantation(true);
        setShowFoetalPresentation(true);
      } else {
        setFoetalPresantation(false);
        setShowFoetalPresentation(false);
      }
    };
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <FieldsContainer>
        <RadioGroupInput
          name={form.scarInfo.name}
          label={form.scarInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          getValue={(value) => handleOscarChange(form.scarInfo.name, value)}
        />
        {showScar && <>notification..Advise client to deliver at the DH.</>}
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.fundalHeight.name}
          label={form.fundalHeight.label}
          id={form.fundalHeight.name}
        />
      </FieldsContainer>

      <SelectInputField
        id={form.foetalLie.name}
        name={form.foetalLie.name}
        label={form.foetalLie.label}
        selectItems={[
          { name: "Oblique", value: "oblique" },
          { name: "Transverse", value: "transverse" },
          { name: "Longitudinal", value: "longitudinal" },
          { name: "Unstable", value: "unstablel" },
          { name: "Ball", value: "ball" },
          { name: "nilPalpable", value: "Nil palpable" },
        ]}
        getValue={(value) => handlefoetalLieChange(form.foetalLie.name, value)}
      />
      {showFoetalLie && (
        <RadioGroupInput
          name={form.pregnancyTest.name}
          label={form.pregnancyTest.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          getValue={(value) =>
            handlePregnancyResultChange1(form.pregnancyTest.name, value)
          }
        />
      )}
      {showPregnancyResult1 && (
        <RadioGroupInput
          name={form.pregnancyTest.name}
          label={form.pregnancyTest.label}
          options={[
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ]}
        />
      )}

      <SelectInputField
        id={form.foetalPresentation.name}
        name={form.foetalPresentation.name}
        label={form.foetalPresentation.label}
        selectItems={[
          { name: "Cephalic", value: "cephalic" },
          { name: "Breech", value: "breech" },
          { name: "Ball", value: "ball" },
          { name: "nilPalpable", value: "Nil palpable" },
        ]}
        getValue={(value) =>
          handleFoetalPresentationChange(form.foetalPresentation.name, value)
        }
      />
      {showFoetalPresentation && (
        <RadioGroupInput
          name={form.pregnancyTest.name}
          label={form.pregnancyTest.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          getValue={(value) =>
            handlePregnancyResultChange(form.pregnancyTest.name, value)
          }
        />
      )}
      {showPregnancyResult && (
        <RadioGroupInput
          name={form.pregnancyTest.name}
          label={form.pregnancyTest.label}
          options={[
            { label: "Positive", value: "positive" },
            { label: "Negative", value: "negative" },
          ]}
        />
      )}
      <RadioGroupInput
        name={form.fatalHeart.name}
        label={form.fatalHeart.label}
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
      />
    </FormikInit>
  );
}

export default AbnominalExamination
