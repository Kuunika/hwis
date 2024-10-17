import { FormDatePicker, MainButton, SearchComboBox,  SelectInputField, WrapperBox } from "@/components";
import React, { useEffect, useState } from "react";
import medicationNames from "../../../constants/medicationnames.json"
import {
  FieldsContainer,
  FormFieldContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import * as yup from "yup";
import { concepts } from "@/constants";
import { Checkbox, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import DynamicFormList from "@/components/form/dynamicFormList";


type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };


const obstetricsFormConfig = {
age_at_menarche: {
    name: "age_at_menarche",
    label: "Age at Menarche",
  },
  last_menstral: {
    name: "last_menstral",
    label: "Last normal menstral period",
  },
  gestational_age: {
    name: "gestational_age",
    label: "Gestational age",
  },
  previous_pregnancy_outcomes:(index: number) => ( {
    name: "previous_pregnancy_outcomes",
    label: "Outcome of previous pregnancy",
  }),
  contraceptive_history: {
    name: "contraceptive_history",
    label: "Contraceptive history",
  }
}

export const ObstetricsForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});

const contraceptiveOptions = 
[
    {id: 'HIV', label:'HIV'},
    {id: 'Tuberculosis', label:'TB'},
    {id: 'Chronic Obstructive Pulmonary Disease', label:'COPD'},
    {id: 'Diabetes Mellitus', label:'Type 1/Type 2 Diabetes'},
    {id: 'Epilepsy', label:'Epilepsy'},
    {id: 'Cerebrovascular accident', label:'CVA'},
    {id: 'Asthma', label:'Asthma'},
    {id: 'Bleeding disorders', label:'Bleeding disorders'},
    {id: 'Hypertension', label:'Hypertension'},
    {id: 'Rheumatoid disorders', label:'Rheumatoid disorders'},
    {id: 'Other', label:'Other'},
  ];
  

const schema = yup.object().shape({
    [obstetricsFormConfig.previous_pregnancy_outcomes.name]: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().required(),
        })
      )
      .required("At least one allergy must be selected"),
  });

const initialValues = {
    [obstetricsFormConfig.previous_pregnancy_outcomes.name]: [],
  };

  const handleSubmit = () => {
    console.log(formValues);
    //onSubmit(formValues);
  };

return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={false}
    >
    <FormValuesListener getValues={setFormValues} />

        <SearchComboBox options={contraceptiveOptions} getValue={(value) => console.log(value)}  multiple={true} name={obstetricsFormConfig.age_at_menarche.name}label={obstetricsFormConfig.contraceptive_history.label} />

    <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
 </WrapperBox>
</FormikInit>
);

}