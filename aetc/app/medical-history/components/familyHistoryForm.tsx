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
import LabelledCheckbox from "@/components/form/labelledCheckBox";


type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };


const familyHistoryFormConfig = {
asthma: {
    name: "asthma",
    label: "Asthma",
  },
  hypertension: {
    name: "hypertension",
    label: "Hypertension",
  },
  diabetes_mellitus: {
    name: "diabetes_mellitus",
    label: "Diabetes mellitus",
  },
  epilepsy: {
    name: "epilepsy",
    label: "Epilepsy",
  },
  cancer: {
    name: "cancer",
    label: "Cancer",
  },
  tuberculosis: {
    name: "tuberculosis",
    label: "Tuberculosis",
  },
}

export const FamilyHistoryForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});


  

const schema = yup.object();

const initialValues = {
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
    <FormFieldContainer direction="row" >
        <WrapperBox sx={{bgcolor:'white', padding:'2ch'}}>
    <LabelledCheckbox
              label={familyHistoryFormConfig.asthma.label}
              checked={false}
                onChange={(e) => console.log(e)}
            />
            <LabelledCheckbox
              label={familyHistoryFormConfig.hypertension.label}
              checked={false}
                onChange={(e) => console.log(e)}
            />
            <LabelledCheckbox
              label={familyHistoryFormConfig.diabetes_mellitus.label}
              checked={false}
                onChange={(e) => console.log(e)}
            />
            <LabelledCheckbox
              label={familyHistoryFormConfig.epilepsy.label}
              checked={false}
                onChange={(e) => console.log(e)}
            />
            <LabelledCheckbox
              label={familyHistoryFormConfig.cancer.label}
              checked={false}
                onChange={(e) => console.log(e)}
            />
            <LabelledCheckbox
              label={familyHistoryFormConfig.tuberculosis.label}
              checked={false}
                onChange={(e) => console.log(e)}
            />
            </WrapperBox>
    </FormFieldContainer>
        
    <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
 </WrapperBox>
</FormikInit>
);

}