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
  leftEarBleeding:{
    id:"Bleeding from the ear",
    name: "Bleeding from the ear",
    label: "Left ear"
  },
  rightEarBleeding:{
    id:"Bleeding from the ear",
    name: "Bleeding from the ear",
    label: "Right ear"
  },
  leftEarOtorrhoea:{
    id:"Left ear otorrhoea",
    name: "Left ear otorrhoea",
    label: "Left ear"
  },
  rightEarOtorrhoea:{
    id:"Right ear otorrhoea",
    name: "Right ear otorrhoea",
    label: "Right ear"
  },
  leftEarLaceration:{
    id:"Left ear laceration",
    name: "Left ear laceration",
    label: "Left ear"
  },
  rightEarLaceration:{
    id:"Right ear laceration",
    name: "Right ear laceration",
    label: "Right ear"
  },
  earlacerationDetails:{
    id:"Laceration details",
    name: "Laceration details",
    label: "Laceration details"
  },
  leftEarOtoscopy:{
    id:"Left ear otoscopy",
    name: "Left ear otoscopy",
    label: "Left ear"
  },
  rightEarOtoscopy:{
    id:"Right ear otoscopy",
    name: "Right ear otoscopy",
    label: "Right ear"
  },
  otoscopyDetails:{
    id:"Otoscopy details",
    name: "Otoscopy details",
    label: "Otoscopy details"
  },
  noseBleed:{
    id:"Nose bleed",
    name:"Nose bleed",
    label:"Nose bleed"
  },
  rhinorrhoea:{
    id:"Rhinorrhoea",
    name:"Rhinorrhoea",
    label:"Rhinorrhoea"
  },
  noseLaceration:{
    id:"Nose laceration",
    name: "Nose laceration",
    label: "Nose laceration"
  },
  noseLacerationDetails:{
    id:"Laceration details",
    name: "Laceration details",
    label: "Laceration details"
  },
  leftTemporalLaceration:{
    id:"Left Temporal laceration",
    name: "Left Temporallaceration",
    label: "Left Temporallaceration"
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
    [form.leftEarBleeding.name]:Yup.string().required().label(form.leftEarBleeding.label),
    [form.rightEarBleeding.name]:Yup.string().required().label(form.rightEarBleeding.label),
    [form.leftEarOtorrhoea.name]:Yup.string().required().label(form.leftEarOtorrhoea.label),
    [form.rightEarOtorrhoea.name]:Yup.string().required().label(form.rightEarOtorrhoea.label),
    [form.leftEarLaceration.name]:Yup.string().required().label(form.leftEarLaceration.label),
    [form.rightEarLaceration.name]:Yup.string().required().label(form.rightEarLaceration.label),
    [form.earlacerationDetails.name]:Yup.string().required(),
    [form.leftEarOtoscopy.name]:Yup.string().required().label(form.leftEarOtoscopy.label),
    [form.rightEarOtoscopy.name]:Yup.string().required().label(form.rightEarOtoscopy.label),
    [form.otoscopyDetails.name]:Yup.string(),
    [form.noseBleed.name]:Yup.string().required().label(form.noseBleed.label),
    [form.rhinorrhoea.name]:Yup.string().required().label(form.rhinorrhoea.label),
    [form.noseLaceration.name]:Yup.string().required().label(form.noseLaceration.label),
    [form.noseLacerationDetails.name]:Yup.string(),
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

const EarForm = ()=>{

  const [lacerated, setLacerated] = useState(false);
  const [otoscopy, setOtoscopy]= useState(false);

  const handleLaceratedEar=(value: string)=>{ 
    setLacerated(false);
    
    if(value == 'yes'){
      setLacerated(true);
    }
  };

  const handleOtoscopy=(value: string)=>{ 
    setOtoscopy(false);
    
    if(value == 'yes'){
      setOtoscopy(true);
    }
  };

  return(
    <>
    <FormFieldContainerLayout title="Bleeding from the ear">
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
          name={form.leftEarBleeding.name}
          label={form.leftEarBleeding.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.rightEarBleeding.name}
          label={form.rightEarBleeding.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
    <FormFieldContainerLayout title="Otorrhoea">
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
          name={form.leftEarOtorrhoea.name}
          label={form.leftEarOtorrhoea.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          name={form.rightEarOtorrhoea.name}
          label={form.rightEarOtorrhoea.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Laceration">
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
    getValue={handleLaceratedEar}
          name={form.leftEarLaceration.name}
          label={form.leftEarLaceration.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          getValue={handleLaceratedEar}
          name={form.rightEarLaceration.name}
          label={form.rightEarLaceration.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        {lacerated &&
        <TextInputField
                  name={form.earlacerationDetails.name}
                  label={form.earlacerationDetails.label}
                  id={form.earlacerationDetails.name}
                  disabled={false}
                  multiline={true}
                />}
        </FormFieldContainerLayout>
        <FormFieldContainerLayout title="Otoscopy">
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
    getValue={handleOtoscopy}
          name={form.leftEarOtoscopy.name}
          label={form.leftEarOtoscopy.label}
          options={yesOrNo}
        />
        <RadioGroupInput
          getValue={handleOtoscopy}
          name={form.rightEarOtoscopy.name}
          label={form.rightEarOtoscopy.label}
          options={yesOrNo}
        />
        </FieldsContainer>
        {otoscopy &&
        <TextInputField
                  name={form.otoscopyDetails.name}
                  label={form.otoscopyDetails.label}
                  id={form.otoscopyDetails.name}
                  disabled={false}
                  multiline={true}
                />}
        </FormFieldContainerLayout>
        </>
  )};

const NoseForm =()=>{
  const [lacerated, setLacerated] = useState(false);

  const handleLaceratedNose=(value: string)=>{ 
    setLacerated(false);
    
    if(value == 'yes'){
      setLacerated(true);
    }
  };
  return(
    <>
    <RadioGroupInput
          name={form.noseBleed.name}
          label={form.noseBleed.label}
          options={yesOrNo}
        />
    <RadioGroupInput
          name={form.rhinorrhoea.name}
          label={form.rhinorrhoea.label}
          options={yesOrNo}
        />
        <RadioGroupInput
        getValue={handleLaceratedNose}
          name={form.noseLaceration.name}
          label={form.noseLaceration.label}
          options={yesOrNo}
        />
        {lacerated &&
        <TextInputField
                  name={form.noseLacerationDetails.name}
                  label={form.noseLacerationDetails.label}
                  id={form.noseLacerationDetails.name}
                  disabled={false}
                  multiline={true}
                />}
        
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
      case 'Ears':
        return (
        <EarForm/>
        );
      case 'Nose':
        return (
        <NoseForm/>
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
  selectItems={PartsList} id={'selectParts'}      />
          {renderFormFields()}
      </FormFieldContainerLayout>
  </FormikInit>
  
  </>
  );
};

