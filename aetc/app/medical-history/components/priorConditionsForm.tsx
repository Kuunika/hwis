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
  import { Checkbox, IconButton, TableCell } from "@mui/material";
  import { FaPlus, FaMinus } from "react-icons/fa6";
  import { useState } from "react";
  import * as Yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { FaExternalLinkAlt } from "react-icons/fa";
  
  type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };
  
  const priorConditionsFormConfig = {
    conditions_name: (index: number) => ({
        name:'condition',
        label:'Condition'
      }),
      conditions_diagnosis_date: (index: number) => ({
        name:'conditions_diagnosis_date',
        label:'Date of diagnosis'
      }),
    
      conditions_additional_details:(index: number) => ({
        name:'conditions_additional_details',
        label:'Additional details'
      }),
      conditions_on_treatment:(index: number) => ({
        name:'conditions_on_treatment',
        label:'On treatment?'
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
  

  const commonConditions=[
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
  
  
  export const PriorConditionsForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [conditions, setConditions] = useState([
        { name: "", date_of_diagnosis: "", on_treatment:"No", additional_notes: "" },
      ]);


    
  
    // const handleInputChange = (index: number, field: string, value: string) => {
    //   const updatedMedications = medications.map((medication, i) =>
    //     i === index ? { ...medication, [field]: value } : medication
    //   );
    //   setMedications(updatedMedications);
    // };
  
  
  
    const handleSubmit = () => {
      formValues["conditions"] = conditions
      onSubmit(formValues);
    };
  
    return (
      <FormikInit
        validationSchema={schema}
        initialValues={{ conditions}}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        submitButtonText="Submit"
        submitButton={false}
      >
        <FormValuesListener getValues={setFormValues} />
  
        <WrapperBox sx={{mb:'2ch'}} >
          <a href="https://icd.who.int/browse/2024-01/mms/en" style={{color:'primary',textDecorationLine:'underline', paddingRight:'1ch', fontSize:'small'}}>ICD11 List of diagnoses <FaExternalLinkAlt /></a>
        <DynamicFormList
        items={conditions}
        setItems={setConditions}
        newItem={{ name: "", date_of_diagnosis: "", on_treatment:"No", additional_notes: "" }}
        headings={['Condition', 'Date of diagnosis', 'On treatment?','Additional Details']}
        renderFields={(surgery, index) => (
        <>
         <TableCell sx={{ width: '25%', textAlign: 'center' }}>
            <SearchComboBox
              name={priorConditionsFormConfig.conditions_name(index).name}
              label=""
              options={commonConditions}
              multiple={false}
              sx={{ width: '100%' }} // Adjust width to fit the cell
            />
          </TableCell>

          {/* Diagnosis Date */}
          <TableCell sx={{ width: '20%', textAlign: 'center' }}>
            <FormDatePicker 
              name={priorConditionsFormConfig.conditions_diagnosis_date(index).name}  
              label=""
              sx={{ background: 'white', width: '150px' }}
            />
          </TableCell>

          {/* On Treatment */}
          <TableCell sx={{ width: '10%', textAlign: 'center' }}>
            <Checkbox
              name={priorConditionsFormConfig.conditions_on_treatment(index).name}
              sx={{ margin: '0 auto' }} // Center the checkbox
            />
          </TableCell>

          {/* Additional Details */}
          <TableCell sx={{ width: '30%', textAlign: 'center' }}>
            <TextInputField
              id={priorConditionsFormConfig.conditions_additional_details(index).name}
              name={priorConditionsFormConfig.conditions_additional_details(index).name}
              label=""
              sx={{ width: '100%' }}
              multiline={true}
              rows={3}
            />
          </TableCell>
        </>)}
        />
        </WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
      </FormikInit>
    );
  };