import { FormDatePicker, MainButton, SearchComboBox, UnitInputField, WrapperBox } from "@/components";
import React, { useState } from "react";
import {
    FormValuesListener,
    FormikInit, TextInputField
} from "@/components";
import * as yup from "yup";
import { TableCell } from "@mui/material";
import DynamicFormList from "@/components/form/dynamicFormList";
import { IoTimeOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };

  const medicationFormConfig = {
   // medication_name: (index: number) => ({
   //     name: `medications[${index}].MedicationName`, 
   //     label: "Name",
   //   }),
      medication_formulation:(index: number) => ( {
        name: `medications[${index}].medication_formulation`,
        label: "Formulation",
      }),
      medication_dose: (index: number) => ({
        name: `medications[${index}].Medication_dose`,
        label: "Dose",
      }),
   //   medication_dose_unit: (index: number) => ({
   //     name: `medications[${index}].medication_dose_unit`,
   //     label: "Unit",
   //   }),
      medication_frequency: (index: number) => ({
        name: `medications[${index}].medication_frequency`,
        label: "Frequency",
      }),
      medication_route: (index: number) => ({
        name: `medications[${index}].medication_route`,
        label: 'Route'
      }),
      medication_duration: (index: number) => ({
        name: `medications[${index}].medication_duration`,
        label: 'Duration'
      }),
      medication_duration_unit:(index: number) => ({
        name: `medications[${index}].medication_duration_unit`,
        label: 'Unit'
      }),
      medication_date_last_taken:(index: number) => ({
        name: `medications[${index}].medication_date_last_taken`,
        label: 'Last Taken'
      }),
      medication_date_of_last_prescription:(index: number) => ({
        name: `medications[${index}].medication_date_of_last_prescription`,
        label: 'Last Prescribed'
      })}

 
      const durationOptions= [
        "Days",
      "Weeks",
         "Months",
        "Years",
        ]

      const medicationUnits = [
        "Milligrams (mg)" ,
       "Micrograms (µg)" ,
    "Grams (g)" ,
  "International Units (IU)",
"Milliliters (ml)" ,
"Millimoles (mmol)",	
      ];
      const routeOptions = [
        { label: "Oral", id: "Oral" },
        { label: "Suppository", id: "Suppository" },
        { label: "Intravenous", id: "Intravenous" },
        { label: "Intramuscular", id: "Intramuscular" },
        { label: "Subcutaneous", id: "Subcutaneous" },
        { label: "Infiltration", id: "Infiltration" },
        {label: "Intrathecal", id: "Intrathecal"},
        {label: "Dermal", id: "Dermal"},
        {label: "Inhaled", id: "Inhaled"},
      ];

      const formulationOptions =   [
        { id: "Tablet", label: "Tablet" },
        { id: "Vial", label: "Vial" },
        { id: "Intravenous", label: "Intravenous" },
        { id: "Powder", label: "Powder" },
        { id: "Solution", label: "Solution" },
        { id: "Eye Ointment", label: "Eye Ointment" },
        { id: "Cream", label: "Cream" },
        { id: "Eye Drops", label: "Eye Drops" },
        { id: "Ointment", label: "Ointment" },
        { id: "Inhaler", label: "Inhaler" },
        { id: "Suppository", label: "Suppository" },
        { id: "Pessary", label: "Pessary" },
        { id: "Suspension", label: "Suspension" },
        { id: "Shampoo", label: "Shampoo" },
        { id: "Ear Drops", label: "Ear Drops" },
        { id: "Eye Paste", label: "Eye Paste" },
        ];

        const frequencyOptions = [
            {id:'Once a day', label:'24 Hourly (OD) - Once a day '},
            {id:'Twice a day', label:'12 Hourly (BID) - Twice a day'},
            {id:'Three times a day', label:'8 Hourly (TID) - Three times a day'},
            {id:'Four times a day', label:'6 Hourly (QID) - Four times a day'},
            {id:'Six times a day', label:'4 Hourly (OD) - Six times a day '},
            {id:'Once a week', label:'Once a week'},
            {id:'Once a month', label:'Once a month'},
            {id:'Other', label:'Other'},
          ];

