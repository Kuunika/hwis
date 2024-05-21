import * as Yup from 'yup';
import {
    FormFieldContainerLayout,
    TextInputField,
    FormikInit,
    RadioGroupInput,
    SelectInputField,
    SearchComboBox,
} from 'shared-ui/src';

import { getInitialValues } from "@/helpers";
import { useState } from 'react';

type Prop = {
    onSubmit: (values: any) => void;
  };

const form = {
  respiratoryRate: {
    id: "Respiratory rate",
    name: "Respiratory rate",
    label: "Respiratory rate",
  },
  globalChestWallAbnormality:{
    id: "Global chest wall abnormality",
    name: "Global chest wall abormality",
    label: "Global chest wall abnormality"
  },
  globalChestWallAbnormalityDetails:{
    id: "Global chest wall abnormality details",
    name: "Global chest wall abormality details",
    label: "Global chest wall abnormality"
  },
  otherGlobalChestWallAbnormalityDetails:{
    id: "Other global chest wall abnormality details",
    name: "Other global chest wall abnormality details",
    label: "Other global chest wall abnormality details"
  },
  localisedChestWallAbnormality:{
    id: "Localised chest wall abnormality",
    name: "Localised chest wall abnormality",
    label: "Localised chest wall abnormality"
  },
  leftAnteriorLungAbnormality:{
    id:"left anterior lung abnormality",
    name:"left anterior lung abnormality",
    label:"left anterior lung abnormality"
  },
  leftAnteriorLungAbnormalityOther:{
    id:"Left anterior lung abnormality other",
    name:"Left anterior lung abnormality other",
    label:"Left anterior lung abnormality other"
  },
};

const schema = Yup.object().shape({
    [form.respiratoryRate.name]: Yup.string().required().label(form.respiratoryRate.label),
    [form.globalChestWallAbnormality.name]: Yup.string().required().label(form.globalChestWallAbnormality.label),
    [form.globalChestWallAbnormalityDetails.name]: Yup.string().when(form.globalChestWallAbnormality.name, {
      is: 'yes',
      then: Yup.string().required().label(form.globalChestWallAbnormalityDetails.label),
    }),
    [form.otherGlobalChestWallAbnormalityDetails.name]: Yup.string().when(form.globalChestWallAbnormalityDetails.name, {
      is: 'other',
      then: Yup.string().required().label(form.otherGlobalChestWallAbnormalityDetails.label),
    }),
    [form.localisedChestWallAbnormality.name]: Yup.string().required().label(form.localisedChestWallAbnormality.label),
    [form.leftAnteriorLungAbnormality.name]: Yup.array().required().label(form.leftAnteriorLungAbnormality.label),
    [form.leftAnteriorLungAbnormalityOther.name]: Yup.string().when(form.leftAnteriorLungAbnormality.name, {
      is: (val) => Array.isArray(val) && val.includes('other'),
      then: Yup.string().required().label(form.leftAnteriorLungAbnormalityOther.label),
    }),
  });
  

const yesOrNo = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
  ];

  const lungPartsList = [
    { name: "Left Anterior", value: "Left Anterior" },
    { name: "Left Posterior", value: "Left Posterior" },
    { name: "Left Lateral", value: "Left Lateral" },
    { name: "Right Anterior", value: "Right Anterior" },
    { name: "Right Posterior", value: "Right Posterior" },
    { name: "Right Lateral", value: "Right Lateral" },
  ]

const initialValues = getInitialValues(form);

