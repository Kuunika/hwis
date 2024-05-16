'use client'

import {
  FormikInit,
  FormFieldContainerLayout,
  SelectInputField,
  RadioGroupInput,
  FieldsContainer,
  TextInputField,
} from 'shared-ui/src';
import { getInitialValues } from "@/helpers";
import * as Yup from "yup";
import { useState } from 'react';

type Prop = {
  onSubmit: (values: any) => void;
};

const form = {
  leftPupilSize: {
    name: "Left pupil size",
    label: "Left pupil",
  },
  rightPupilSize:{
    name: "Right pupil size",
    label: "Right pupil",
  },
  eyePallor:{
    name: "Pallor",
    label: "Pallor",
  },
  juandice:{
    name: "Juandice",
    label: "Juandice",
  },
  racoonEyesLeftEye:{
    name: "Racoon eyes left eye",
    label: "Left eye",
  },
  racoonEyesRightEye:{
    name: "Racoon eyes eight eye",
    label: "Right eye",
  },
  hyphemaLeftEye:{
    name: "hyphema left eye",
    label: "Left eye",
  },
  hyphemaRightEye:{
    name: "hyphema right Eye",
    label: "Right eye",
  },
  eyelidLeftEye:{
    name: "Eyelid injury left eye",
    label: "Left eye",
  },
  eyelidRightEye:{
    name: "Eyelid injury right eye",
    label: "Right eye",
  },
  eyesOther:{
    id:"eyesOther",
    name: "Eyes other",
    label: "Other eye abnormalities"

  },
  fundoscopy:{
    id: "fundoscopy",
    name: "fundoscopy",
    label: "fundoscopy"
  },
  oralThrush:{
    id: "Oral thrush",
    name: "Oral thrush",
    label: "Oral thrush"
  },
  kaposisSarcomaLesions:{
    id: "Kaposi's sarcoma lesions",
    name: "Kaposi's sarcoma lesions",
    label: "Kaposi's sarcoma lesions"
  },
  tongueLaceration:{
    id: "Tongue laceration",
    name: "Tongue laceration",
    label: "Tongue laceration"
  },
  looseTeeth:{
    id: "Loose teeth",
    name: "Loose teeth",
    label: "Loose teeth"
  },
  mouthOther:{
    id:"mouthOther",
    name: "Mouth other",
    label: "Other mouth abnormalities"

  },
};

  const schema = Yup.object().shape({
    [form.leftPupilSize.name]: Yup.string().required().label(form.leftPupilSize.label),
    [form.rightPupilSize.name]: Yup.string().required().label(form.rightPupilSize.label),
    [form.eyePallor.name]: Yup.string().required().label(form.eyePallor.label),
    [form.juandice.name]: Yup.string().required().label(form.juandice.label),
    [form.racoonEyesLeftEye.name]: Yup.string(),
    [form.racoonEyesRightEye.name]: Yup.string(),
    [form.hyphemaLeftEye.name]: Yup.string(),
    [form.hyphemaRightEye.name]: Yup.string(),
    [form.eyelidLeftEye.name]: Yup.string(),
    [form.eyelidRightEye.name]: Yup.string(),
    [form.eyesOther.name]: Yup.string(),
    [form.fundoscopy.name]: Yup.string(),
    [form.oralThrush.name]: Yup.string().required().label(form.oralThrush.label),
    [form.kaposisSarcomaLesions.name]: Yup.string().required().label(form.kaposisSarcomaLesions.label),
    [form.tongueLaceration.name]: Yup.string(),
    [form.looseTeeth.name]: Yup.string(),
    [form.mouthOther.name]: Yup.string(),
    });

const PartsList = [
  { name: "Eyes", value: "Eyes" },
  { name: "Mouth", value: "Mouth" },
  { name: "Ears", value: "Ears" },
  { name: "Nose", value: "Nose" },
  { name: "Left Temporal", value: "Left Temporal" },
  { name: "Right Temporal", value: "Right Temporal" },
  { name: "Crown", value: "Crown" },
  { name: "Occiput", value: "Occiput" },
]

