import React,{useState} from 'react';
import { FieldsContainer, FormikInit, RadioGroupInput, TextInputField } from 'shared-ui/src';
import * as yup from "yup";
// import Alert from '@material-ui/lab/Alert';

type Props ={
    onSubmit: () => void;
    initialValues:any;
}
const form = {
  pallorInfo: {
    name: "pallorInfo",
    label: "Pallor present?",
  },
  oedemaPresent: {
    name: "oedemaPresent",
    label: "Oedema present?",
  },
  severityInfo: {
    name: "severityInfo",
    label: "Select severity",
  },
  coughInfo: {
    name: "coughInfo",
    label: "Does the woman have a cough?",
  },
  coughDuration: {
    name: "coughDuration",
    label: "Duration of cough",
  },
  weightInfo: {
    name: "weightInfo",
    label: "Weight loss?",
  },
  feverInfo: {
    name: "feverInfo",
    label: "Fever?",
  },
  nightSweatsInfo: {
    name: "nightSweatsInfo",
    label: "Night sweats",
  },
  respiratoryRateInfo: {
    name: "respiratoryRateInfo",
    label: "Enter respiratory rate",
  },
};

const schema = yup.object({
    [form.pallorInfo.name]: yup.string().required().label(form.pallorInfo.label),
    [form.oedemaPresent.name]: yup.string().required().label(form.oedemaPresent.label),
    [form.severityInfo.name]: yup.string().required().label(form.severityInfo.label),
    [form.coughInfo.name]: yup.string().required().label(form.coughInfo.label),
    [form.coughDuration.name]: yup.string().required().label(form.coughDuration.label),
    [form.weightInfo.name]: yup.string().required().label(form.weightInfo.label),
    [form.feverInfo.name]: yup.string().required().label(form.feverInfo.label),
    [form.nightSweatsInfo.name]: yup.string().required().label(form.nightSweatsInfo.label),
});


const AncMatrix = ({onSubmit,initialValues}:Props) => {
    const [isOedema, setOedema] = useState(false);
    const [isCough, setCough]= useState(false);
    // const [showSnackbar, setShowSnackbar] = useState(false);

    const [showOedema, setShowOedema] = useState(false);
    const [showCough, setShowCough] = useState(false)

    const handleOedemaChange = (fieldName:string, value: string)=>{
        if(fieldName === form.oedemaPresent.name && value === "yes"){
            setOedema(true);
            setShowOedema(true);
        }else{
            setOedema(false);
            setShowOedema(false);
        }
    }

    const handleCoughChange = (fieldName:string, value: string)=>{
        if(fieldName === form.coughInfo.name && value === "yes"){
            setCough(true);
            setShowCough(true)
        }else{
            setCough(false);
            setShowCough(false)
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
          name={form.pallorInfo.name}
          label={form.pallorInfo.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <RadioGroupInput
          name={form.oedemaPresent.name}
          label={form.oedemaPresent.label}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          getValue={(value) =>
            handleOedemaChange(form.oedemaPresent.name, value)
          }
        />
        {showOedema && (
          <RadioGroupInput
            name={form.severityInfo.name}
            label={form.severityInfo.label}
            options={[
              { label: "+", value: "+" },
              { label: "++", value: "++" },
              { label: "+++", value: "+++" },
            ]}
          />
        )}
      </FieldsContainer>
      {/* <FieldsContainer> */}
      <RadioGroupInput
        name={form.coughInfo.name}
        label={form.coughInfo.label}
        options={[
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]}
        getValue={(value) => handleCoughChange(form.coughInfo.name, value)}
      />
      {showCough && (
        <>
          <TextInputField
            name={form.coughDuration.name}
            label={form.coughDuration.label}
            id={form.coughDuration.name}
          />
          <RadioGroupInput
            name={form.weightInfo.name}
            label={form.weightInfo.label}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
          <RadioGroupInput
            name={form.feverInfo.name}
            label={form.feverInfo.label}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
          <RadioGroupInput
            name={form.nightSweatsInfo.name}
            label={form.nightSweatsInfo.label}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </>
      )}
        {/* {isOedema || isCough ? (
            <Alert severity="info" onClose={() => setShowSnackbar(false)}>
            Snackbar message goes here
            </Alert>
        ) : null} */}

      {/* </FieldsContainer> */}
      <TextInputField
        name={form.respiratoryRateInfo.name}
        label={form.respiratoryRateInfo.label}
        id={form.respiratoryRateInfo.name}
      />
    </FormikInit>
  );
}

export default AncMatrix;


