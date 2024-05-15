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
    name: "Left Pupil size",
    label: "Left Pupil",
  },
  rightPupilSize:{
    name: "Right Pupil size",
    label: "Right Pupil",
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
    name: "Racoon Eyes Left Eye",
    label: "Left Eye",
  },
  racoonEyesRightEye:{
    name: "Racoon Eyes Right Eye",
    label: "Right Eye",
  },
  hyphemaLeftEye:{
    name: "hyphema Left Eye",
    label: "Left Eye",
  },
  hyphemaRightEye:{
    name: "hyphema Right Eye",
    label: "Right Eye",
  },
  eyelidLeftEye:{
    name: "Eyelid Injury Left Eye",
    label: "Left Eye",
  },
  eyelidRightEye:{
    name: "Eyelid Injury Right Eye",
    label: "Right Eye",
  },
  eyesOther:{
    id:"eyesOther",
    name: "Eyes other",
    label: "Other eye issues"

  },
  fundoscopy:{
    id: "fundoscopy",
    name: "fundoscopy",
    label: "fundoscopy"
  }
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

  const [pupils, setPupilSize] = useState('');
  
  return(
    <>
    <FieldsContainer sx={{ alignItems: "start" }}>
    <RadioGroupInput
          name={form.leftPupilSize.name}
          label={form.leftPupilSize.label}
          getValue={(value: any) => setPupilSize(value)}
          options={pupilSizes}
        />
        <RadioGroupInput
          name={form.rightPupilSize.name}
          label={form.rightPupilSize.label}
          getValue={(value: any) => setPupilSize(value)}
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
}

export const HeadAndNeckForm = ({onSubmit}: Prop) => {

  const [selectedPart, setSelectedPart] = useState('');


  const handleValueChange = (value: string)=>{
    setSelectedPart(value);
  }

  const renderFormFields = () => {
    switch (selectedPart) {
      case 'Eyes':
        return (
          <EyesForm/>
        );
      case 'anotherSpecific':
        // Return another set of fields
        break;
      default:
        return null;
    }
  };

  return (

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
 
  );
};

