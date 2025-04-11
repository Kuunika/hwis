import React, { useEffect, useState } from "react";
import { FormDatePicker, MainButton, SearchComboBox, TextInputField, WrapperBox, FormFieldContainer, FormValuesListener, FormikInit, MainTypography } from "@/components";
import * as yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { TableCell } from "@mui/material";
import { Field, FieldArray, getIn } from "formik";
import { getConceptSetMembers } from "@/hooks/labOrder";
import { getFacilities, useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { MdOutlineClose } from "react-icons/md";
import ECTReactComponent from "@/components/form/ECTReactComponent";
import LabelledCheckbox from "@/components/form/labelledCheckBox";

interface Observation {
  obs_id: number | null;
  obs_group_id: number | null;
  value?: any;
  value_text?: any;
  names: { name: string }[];
  children?: Observation[]; // To support nested children
}

interface ProcessedObservation {
  obs_id: number | null;
  name: string | undefined;
  value?: any;
  value_text?: any;
  children: ProcessedObservation[];
}

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
  onPrevious: ()=>void;
};

type Admission = {
  date: string;
  hospital: string;
  ward: string;
  diagnosis: string;
  interventions: string;
  discharge_instructions: string;
  follow_up_plans: string;
};

const admissionTemplate: Admission = {
  date: "",
  hospital: "",
  ward: "",
  diagnosis: "",
  interventions: "",
  discharge_instructions: "",
  follow_up_plans: ""
};

