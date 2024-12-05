import React, { useEffect, useState } from "react";
import { FormDatePicker, MainButton, SearchComboBox, TextInputField, WrapperBox, FormFieldContainer, FormValuesListener, FormikInit } from "@/components";
import * as yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { TableCell } from "@mui/material";
import { FieldArray } from "formik";
import { getConceptSetMembers } from "@/hooks/labOrder";
import { getFacilities, useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";

interface Observation {
  obs_id: number | null;
  obs_group_id: number | null;
  value: any;
  names: { name: string }[];
  children?: Observation[]; // To support nested children
}

interface ProcessedObservation {
  obs_id: number | null;
  name: string | undefined;
  value: any;
  children: ProcessedObservation[];
}

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
  const { params } = useParameters();
  const [formValues, setFormValues] = useState<any>({});
  const [diagnosisOptions, setDiagnosisOptions] = useState<{ id: string; label: string }[]>([]);
  const [hospitalOptions, setHospitalOptions] = useState<[]>();
  const { data: facilitiesData, isLoading } = getFacilities();
  const { data: patientHistory, isLoading: historyLoading  } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);
  const diagnosesConceptId = "b8e32cd6-8d80-11d8-abbb-0024217bb78e"
  const {
    data: diagnoses,
    isLoading: diagnosesLoading,
    refetch: reloadDiagnoses,
    isRefetching: reloadingDiagnoses,
  } = getConceptSetMembers(diagnosesConceptId);

  const admissionsEncounters = patientHistory?.filter(
    (item) => item.encounter_type.name === "PATIENT ADMISSIONS"
  );


  const schema = yup.object().shape({
    // Validation schema
    [admissionsFormConfig.admission_date(0).name]: yup.date().nullable(),
    [admissionsFormConfig.hospitals(0).name]: yup.string().nullable(),
    [admissionsFormConfig.wards(0).name]: yup.string().nullable(),
    [admissionsFormConfig.diagnoses(0).name]: yup.string().nullable(),
  });

  
  const handleSubmit = () => {
    onSubmit(formValues);
  };

  useEffect(() => {
    reloadDiagnoses();
    if (diagnoses) {
      const formatDiagnosisOptions = (diagnoses: any) => {
        return diagnoses.map((diagnosis: { uuid: string; names: { name: any; }[]; }) => ({
          id: diagnosis.uuid,
          label: diagnosis.names[0].name,
        }));
      };
      setDiagnosisOptions(formatDiagnosisOptions(diagnoses));
    }

    const hospitalOptions = facilitiesData.map((facility:any) => ({
      id: facility.facility_code,
      label: facility.facility_name
    }));

    setHospitalOptions(hospitalOptions)

    if (!historyLoading) {
      const observations: ProcessedObservation[] = [];

      admissionsEncounters?.forEach((encounter: { obs: Observation[] }) => {
        encounter.obs.forEach((observation) => {
          const value = observation.value;
      
          // Format the observation data
          const obsData: ProcessedObservation = {
            obs_id: observation.obs_id,
            name: observation.names?.[0]?.name,
            value,
            children: [],
          };
      
          if (observation.obs_group_id) {
            // Find the parent observation and group it
            const parent = observations.find((o) => o.obs_id === observation.obs_group_id);
            if (parent) {
              parent.children.push(obsData);
            }
          } else {
            // Add it to the top-level observations
            observations.push(obsData);
          }
        });
        

        setObservations(observations)
      });}
    
  }, [diagnoses, patientHistory]);

  return (
    <>
  <div style={{background:'white', padding:'20px', borderRadius:'5px', marginBottom:'20px'}}><h3 style={{color:'rgba(0, 0, 0, 0.6)', marginBottom:'10px'}}>Previous Admissions:</h3>
  <div>
            {observations.map(item => (
                <div key={item.obs_id} style={{ marginBottom: "20px", color:'rgba(0, 0, 0, 0.6)' }}>
                    {/* Display title */}
                    <h4>{item.value}</h4>
                    
                    {/* Display children if they exist */}
                    {item.children && item.children.length > 0 && (
                        <ul>
                            {item.children.map(child => (
                                <li key={child.obs_id}>
                                    {child.name}: {child.value}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
  </div>
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
                        sx={{ background: "white", width: "220px" }}
                      />
                      <SearchComboBox
                        name={admissionsFormConfig.hospitals(index).name}
                        label={admissionsFormConfig.hospitals(index).label}
                        options={hospitalOptions?hospitalOptions:[]}
                        multiple={false}
                        sx={{ width: "150px" }}
                      />
                      <TextInputField
                        id={admissionsFormConfig.wards(index).name}
                        name={admissionsFormConfig.wards(index).name}
                        label={admissionsFormConfig.wards(index).label}
                        multiline={false}
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
    </>
  );
}
export default AdmissionsForm;