const LungsForm = ()=>{

    const [isOtherSelected, setOtherSelected] = useState(false);

    const handleOther=(value: any)=>{
        if (!Array.isArray(value)) return;
        const v = value?.find(v => v.id == 'other' && v.label);

        if (v) {
            setOtherSelected(true);
        } else {
            setOtherSelected(false);
        }
    };

    return (
        <>
        <SearchComboBox
        getValue={handleOther}
            width="100%"
            inputSx={{ m: 0 }}
            name={form.leftAnteriorLungAbnormality.name}
            label={form.leftAnteriorLungAbnormality.name}
            multiple={true}
            size="small"
            applyPadding={true}
            options={[
                { label: "Wound", id: "wound" },
                { label: "Surgical emphysema", id: "surgical emphysema" },
                { label: "Rib deformity", id: "rib deformity" },
                { label: "Flail chest", id: "flail chest" },
                { label: "Scar", id: "scar" },
                { label: "Intercostal drain in situ", id: "intercostal drain in situ" },
                { label: "Other(Specify)", id: "other" },
              ]}
          />
        {isOtherSelected &&
            <TextInputField
            name={form.leftAnteriorLungAbnormalityOther.name}
            label={'more details'}
            id={form.leftAnteriorLungAbnormalityOther.name}
            disabled={false}
            multiline={true}
          />
        }
        </>
    )
};

export const ChestForm = ({onSubmit}: Prop) => {

    const [globalAbnormality, setGlobalAbnormality] = useState(false);
    const [otherGlobalAbnormality, setOtherGlobalAbnormality] = useState(false);
    const [localisedAbnormality, setLocalisedAbnormality] = useState(false);
    const [selectedPart, setSelectedPart] = useState('');

    const handleGlobalAbnormality =(value:String)=>{
        setGlobalAbnormality(false);
        if(value == 'yes')
        {
            setOtherGlobalAbnormality(false);
            setGlobalAbnormality(true);
        }
    };

    const handleOtherGlobalAbnormality =(value:String)=>{
        setOtherGlobalAbnormality(false);
        if(value == 'other')
        {
            setOtherGlobalAbnormality(true);
        }
    };

    const handleLocalisedAbnormality =(value:String)=>{
        setLocalisedAbnormality(false);
        if(value == 'yes')
        {
            setLocalisedAbnormality(true);
        }
    };

    const handleValueChange = (value: string)=>{
        if(value){
        setSelectedPart(value);
        console.log(selectedPart);
        }
      };

      const renderFormFields = () => {
        if(selectedPart){
        switch (selectedPart) {
          case 'Left Anterior':
            return (
              <LungsForm/>
            );
            break;
      default:
        return null;
        }
    }};


  return (
    <FormikInit
    validationSchema={schema}
    initialValues={initialValues}
    onSubmit={onSubmit}
    submitButtonText="next"
    submitButton={true}
  >
<FormFieldContainerLayout last={false} title="General">
 <TextInputField
                  name={form.respiratoryRate.name}
                  label={form.respiratoryRate.label}
                  id={form.respiratoryRate.name}
                  disabled={false}
                  multiline={false}
                  unitOfMeasure='bpm'
                />

<RadioGroupInput
        getValue={handleGlobalAbnormality}
          name={form.globalChestWallAbnormality.name}
          label={form.globalChestWallAbnormality.label}
          options={yesOrNo}
        /> 
        {globalAbnormality && 
        <>
        <RadioGroupInput
          getValue={handleOtherGlobalAbnormality}
          name={form.otherGlobalChestWallAbnormalityDetails.name}
          label={form.otherGlobalChestWallAbnormalityDetails.label}
          options={[
            { label: "Pectus excavatum", value: "pectus excavatum" },
            { label: "Pectus carinatum", value: "pectus carinatum" },
            { label: "Barrel chest", value: "barrel chest" },
            { label: "Other", value: "other" },
          ]}
        /> 
       {otherGlobalAbnormality &&
            <TextInputField
                  name={form.otherGlobalChestWallAbnormalityDetails.name}
                  label={'more details'}
                  id={form.otherGlobalChestWallAbnormalityDetails.name}
                  disabled={false}
                  multiline={true}
                />
        }
        </>
        }
         
        <RadioGroupInput
        getValue={handleLocalisedAbnormality}
          name={form.localisedChestWallAbnormality.name}
          label={form.localisedChestWallAbnormality.label}
          options={yesOrNo}
        /> 
     {localisedAbnormality &&
        <>
        <SelectInputField
        getValue={handleValueChange}
        name="options"
        label="part"
        selectItems={lungPartsList} 
        id="lungParts"/>
        {renderFormFields()}
        </>     
     }

    </FormFieldContainerLayout>
  </FormikInit>
  );
};

export default ChestForm;