const initialValues = {
  admissions: [admissionTemplate],
  none: false
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
  diagnosis: (index: number) => ({
    name: `admissions[${index}].diagnosis`,
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


  const ErrorMessage = ({ name }: { name: string }) => (
   <Field
     name={name}
     render={({ form }: { form: any }) => {
       const error = getIn(form.errors, name);
       const touch = getIn(form.touched, name);
       return touch && error ? error : null;
     }}
   />
  );

  const admissionsSchema = yup.object().shape({

    date: yup
      .date()
      .nullable()
      .required("Admission date is required")
      .typeError("Invalid date format")
      .max(new Date(), "Admission date cannot be in the future"),
    hospital: yup.string().nullable().required("Hospital name is required"),
    ward: yup.string().nullable().required("Ward is required"),
    diagnosis: yup.string().nullable().required("Diagnosis is required"),
    interventions: yup.string().nullable().required("Interventions are required"),
    discharge_instructions: yup
      .string()
      .nullable()
      .required("Discharge instructions are required"),
    follow_up_plans: yup
      .string()
      .nullable()
      .required("Follow-up plans are required"),
});

const schema = yup.object().shape({
none: yup.boolean().required(),
admissions: yup.array().when("none", {
  is: false,
  then: (schema) =>
    schema
      .of(admissionsSchema)
      .min(1, "At least one medication must be added"),
  otherwise: (schema) => schema.notRequired(),
}),
});
  
export const AdmissionsForm = ({ onSubmit, onSkip, onPrevious }: Prop) => {
  const { params } = useParameters();
  const [formValues, setFormValues] = useState<any>({});
  const [hospitalOptions, setHospitalOptions] = useState<[]>();
  const { data: facilitiesData, isLoading } = getFacilities();
  const { data: patientHistory, isLoading: historyLoading  } = getPatientsEncounters(params?.id as string);
  const [observations, setObservations] = useState<ProcessedObservation[]>([]);
  const [showAll, setShowAll] = useState(false);
  const displayedObservations = showAll ? observations : observations.slice(0, 3);

  const admissionsEncounters = patientHistory?.filter(
    (item) => item.encounter_type?.name === "PATIENT ADMISSIONS"
  );

  interface ShowSelectionState {
    [key: number]: boolean;
  }

  const [showSelection, setShowSelection] = useState<ShowSelectionState>({});

  
  
  const handleSubmit = async () => {
    if(formValues.none){
      onSkip();
      return;
    }
    onSubmit(formValues);
  };

  useEffect(() => {

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
      
          const obsData: ProcessedObservation = {
            obs_id: observation.obs_id,
            name: observation.names?.[0]?.name,
            value,
            children: observation.children
              ? observation.children.map((child) => ({
                  obs_id: child.obs_id,
                  name: child.names?.[0]?.name,
                  value_text: child.value_text,
                  children: [],
                }))
              : [],
          };
      
   
            observations.push(obsData);
      
        });
        
        observations.sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime());
        setObservations(observations)
      });}
    
  }, [patientHistory]);

  const handleICD11Selection = (selectedEntity: any, index: number) => {
    setShowSelection((prev) => ({ ...prev, [index]: true }));
    formValues.admissions[index]["diagnosis"] = `${selectedEntity.code}, ${selectedEntity.bestMatchText}`
};

  return (
    <div style={{marginLeft:"100px", marginTop:"20px", borderTop:"1px solid rgba(0, 0, 0, 0.1)", paddingTop:"20px", paddingBottom:"20px"}}>

  <div style={{background:'white', padding:'20px', borderRadius:'5px', marginBottom:'20px'}}>
    
  <MainTypography
          variant="h5"
          fontWeight={"700"}
          sx={{
            lineHeight: "24px",
            letterSpacing: "0em",
            textAlign: "left",
            marginBottom: "1ch",
          }}
        >
          Previous admissions
        </MainTypography>
<div>{displayedObservations.length === 0 ? ( <p>No admission history available</p>):(<>
            {displayedObservations.map(item => (
                <div key={item.obs_id} style={{ marginBottom: "20px", color: "rgba(0, 0, 0, 0.6)" }}>
                    <h4>{item.value}</h4>

                    {item.children && item.children.length > 0 && (
                        <ul>
                            {item.children.map(child => (
                                <li key={child.obs_id}>
                                    {child.name}: {child.value_text}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            {!showAll && observations.length > 3 && (
                <button 
                    onClick={() => setShowAll(true)} 
                    style={{ color:'rgba(0, 0, 0, 0.6)', cursor: "pointer", border: "none", background: "none", padding: 0 }}
                >
                    View More ...
                </button>
            )}
            {showAll && (                <button 
                    onClick={() => setShowAll(false)} 
                    style={{color:'rgba(0, 0, 0, 0.6)', cursor: "pointer", border: "none", background: "none", padding: 0 }}
                >
                    View Less
                </button>)}</>)}
        </div>
  </div>
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      submitButton={false}
    >
      {({ values, setFieldValue}) => (
        <>
                                <div style={{marginBottom:"2ch"}}>
                <LabelledCheckbox
                  name="none"
                  label="Patient has not been admitted"
                />
                </div>
          <FormValuesListener getValues={setFormValues} />
          
          <WrapperBox sx={{ mb: '2ch' }}>
            <FieldArray name="admissions">
              {({  }) => (
                <DynamicFormList
                  items={values.admissions}
                  setItems={(newItems) => setFieldValue("admissions", newItems)}
                  newItem={admissionTemplate}
                  renderFields={(item, index) => (
                    <>
                    <FormFieldContainer direction="row">
                      <div>
                      <FormDatePicker
                      disabled={formValues.none}
                        name={admissionsFormConfig.admission_date(index).name}
                        label={admissionsFormConfig.admission_date(index).label}
                        sx={{ background: "white", width: "220px" }}
                      />
                  <MainTypography color="red" variant="subtitle2">
                    <ErrorMessage
                      name={admissionsFormConfig.admission_date(index).name}
                    />
                  </MainTypography>
                  </div>
                  <div>
                      <SearchComboBox
                      disabled={formValues.none}
                        name={admissionsFormConfig.hospitals(index).name}
                        label={admissionsFormConfig.hospitals(index).label}
                        options={hospitalOptions?hospitalOptions:[]}
                        multiple={false}
                        sx={{ width: "320px" }}
                      />
                    <MainTypography color="red" variant="subtitle2">
                    <ErrorMessage
                      name={admissionsFormConfig.hospitals(index).name}
                    />
                  </MainTypography>
                  </div>
                  </FormFieldContainer>
                  <FormFieldContainer direction="column">
                    <div>
                      <TextInputField
                      disabled={formValues.none}
                        id={admissionsFormConfig.wards(index).name}
                        name={admissionsFormConfig.wards(index).name}
                        label={admissionsFormConfig.wards(index).label}
                        multiline={false}
                        sx={{ width: "420px", marginRight: "2ch" }}
                      />
                     <MainTypography color="red" variant="subtitle2">
                    <ErrorMessage
                      name={admissionsFormConfig.wards(index).name}
                    />
                  </MainTypography>
                  </div>
                  {showSelection[index] ? (<div style={{ backgroundColor: "white", display: 'flex', flexDirection: 'row', gap: '1rem', borderRadius:"5px", padding:"1ch", marginTop: "" }}>
                        <label style={{fontWeight: "bold" }}>
                        {formValues.admissions[index]["diagnosis"]}
                      </label>
                      <MdOutlineClose 
                            color={"red"} 
                            onClick={() => {
                              setShowSelection((prev) => ({ ...prev, [index]: false }));
                              formValues.admissions[index]["diagnosis"] ="";
                            }} 
                            style={{ cursor: "pointer" }} 
                          />
                      </div>
                        ) : (
                          <ECTReactComponent
                          onICD11Selection={(selectedEntity: any) => handleICD11Selection(selectedEntity, index)}
                          label={'Condition'}
                          iNo={100+index}
                        />
                        )}
                      <MainTypography color="red" variant="subtitle2">
                        <ErrorMessage name={admissionsFormConfig.diagnosis(index).name} />
                      </MainTypography>
                  </FormFieldContainer>
                  <FormFieldContainer direction="column">
                      <div>
                      <TextInputField
                      disabled={formValues.none}
                        id={admissionsFormConfig.interventions(index).name}
                        name={admissionsFormConfig.interventions(index).name}
                        label={admissionsFormConfig.interventions(index).label}
                        multiline
                        rows={4}
                      />
                      <MainTypography color="red" variant="subtitle2">
                    <ErrorMessage
                      name={admissionsFormConfig.interventions(index).name}
                    />
                  </MainTypography>
                  </div>
                  </FormFieldContainer>
                  <FormFieldContainer direction="row">
                    <div>
                      <TextInputField
                      disabled={formValues.none}
                        id={admissionsFormConfig.discharge_instructions(index).name}
                        name={admissionsFormConfig.discharge_instructions(index).name}
                        label={admissionsFormConfig.discharge_instructions(index).label}
                        multiline
                        rows={4}
                      />
                       <MainTypography color="red" variant="subtitle2">
                    <ErrorMessage
                      name={admissionsFormConfig.discharge_instructions(index).name}
                    />
                  </MainTypography>
                  </div>
                  </FormFieldContainer>
                  <FormFieldContainer direction="row">
                    <div>
                      <TextInputField
                      disabled={formValues.none}
                        id={admissionsFormConfig.follow_up_plans(index).name}
                        name={admissionsFormConfig.follow_up_plans(index).name}
                        label={admissionsFormConfig.follow_up_plans(index).label}
                        multiline
                        rows={4}
                      />
                       <MainTypography color="red" variant="subtitle2">
                    <ErrorMessage
                      name={admissionsFormConfig.follow_up_plans(index).name}
                    />
                  </MainTypography>
                  </div>
                    </FormFieldContainer>
                    </>
                  )}
                />
              )}
            </FieldArray>
          </WrapperBox>
  
          <MainButton variant="secondary" title="Previous" type="button" onClick={onPrevious} sx={{ flex: 1, marginRight: '8px' }} />
          <MainButton onClick={() => {}} variant="primary" title="Next" type="submit" sx={{ flex: 1 }} />
        </>
      )}
    </FormikInit>
    </div>
  );
}
export default AdmissionsForm;