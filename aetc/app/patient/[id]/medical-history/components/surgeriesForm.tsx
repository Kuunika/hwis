import {
    FormDatePicker,
    FormikInit,
    FormValuesListener,
    MainButton,
    SearchComboBox,
    TextInputField,
    WrapperBox,
  } from "@/components";
  import React, { use, useEffect, useState } from "react";
  import * as Yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { Field, FieldArray, getIn } from "formik";
import { concepts } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
  

interface Observation {
  obs_id: number | null;
  obs_group_id: number | null;
  value: any;
  names: { name: string }[];
  children?: Observation[]; 
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
    other: "",
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
        procedure: Yup.string().required("Surgical procedure is required"),
        other: Yup.string().when("procedure", {
          is: (procedure: string) => procedure === "other_surgical_procedure",
          then: (schema) => schema.required("Other surgical procedure is required"),
          otherwise: (schema) => schema.optional(),
        }),
        date: Yup.date()
          .required("Date of surgery is required")
          .nullable()
          .max(new Date(), "Date cannot be in the future"),
        complication: Yup.string().optional(),
        indication: Yup.string().required("Indication is required"),
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
  
  export const SurgeriesForm = ({ onSubmit, onSkip }: Prop) => {
    const { params } = useParameters();
    const [formValues, setFormValues] = useState<any>({});
    const { data: patientHistory, isLoading: historyLoading  } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);
    const [showOther, setShowOther] = useState<boolean[]>([]);
    const surgicalEncounters = patientHistory?.filter(
      (item) => item.encounter_type.name === "SURGICAL HISTORY"
    );
    const handleSubmit = async () => {
      await schema.validate(formValues);  
      onSubmit(formValues);
    };

    useEffect(() => {
  
      if (!historyLoading) {
        const observations: ProcessedObservation[] = [];
  
      surgicalEncounters?.forEach((encounter: { obs: Observation[] }) => {
          encounter.obs.forEach((observation) => {
            const value = observation.value;
        
            const obsData: ProcessedObservation = {
              obs_id: observation.obs_id,
              name: observation.names?.[0]?.name,
              value,
              children: [],
            };
        
            if (observation.obs_group_id) {
              const parent = observations.find((o) => o.obs_id === observation.obs_group_id);
              if (parent) {
                parent.children.push(obsData);
              }
            } else {
              observations.push(obsData);
            }
          })
  
          setObservations(observations)
        });}

        
      
    }, [patientHistory]);


    useEffect(() => {
      if (!formValues.surgeries) return;
    
      const updatedShowOther = formValues.surgeries.map((surgery: any) =>
        surgery.procedure === concepts.OTHER_SURGICAL_PROCEDURE
      );
    
      setShowOther(updatedShowOther);
    }, [formValues]);

    return (
      <>
      <div style={{background:'white', padding:'20px', borderRadius:'5px', marginBottom:'20px'}}><h3 style={{color:'rgba(0, 0, 0, 0.6)', marginBottom:'10px'}}>Exisiting history:</h3>
        <div>
            {observations.map(item => (
                <div key={item.obs_id} style={{ marginBottom: "20px", color:'rgba(0, 0, 0, 0.6)' }}>
                    <h4>{item.name}</h4>
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
  initialValues={initialValues}
  validationSchema={schema}
  onSubmit={onSubmit}
  enableReinitialize
  submitButton={false}
>
  {({ values, setFieldValue }) => (
    <>
      <FieldArray name="surgeries">
        {({ push, remove }) => (
          <>
          <FormValuesListener getValues={setFormValues} />
            <DynamicFormList
              items={values.surgeries}
              setItems={(newItems) => setFieldValue("surgeries", newItems)}
              newItem={surgeryTemplate} 
              renderFields={(item, index) => (
                <>
                  <SearchComboBox
                  options={surgicalProcedures}
                    name={`surgeries[${index}].procedure`}
                    label="Surgical Procedure"
                    sx={{ width: '100%' }}
                    multiple={false}
                  />
                  <div style={{ color: "red", fontSize: "0.875rem" }}>
                    <ErrorMessage name={`surgeries[${index}].procedure`} />
                  </div>
                  {showOther[index] &&<>
                      <TextInputField
                        id={`surgeries[${index}].other`}
                        name={`surgeries[${index}].other`}
                        label="Other procedure"
                        sx={{ width: '100%' }}
                      />

                      <div style={{ color: "red", fontSize: "0.875rem" }}>
                    <ErrorMessage name={`surgeries[${index}].other`} />
                  </div></>
                    }
                  <FormDatePicker
                    name={`surgeries[${index}].date`}
                    label="Date of Surgery"
                    sx={{ background: 'white', width: '150px', margin: '0px' }}
                  />
                  <div style={{ color: "red", fontSize: "0.875rem" }}>
                    <ErrorMessage name={`surgeries[${index}].date`} />
                  </div>

                  <TextInputField
                    id={`surgeries[${index}].complication`}
                    name={`surgeries[${index}].complication`}
                    label="Complications (optional)"
                    sx={{ width: '100%' }}
                  />

                  <TextInputField
                    id={`surgeries[${index}].indication`}
                    name={`surgeries[${index}].indication`}
                    label="Indication"
                    sx={{ width: '100%' }}
                  />
                  <div style={{ color: "red", fontSize: "0.875rem" }}>
                    <ErrorMessage name={`surgeries[${index}].indication`} />
                  </div>
                </>
              )}
            />

<WrapperBox sx={{mt: '2ch' }}>
    <MainButton variant="secondary" title="Previous" type="button" onClick={onSkip} sx={{ flex: 1, marginRight: '8px' }} />
    <MainButton onClick={handleSubmit} variant="primary" title="Next" type="submit" sx={{ flex: 1 }} />
  </WrapperBox>
          </>
        )}
      </FieldArray>
    </>
  )}
</FormikInit>
      </>
    );


  };