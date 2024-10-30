import React, { useState } from "react";
import { FormDatePicker, MainButton, SearchComboBox, TextInputField, WrapperBox, FormFieldContainer, FormValuesListener, FormikInit } from "@/components";
import * as yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { TableCell } from "@mui/material";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

const admissionsFormConfig = {
  has_previous_admission: {
    name: "has_previous_admission",
    label: "Previous Admission (Yes/No)",
  },
  admission_dates: (index: number) => ({
    name: `admission_date_${index}`,
    label: `Admission Date`,
  }),
  hospitals: (index: number) => ({
    name: `hospital_${index}`,
    label: `Hospital`,
  }),
  wards: (index: number) => ({
    name: `ward_${index}`,
    label: `Ward`,
  }),
  diagnoses: (index: number) => ({
    name: `diagnosis_${index}`,
    label: `Diagnosis`,
  }),
  interventions: (index: number) => ({
    name: `interventions_${index}`,
    label: `Interventions`,
  }),
  discharge_instructions:  (index: number) => ({
    name: `discharge_instructions_${index}`,
    label: `Discharge Instructions`,
  }),
  follow_up_plans:  (index: number) => ({
    name: `follow_up_plans_${index}`,
    label: `Follow-up Plans`,
  }),
};

export const AdmissionsForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [admissions, setAdmissions] = React.useState([
    { 
      date: "", 
      hospitals: "", 
      wards: "", 
      diagnoses: "", 
      interventions: "", 
      discharge_instructions: "", 
      follow_up_plan: "", 

    },
  ]);

  const hospitalOptions = [
    { id: "QECH", label: "Queen Elizabeth" }];
  const wardOptions = [
    { id: "Chatinkha", label: "Chatinkha" }];
  const diagnosisOptions = [
    { id: "TB", label: "Tuberculosis" }];

  const schema = yup.object().shape({
    // Validation schema
    [admissionsFormConfig.admission_dates(0).name]: yup.date().nullable(),
    [admissionsFormConfig.hospitals(0).name]: yup.string().nullable(),
    [admissionsFormConfig.wards(0).name]: yup.string().nullable(),
    [admissionsFormConfig.diagnoses(0).name]: yup.string().nullable(),
  });

  const initialValues = {
    has_previous_admission: false,
    admission_dates: [],
    hospitals: [],
    wards: [],
    diagnoses: [],
    interventions: "",
    discharge_instructions: "",
    follow_up_plans: "",
  };

  const handleSubmit = () => {
    console.log(formValues);
    //onSubmit(formValues);
  };

  return (
    <FormikInit validationSchema={schema} initialValues={initialValues} onSubmit={onSubmit} submitButton={false}>
      <FormValuesListener getValues={setFormValues} />
      <DynamicFormList
          items={admissions}
          setItems={setAdmissions}
          newItem={{  date: "", 
            hospitals: "", 
            wards: "", 
            diagnoses: "", 
            interventions: "", 
            discharge_instructions: "", 
            follow_up_plan: "", }}
          renderFields={(admission, index) => (
            <>
           
                <FormDatePicker
                  name={admissionsFormConfig.admission_dates(index).name}
                  label={admissionsFormConfig.admission_dates(index).label}
                  sx={{ background: "white", width: "150px" }}
                />
                <SearchComboBox
                  name={admissionsFormConfig.hospitals(index).name}
                  label={admissionsFormConfig.hospitals(index).label}
                  options={hospitalOptions}
                  multiple={false}
                  sx={{ width: "150px" }}
                />
                <SearchComboBox
                  name={admissionsFormConfig.wards(index).name}
                  label={admissionsFormConfig.wards(index).label}
                  options={wardOptions}
                  multiple={false}
                  sx={{ width: "150px" }}
                />

                <SearchComboBox
                  name={admissionsFormConfig.diagnoses(index).name}
                  label={admissionsFormConfig.diagnoses(index).label}
                  options={diagnosisOptions}
                  multiple={false}
                  sx={{ width: "150px" }}
                />
  
              <TextInputField
                    id={admissionsFormConfig.interventions(index).name}
                    name={admissionsFormConfig.interventions(index).name}
                    label={admissionsFormConfig.interventions(index).label}
                    multiline
                    rows={4}
                />

              <TextInputField
                    id={admissionsFormConfig.discharge_instructions(index).name}
                    name={admissionsFormConfig.discharge_instructions(index).name}
                    label={admissionsFormConfig.discharge_instructions(index).label}
                    multiline
                    rows={4}
                />

              <TextInputField
            id={admissionsFormConfig.follow_up_plans(index).name}
            name={admissionsFormConfig.follow_up_plans(index).name}
            label={admissionsFormConfig.follow_up_plans(index).label}
            multiline
            rows={4}
          />
            </>
          )}
        />
   
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />

    </FormikInit>
  );
};

export default AdmissionsForm;