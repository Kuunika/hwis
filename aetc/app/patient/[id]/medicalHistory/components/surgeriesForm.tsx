import {
    FieldsContainer,
    FormDatePicker,
    FormFieldContainerLayout,
    FormikInit,
    FormValuesListener,
    MainButton,
    SearchComboBox,
    TextInputField,
    WrapperBox,
  } from "@/components";
  import { IconButton, TableCell } from "@mui/material";
  import { FaPlus, FaMinus } from "react-icons/fa6";
  import React, { useEffect, useState } from "react";
  import * as Yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { FieldArray } from "formik";
import { concepts } from "@/constants";
import { useParameters } from "@/hooks";
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

  type Surgery = {
    procedure: string;
    other: string;
    indication: string;
    date: string;
    complication: string;
  };
  
  const surgeryTemplate: Surgery = {
    procedure: "",
    other:'',
    date:"",
    complication:"",
    indication:""
  };
  
  const initialValues = {
    surgeries: [surgeryTemplate],
  };
  
  const surgeryFormConfig = {
    surgical_procedure_name: (index: number) => ({
        name:`surgeries[${index}].procedure`,
        label:'Procedure'
      }),
      surgical_procedure_other: (index: number) => ({
        name:`surgeries[${index}].other`,
        label:'Procedure'
      }),
      surgical_procedure_date: (index: number) => ({
        name:`surgeries[${index}].date`,
        label:'Date'
      }),
    
      surgical_procedure_indication:(index: number) => ({
        name:`surgeries[${index}].indication`,
        label:'Indication'
      }),
      surgical_procedure_complications:(index: number) => ({
        name:`surgeries[${index}].complication`,
        label:'Complications'
      }),
  };
  
  const schema = Yup.object().shape({
    surgeries: Yup.array().of(
      Yup.object().shape({
        surgical_procedure_name: Yup.string().required("Drug name is required"),
        surgical_procedure_date: Yup.string().required("Dose is required"),
        surgical_procedure_indication: Yup.string().required("Route is required"),
        surgical_procedure_complications: Yup.string().required("Prescriber is required"),
      })
    ),
  });

  const surgicalProcedures = [
    {id: concepts.EXPLORATORY_LAPAROTOMY, label: 'Exploratory laparotomy'},
    {id: concepts.CAESARIAN_SECTION, label: 'Caesarian section'},
    {id: concepts.INCISION_AND_DRAINAGE, label: 'Incision and drainage'},
    {id: concepts.THORACOTOMY, label: 'Thoracotomy'},
    {id: concepts.CIRCUMCISION, label: 'Circumcision'},
    {id: concepts.DEBRIDEMENT, label: 'Debridement'},
    {id: concepts.HYSTERECTOMY, label: 'Hysterectomy'},
    {id: concepts.ORIF, label: 'ORIF (Open reduction and internal fixation)'},
    {id: concepts.EXTERNAL_FIXATION, label: 'External fixation'},
    {id: concepts.THYROIDECTOMY, label: 'Thyroidectomy'},
    {id: concepts.SKIN_GRAFT, label: 'Skin graft'},
    {id: concepts.OTHER_SURGICAL_PROCEDURE, label: 'Other procedure specify'}
  ];
  
  export const SurgeriesForm = ({ onSubmit, onSkip }: Prop) => {
    const { params } = useParameters();
    const [formValues, setFormValues] = useState<any>({});
    const [showOther, setShowOther] = useState<{ [key: number]: boolean }>({});
    const { data: patientHistory, isLoading: historyLoading  } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);
    const surgicalEncounters = patientHistory?.filter(
      (item) => item.encounter_type?.name === "SURGICAL HISTORY"
    );
    const handleSubmit = () => {
        onSubmit(formValues);
    };

    useEffect(() => {
  
      if (!historyLoading) {
        const observations: ProcessedObservation[] = [];
  
      surgicalEncounters?.forEach((encounter: { obs: Observation[] }) => {
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
          })
  
          setObservations(observations)
        });}
      
    }, [patientHistory]);
  
    return (
      <>
      <div style={{background:'white', padding:'20px', borderRadius:'5px', marginBottom:'20px'}}><h3 style={{color:'rgba(0, 0, 0, 0.6)', marginBottom:'10px'}}>Exisiting history:</h3>
        <div>
            {observations.map(item => (
                <div key={item.obs_id} style={{ marginBottom: "20px", color:'rgba(0, 0, 0, 0.6)' }}>
                    {/* Display title */}
                    <h4>{item.name}</h4>
                    
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
        enableReinitialize={true}
        submitButton={false}
      >
        {({ values, setFieldValue }) => (
          <>
            <FormValuesListener getValues={setFormValues} />
            
            <WrapperBox sx={{ mb: '2ch' }}>
              <FieldArray name="surgeries">
                {({ push, remove }) => (
                  <DynamicFormList
                    items={values.surgeries}
                    setItems={(newItems) => setFieldValue("surgeries", newItems)}
                    newItem={surgeryTemplate}
                    renderFields={(item, index) => (
                      <>
                        <SearchComboBox
                          name={surgeryFormConfig.surgical_procedure_name(index).name}
                          label={surgeryFormConfig.surgical_procedure_name(index).label}
                          getValue={(value)=>{
                            if(value === concepts.OTHER_SURGICAL_PROCEDURE){
                              setShowOther((prev) => ({
                            ...prev,
                            [index]: true,
                          }));
                          }}}
                          options={surgicalProcedures}
                          multiple={false}
                          sx={{ width: '100%' }}
                        />
                        {showOther[index] &&(<TextInputField
                        id={surgeryFormConfig.surgical_procedure_other(index).name}
                        name={surgeryFormConfig.surgical_procedure_other(index).name}
                        label={surgeryFormConfig.surgical_procedure_name(index).label}
                        />)}
                        
                        <TextInputField
                          id={surgeryFormConfig.surgical_procedure_indication(index).name}
                          name={surgeryFormConfig.surgical_procedure_indication(index).name}
                          label={surgeryFormConfig.surgical_procedure_indication(index).label}
                          multiline={false}
                          sx={{ width: '100%' }}
                        />
                        <FormDatePicker 
                          name={surgeryFormConfig.surgical_procedure_date(index).name}  
                          label={surgeryFormConfig.surgical_procedure_date(index).label}  
                          sx={{ background: 'white', width: '150px' }}
                        />
                        <TextInputField
                          id={surgeryFormConfig.surgical_procedure_complications(index).name}
                          name={surgeryFormConfig.surgical_procedure_complications(index).name}
                          label={surgeryFormConfig.surgical_procedure_complications(index).label}
                          sx={{ width: '100%' }}
                          multiline={true}
                          rows={3}
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


  };