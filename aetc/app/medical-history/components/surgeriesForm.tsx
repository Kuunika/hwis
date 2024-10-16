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
  
  type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };
  
  const surgeryFormConfig = {
    surgical_procedure_name: (index: number) => ({
        name:'surgical_procedure_name',
        label:'Procedure'
      }),
      surgical_procedure_date: (index: number) => ({
        name:'surgical_procedure_date',
        label:'Date'
      }),
    
      surgical_procedure_indication:(index: number) => ({
        name:'surgical_procedure_indication',
        label:'Indication'
      }),
      surgical_procedure_complications:(index: number) => ({
        name:'surgical_procedure_complications',
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
    const [surgeries, setSurgeries] = useState([
        { name: "", indication: "", date:"", complications: "" },
      ]);


    
  
    // const handleInputChange = (index: number, field: string, value: string) => {
    //   const updatedMedications = medications.map((medication, i) =>
    //     i === index ? { ...medication, [field]: value } : medication
    //   );
    //   setMedications(updatedMedications);
    // };
  
  
  
    const handleSubmit = () => {
      formValues["surgeries"] = surgeries
      onSubmit(formValues);
    };
  
    return (
      <FormikInit
        validationSchema={schema}
        initialValues={{ surgeries}}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        submitButtonText="Submit"
        submitButton={false}
      >
        <FormValuesListener getValues={setFormValues} />
  
        <WrapperBox>
        <DynamicFormList
        items={surgeries}
        setItems={setSurgeries}
        newItem={{ name: "", indication: "", date:"", complications: "" }}
        headings={['Name', 'Indication', 'Date','Complication']}
        renderFields={(surgery, index) => (
        <>
          <TableCell sx={{ width: '25%', textAlign: 'center' }}>
            <SearchComboBox
              name={surgeryFormConfig.surgical_procedure_name(index).name}
              label=""
              options={surgicalProcedures}
              multiple={false}
              sx={{ width: '100%' }} // Adjust width to fit the cell
            />
          </TableCell>
          <TableCell sx={{ width: '20%', textAlign: 'center' }}>
          <SearchComboBox
              name={surgeryFormConfig.surgical_procedure_indication(index).name}
              label=""
              options={[{id: 'Bowel obstruction on appendicitis', label: 'Bowel obstruction on appendicitis'},{id: 'Obstetrics to populate', label: 'Obstetrics to populate'}]}
              multiple={false}
              sx={{ width: '100%' }} // Adjust width to fit the cell
            />
          </TableCell>
          <TableCell sx={{ width: '10%', textAlign: 'center' }}>
          <FormDatePicker 
              name={surgeryFormConfig.surgical_procedure_date(index).name}  
              label=""
              sx={{ background: 'white', width: '100%' }}
            />
          </TableCell>

          <TableCell sx={{ width: '30%', textAlign: 'center' }}>
            <TextInputField
              id={surgeryFormConfig.surgical_procedure_complications(index).name}
              name={surgeryFormConfig.surgical_procedure_complications(index).name}
              label=""
              sx={{ width: '100%' }}
              multiline={true}
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