const initialValues = getInitialValues(form);


const pupilSizes = [
  { label: "constricted", value: "constricted" },
  { label: "normal", value: "normal" },
  { label: "dialated", value: "dialated" },
];

const yesOrNo = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" }
];

const EyesForm = ()=>{
  
  return(
    <>
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
          name={form.leftPupilSize.name}
          label={form.leftPupilSize.label}
          options={pupilSizes}
        />
        <RadioGroupInput
          name={form.rightPupilSize.name}
          label={form.rightPupilSize.label}
          options={pupilSizes}
        />
        </FieldsContainer>
        <RadioGroupInput
          name={form.eyePallor.name}
          label={form.eyePallor.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.juandice.name}
          label={form.juandice.label}
          options={yesOrNo}
        />
        <FormFieldContainerLayout title="Racoon Eyes">
        <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.racoonEyesLeftEye.name}
          label={form.racoonEyesLeftEye.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.racoonEyesRightEye.name}
          label={form.racoonEyesRightEye.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Hyphema">
        <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.hyphemaLeftEye.name}
          label={form.hyphemaLeftEye.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.hyphemaRightEye.name}
          label={form.hyphemaRightEye.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Eyelid injury">
        <FieldsContainer sx={{ alignItems: "start" }}>
        <RadioGroupInput
          name={form.eyelidLeftEye.name}
          label={form.eyelidLeftEye.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.eyelidRightEye.name}
          label={form.eyelidRightEye.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Other">
        <TextInputField
                  name={form.eyesOther.name}
                  label={form.eyesOther.label}
                  id={form.eyesOther.name}
                  disabled={false}
                  multiline={true}
                />
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Fundoscopy">
        <TextInputField
                  name={form.fundoscopy.name}
                  label={form.fundoscopy.label}
                  id={form.fundoscopy.name}
                  disabled={false}
                  multiline={true}
                />
        </FormFieldContainerLayout>
        </>
  )
};

const MouthForm = ()=>{
  return(
    <>
    <RadioGroupInput
          name={form.oralThrush.name}
          label={form.oralThrush.label}
          options={yesOrNo}
        />
    <RadioGroupInput
          name={form.kaposisSarcomaLesions.name}
          label={form.kaposisSarcomaLesions.label}
          options={yesOrNo}
        />
    <RadioGroupInput
          name={form.tongueLaceration.name}
          label={form.tongueLaceration.label}
          options={yesOrNo}
        />
    <RadioGroupInput
          name={form.looseTeeth.name}
          label={form.looseTeeth.label}
          options={yesOrNo}
        />
    <TextInputField
                  name={form.mouthOther.name}
                  label={form.mouthOther.label}
                  id={form.eyesOther.name}
                  disabled={false}
                  multiline={true}
                />
  </>
  )
};



export const HeadAndNeckForm = ({onSubmit}: Prop) => {

  const [selectedPart, setSelectedPart] = useState('');


  const handleValueChange = (value: string)=>{
    if(value){
    setSelectedPart(value);
    console.log(selectedPart);
    }
  }

  const renderFormFields = () => {
    if(selectedPart){
    switch (selectedPart) {
      case 'Eyes':
        return (
          <EyesForm/>
        );
      case 'Mouth':
        return (
        <MouthForm/>
        );
        break;
      default:
        return null;
    }
  }
  };

  return (
    <>
  <FormikInit
    validationSchema={schema}
    initialValues={initialValues}
    onSubmit={onSubmit}
    submitButtonText="next"
    submitButton={true}
  >
  <FormFieldContainerLayout last={false} title="Parts">
  <SelectInputField
  getValue={handleValueChange}
  name="options"
  label="part"
  selectItems={PartsList} id={''}      />
          {renderFormFields()}
      </FormFieldContainerLayout>
  </FormikInit>
  
  </>
  );
};

