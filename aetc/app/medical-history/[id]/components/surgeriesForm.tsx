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
  import { useState } from "react";
  import * as Yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { FieldArray } from "formik";
  
  type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };

  type Surgery = {
    procedure: string;
    indication: string;
    date: string;
    complication: string;
  };
  
  const surgeryTemplate: Surgery = {
    procedure: "",
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
    {id: 'Exploratory laparotomy', label: 'Exploratory laparotomy'},
    {id: 'Caesarian section', label: 'Caesarian section'},
    {id: 'Incision and drainage', label: 'Incision and drainage'},
    {id: 'Thoracotomy', label: 'Thoracotomy'},
    {id: 'Circumcision', label: 'Circumcision'},
    {id: 'Debridement', label: 'Debridement'},
    {id: 'Hysterectomy', label: 'Hysterectomy'},
    {id: 'ORIF (Open reduction and internal fixation)', label: 'ORIF (Open reduction and internal fixation)'},
    {id: 'External fixation', label: 'External fixation'},
    {id: 'Thyroidectomy', label: 'Thyroidectomy'},
    {id: 'Skin graft', label: 'Skin graft'},
  ];
  
  export const SurgeriesForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});



  
  
    const handleSubmit = () => {
      console.log(formValues);
      return;
      //onSubmit(formValues);
    };
  
    return (
      <FormikInit
        validationSchema={schema}
        initialValues={initialValues} // Directly pass initialValues, not { initialValues }
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
                          options={surgicalProcedures}
                          multiple={false}
                          sx={{ width: '100%' }}
                        />
                        <SearchComboBox
                          name={surgeryFormConfig.surgical_procedure_indication(index).name}
                          label={surgeryFormConfig.surgical_procedure_indication(index).label}
                          options={[
                            { id: 'Bowel obstruction on appendicitis', label: 'Bowel obstruction on appendicitis' },
                            { id: 'Obstetrics to populate', label: 'Obstetrics to populate' },
                          ]}
                          multiple={false}
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
    );


  };