export const MedicationsForm = ({ onSubmit, onSkip }: Prop) => {
        const [formValues, setFormValues] = useState<any>({});
        const [value, setValue] = useState<number | string>("");
        const [medications, setMedications] = React.useState([
            { 
              name: "", 
              formulation: "", 
              medication_dose: 0, 
              medication_dose_unit: "", 
              medication_frequency: "", 
              medication_route: "", 
              medication_duration: 0, 
              medication_duration_unit: "", 
              medication_date_last_taken: "", 
              medication_date_of_last_prescription: "" 
            },
          ]);
        const [otherFrequency, setOtherFrequency] = useState<{ [key: number]: boolean }>({});

        const handleUpdateFrequency = (index: number, value: boolean) => {
            setOtherFrequency(prevState => ({
              ...prevState,   
              [index]: value      
            }));
          };


          const schema = yup.object().shape({
            medications: yup.array().of(
              yup.object().shape({
                name: yup.string().required('Medication name is required'),
                formulation: yup.string().required('Formulation is required'),
                medication_dose: yup.number()
                  .required('Dose is required')
                  .positive('Dose must be greater than 0'),
                medication_dose_unit: yup.string().required('Dose unit is required'),
                medication_frequency: yup.string().required('Frequency is required'),
                medication_route: yup.string().required('Route is required'),
                medication_duration: yup.number()
                  .required('Duration is required')
                  .positive('Duration must be greater than 0'),
                medication_duration_unit: yup.string().required('Duration unit is required'),
                medication_date_last_taken: yup.date()
                  .nullable()
                  .typeError('Invalid date format')
                  .required('Date of last taken is required'),
                medication_date_of_last_prescription: yup.date()
                  .nullable()
                  .typeError('Invalid date format')
                  .required('Date of last prescription is required'),
              })
            )
          });
  
    const handleAddMedication = () => {
      setMedications([...medications, { 
        name: "", 
        formulation: "", 
        medication_dose: 0, 
        medication_dose_unit: "", 
        medication_frequency: "", 
        medication_route: "", 
        medication_duration: 0, 
        medication_duration_unit: "", 
        medication_date_last_taken: "", 
        medication_date_of_last_prescription: "" 
      }]);
    };
  
    const handleRemoveMedication = (index: number) => {
      const updatedMedications = medications.filter((_, i) => i !== index);
      setMedications(updatedMedications);
    };
  
    const handleSubmit = () => {
        console.log(formValues);
        console.log(medications);
        return;
        //onSubmit(formValues);
      };

    return (
        <FormikInit
        validationSchema={schema}
        initialValues={{ medications }}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        submitButtonText="Submit"
        submitButton={false}
      >
        <FormValuesListener getValues={setFormValues} />
        <DynamicFormList
         items={medications}
         setItems={setMedications}
         newItem={{ 
            name: "", 
            formulation: "", 
            medication_dose: 0, 
            medication_dose_unit: "", 
            medication_frequency: "", 
            medication_route: "", 
            medication_duration: 0, 
            medication_duration_unit: "", 
            medication_date_last_taken: "", 
            medication_date_of_last_prescription: "" 
           }}
         renderFields={(medication, index) => (
            <>


    <SearchComboBox
      name={medicationFormConfig.medication_formulation(index).name}
      label={medicationFormConfig.medication_formulation(index).label}
      options={formulationOptions}
      getValue={(value) => console.log("Selected value:", value)}
      sx={{ width: '200px'}}
      multiple={false}
    />

<UnitInputField
  id={`medications[${index}].medication_dose`}
  label="Dose"
  name={`medications[${index}].medication_dose`}
  unitName={`medications[${index}].medication_dose_unit`}
  unitOptions={medicationUnits}
  placeholder="e.g., 500"
  sx={{ width: "320px" }}
  inputIcon={<GiMedicines />}
/>
    {!otherFrequency[index] ? (
      <SearchComboBox
        name={medicationFormConfig.medication_frequency(index).name}
        label={medicationFormConfig.medication_frequency(index).label}
        options={frequencyOptions}
        getValue={(value) => {
          if (value === 'Other') handleUpdateFrequency(index,true);
        }}
        sx={{ width: '180px'}}
        multiple={false}
      />
    ) : (
      <TextInputField
        id={medicationFormConfig.medication_frequency(index).name}
        name={medicationFormConfig.medication_frequency(index).name}
        label="Specify frequency"
        sx={{ width: '180px'}}
      />
    )}

    <SearchComboBox
      name={medicationFormConfig.medication_route(index).name}
      label={medicationFormConfig.medication_route(index).label}
      options={routeOptions}
      sx={{ width: '150px'}}
      multiple={false}
    />

<UnitInputField
        id={`medications[${index}].medication_duration`}
        name={`medications[${index}].medication_duration`}
        unitName={`medications[${index}].medication_duration_unit`}
        label="Duration"
        unitOptions={durationOptions}
        placeholder="e.g. 7"
        inputIcon={<IoTimeOutline />}
/>
    <FormDatePicker
      name={medicationFormConfig.medication_date_last_taken(index).name}
      label={medicationFormConfig.medication_date_last_taken(index).label}
      sx={{ background: 'white', width: '150px' }}
    />

    <FormDatePicker
      name={medicationFormConfig.medication_date_of_last_prescription(index).name}
      label={medicationFormConfig.medication_date_of_last_prescription(index).label}
      sx={{ background: 'white', width: '150px' }}
    />

            </>
          )}
        />
        <WrapperBox sx={{mt:'2ch'}}>
       <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
        </WrapperBox>
      </FormikInit>
    );
  }