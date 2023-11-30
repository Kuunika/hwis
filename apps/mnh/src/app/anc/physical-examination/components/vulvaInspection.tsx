import React from 'react'
import { FieldsContainer, FormikInit, SearchComboBox, TextInputField } from 'shared-ui/src';
import * as yup from "yup";
type Props = {
  onSubmit: () => void;
  initialValues: any;
};

const form = {
  vulvaInfo: {
    name: "vulvaInfo",
    label: "Check for the following",
  },
  otherInfo:{
    name:"otherInfo",
    label:"Other"
  }
};
 const schema = yup.object({
   [form.vulvaInfo.name]: yup.array().required().label(form.vulvaInfo.label),
   [form.otherInfo.name]: yup.string().label(form.otherInfo.label)
 });
const VulvaInspection = ({onSubmit,initialValues}:Props) => {
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="next"
    >
      <FieldsContainer>
        <SearchComboBox
          name={form.vulvaInfo.name}
          label={form.vulvaInfo.label}
          options={[
            { id: "Genital ulcers", label: "genital ulcers" },
            {
              id: "Abnormal Vaginal discharge",
              label: "abnormal Vaginal discharge",
            },
            { id: "Bruises", label: "bruises" },
            { id: "Warts", label: "warts" },
            { id: "Genital mutilation", label: "genital mutilation" },
            { id: "Oedematous", label: "oedematous" },
            { id: "None", label: "none" },
          ]}
        />
      </FieldsContainer>
      <FieldsContainer>
        <TextInputField
          name={form.otherInfo.name}
          label={form.otherInfo.label}
          id={form.otherInfo.name}
        />
      </FieldsContainer>
    </FormikInit>
  );
}

export default VulvaInspection