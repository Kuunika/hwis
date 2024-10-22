import React, { useState } from "react";
import {
  FormDatePicker,
  MainButton,
  SearchComboBox,
  TextInputField,
  WrapperBox,
  FormFieldContainer,
  FormValuesListener,
  FormikInit,
} from "@/components";
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
    label: `Admission Date ${index + 1}`,
  }),
  hospitals: (index: number) => ({
    name: `hospital_${index}`,
    label: `Hospital ${index + 1}`,
  }),
  wards: (index: number) => ({
    name: `ward_${index}`,
    label: `Ward ${index + 1}`,
  }),
  diagnoses: (index: number) => ({
    name: `diagnosis_${index}`,
    label: `Diagnosis ${index + 1}`,
  }),
  interventions: (index: number) => ({
    name: `interventions_${index}`,
    label: `Interventions ${index + 1}`,
  }),
  discharge_instructions: (index: number) => ({
    name: `discharge_instructions_${index}`,
    label: `Discharge Instructions ${index + 1}`,
  }),
  follow_up_plans: (index: number) => ({
    name: `follow_up_plans_${index}`,
    label: `Follow-up Plans ${index + 1}`,
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
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={false}
    >
      <FormValuesListener getValues={setFormValues} />
      <DynamicFormList
        items={admissions}
        setItems={setAdmissions}
        newItem={{
          date: "",
          hospitals: "",
          wards: "",
          diagnoses: "",
          interventions: "",
          discharge_instructions: "",
          follow_up_plan: "",
        }}
        headings={[
          "Admission Date",
          "Hospital",
          "Ward(s)",
          "Diagnoses",
          "Interventions",
          "Discharge instructions",
          "follow up plan",
        ]}
        renderFields={(admission, index) => (
          <>
            {/* Admission Date */}
            <TableCell sx={{ width: "25%", textAlign: "center" }}>
              <FormDatePicker
                name={admissionsFormConfig.admission_dates(index).name}
                label=""
                sx={{ background: "white", width: "100%" }}
              />
            </TableCell>

            {/* Hospital */}
            <TableCell sx={{ width: "25%", textAlign: "center" }}>
              <SearchComboBox
                name={admissionsFormConfig.hospitals(index).name}
                label=""
                //@ts-ignore
                options={hospitalOptions}
                multiple={false}
                sx={{ width: "100%" }}
              />
            </TableCell>

            {/* Ward */}
            <TableCell sx={{ width: "25%", textAlign: "center" }}>
              <SearchComboBox
                name={admissionsFormConfig.wards(index).name}
                label=""
                //@ts-ignore
                options={wardOptions}
                multiple={false}
                sx={{ width: "100%" }}
              />
            </TableCell>

            {/* Diagnosis */}
            <TableCell sx={{ width: "25%", textAlign: "center" }}>
              <SearchComboBox
                name={admissionsFormConfig.diagnoses(index).name}
                label=""
                //@ts-ignore
                options={diagnosisOptions}
                multiple={false}
                sx={{ width: "100%" }}
              />
            </TableCell>
            <TableCell sx={{ width: "25%", textAlign: "center" }}>
              <TextInputField
                id={admissionsFormConfig.interventions(index).name}
                name={admissionsFormConfig.interventions(index).name}
                label={admissionsFormConfig.interventions(index).label}
                multiline
                rows={4}
              />
            </TableCell>
            <TableCell sx={{ width: "25%", textAlign: "center" }}>
              <TextInputField
                id={admissionsFormConfig.discharge_instructions(index).name}
                name={admissionsFormConfig.discharge_instructions(index).name}
                label={admissionsFormConfig.discharge_instructions(index).label}
                multiline
                rows={4}
              />
            </TableCell>
            <TableCell sx={{ width: "25%", textAlign: "center" }}>
              <TextInputField
                id={admissionsFormConfig.follow_up_plans(index).name}
                name={admissionsFormConfig.follow_up_plans(index).name}
                label={admissionsFormConfig.follow_up_plans(index).label}
                multiline
                rows={4}
              />
            </TableCell>
          </>
        )}
      />

      <MainButton
        sx={{ m: 0.5 }}
        title={"Submit"}
        type="submit"
        onClick={handleSubmit}
      />
      <MainButton
        variant={"secondary"}
        title="Skip"
        type="button"
        onClick={onSkip}
      />
    </FormikInit>
  );
};

export default AdmissionsForm;
