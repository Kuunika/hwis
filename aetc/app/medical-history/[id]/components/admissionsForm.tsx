import React, { useEffect, useState } from "react";
import { FormDatePicker, MainButton, SearchComboBox, TextInputField, WrapperBox, FormFieldContainer, FormValuesListener, FormikInit } from "@/components";
import * as yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { TableCell } from "@mui/material";
import { FieldArray } from "formik";
import { getConceptSetMembers } from "@/hooks/labOrder";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

type Admission = {
  date: string;
  hospital: string;
  ward: string;
  diagnoses: string;
  interventions: string;
  discharge_instructions: string;
  follow_up_plans: string;
};

const admissionTemplate: Admission = {
  date: "",
  hospital: "",
  ward: "",
  diagnoses: "",
  interventions: "",
  discharge_instructions: "",
  follow_up_plans: ""
};

const initialValues = {
  admissions: [admissionTemplate],
};

const admissionsFormConfig = {
  admission_date: (index: number) => ({
    name: `admissions[${index}].date`,
    label: `Admission Date`,
  }),
  hospitals: (index: number) => ({
    name: `admissions[${index}].hospital`,
    label: `Hospital`,
  }),
  wards: (index: number) => ({
    name: `admissions[${index}].ward`,
    label: `Ward`,
  }),
  diagnoses: (index: number) => ({
    name: `admissions[${index}].diagnoses`,
    label: `Diagnosis`,
  }),
  interventions: (index: number) => ({
    name: `admissions[${index}].interventions`,
    label: `Interventions`,
  }),
  discharge_instructions: (index: number) => ({
    name: `admissions[${index}].discharge_instructions`,
    label: `Discharge Instructions`,
  }),
  follow_up_plans: (index: number) => ({
    name: `admissions[${index}].follow_up_plans`,
    label: `Follow-up Plans`,
  }),
};

export const AdmissionsForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [diagnosisOptions, setDiagnosisOptions] = useState<{ id: string; label: string }[]>([]);
  const diagnosesConceptId = "b8e32cd6-8d80-11d8-abbb-0024217bb78e"
  const {
    data: diagnoses,
    isLoading: diagnosesLoading,
    refetch: reloadDiagnoses,
    isRefetching: reloadingDiagnoses,
  } = getConceptSetMembers(diagnosesConceptId);


  const hospitalOptions = [
    { id: "QECH", label: "Queen Elizabeth" }];
  const wardOptions = [
    { id: "Chatinkha", label: "Chatinkha" }];


  const schema = yup.object().shape({
    // Validation schema
    [admissionsFormConfig.admission_date(0).name]: yup.date().nullable(),
    [admissionsFormConfig.hospitals(0).name]: yup.string().nullable(),
    [admissionsFormConfig.wards(0).name]: yup.string().nullable(),
    [admissionsFormConfig.diagnoses(0).name]: yup.string().nullable(),
  });

  
  const handleSubmit = () => {
    console.log(formValues);
    return;
    //onSubmit(formValues);
  };

  useEffect(() => {
    reloadDiagnoses();
    if (diagnoses) {
      const formatDiagnosisOptions = (diagnoses: any) => {
        return diagnoses.map((diagnosis: { uuid: { uuid: string}; names: { name: any; }[]; }) => ({
          id: diagnosis.uuid.toString(),
          label: diagnosis.names[0].name,
        }));
      };
      setDiagnosisOptions(formatDiagnosisOptions(diagnoses));
    }
  }, [diagnoses]);

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      submitButton={false}
    >
      {({ values, setFieldValue}) => (
        <>
          <FormValuesListener getValues={setFormValues} />
          
          <WrapperBox sx={{ mb: '2ch' }}>
            <FieldArray name="admissions">
              {({ push, remove }) => (
                <DynamicFormList
                  items={values.admissions}
                  setItems={(newItems) => setFieldValue("admissions", newItems)}
                  newItem={admissionTemplate}
                  renderFields={(item, index) => (
                    <>
                      <FormDatePicker
                        name={admissionsFormConfig.admission_date(index).name}
                        label={admissionsFormConfig.admission_date(index).label}
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
              )}
            </FieldArray>
          </WrapperBox>
  
          <MainButton sx={{ m: 0.5 }} title="Submit" type="submit" onClick={handleSubmit} />
          <MainButton variant="secondary" title="Skip" type="button" onClick={onSkip} />
        </>
      )}
    </FormikInit>
  );
}
export default AdmissionsForm;