import { FormDatePicker, MainButton, SearchComboBox,  SelectInputField, WrapperBox } from "@/components";
import React, { useEffect, useState } from "react";
import medicationNames from "../../../constants/medicationnames.json"
import {
  FieldsContainer,
  FormFieldContainer,
  FormFieldContainerLayout,
  FormValuesListener,
  FormikInit,
  MainTypography,
  RadioGroupInput,
  TextInputField,
} from "@/components";
import * as yup from "yup";
import { concepts } from "@/constants";
import { Box, Checkbox, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import DynamicFormList from "@/components/form/dynamicFormList";

type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };

  const medicationFormConfig = {
    medication_name: (index: number) => ({
        name: 'Medication',
        label: "Name",
      }),
      medication_formulation:(index: number) => ( {
        name: 'medication_formulation',
        label: "Formulation",
      }),
      medication_dose: (index: number) => ({
        name: 'Medication_dose',
        label: "Dose",
      }),
      medication_dose_unit: (index: number) => ({
        name: 'medication_dose_unit',
        label: "Unit",
      }),
      medication_frequency: (index: number) => ({
        name: 'medication_frequency',
        label: "Frequency",
      }),
      medication_route: (index: number) => ({
        name: 'medication_route',
        label: 'Route'
      }),
      medication_duration: (index: number) => ({
        name: 'medication_duration',
        label: 'Duration'
      }),
      medication_duration_unit:(index: number) => ({
        name: 'medication_duration_unit',
        label: 'Unit'
      }),
      medication_date_last_taken:(index: number) => ({
        name: 'medication_date_last_taken',
        label: 'Last Taken'
      }),
      medication_date_of_last_prescription:(index: number) => ({
        name: 'medication_date_of_last_prescription',
        label: 'Last Prescribed'
      })}

      const durationOptions= [
        { id: "Days", label: "Days" },
        { id: "Weeks", label: "Weeks" },
        { id: "Months", label: "Months" },
        { id: "Years", label: "Years" },
      ]

      const medicationUnits = [
        { id: "Milligrams", label: "Milligrams (mg)" },
        { id: "Micrograms", label: "Micrograms (µg)" },
        { id: "Grams ", label: "Grams (g)" },
        { id: "International Units", label: "International Units (IU)" },
        { id: "Milliliters", label: "Milliliters (ml)" },
        { id: "Millimoles", label: "Millimoles (mmol)" },	
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
          const [otherFrequency, setOtherFrequency] = useState(false);


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
           headings = {[
            'Name', 
            'Formulation', 
            'Dose', 
            'Dose Unit', 
            'Frequency', 
            'Route', 
            'Duration', 
            'Duration Unit', 
            'Last Taken', 
            'Last Prescribed', 
          ]}
         renderFields={(medication, index) => (
            <>
  {/* Medication Name */}
  <TableCell>
    <SearchComboBox
      name={medicationFormConfig.medication_name(index).name}
      label=""
      options={medicationNames}
      getValue={(value) => console.log("Selected value:", value)}
      sx={{ width: '100%' }}
      multiple={false}
    />
  </TableCell>

  {/* Formulation */}
  <TableCell>
    <SearchComboBox
      name={medicationFormConfig.medication_formulation(index).name}
      label=""
      options={formulationOptions}
      getValue={(value) => console.log("Selected value:", value)}
      sx={{ width: '100%' }}
      multiple={false}
    />
  </TableCell>

  {/* Dose */}
  <TableCell>
    <TextInputField
      id={medicationFormConfig.medication_dose(index).name}
      name={medicationFormConfig.medication_dose(index).name}
      label=""
      sx={{ width: '100%' }}
    />
  </TableCell>

  {/* Dose Unit */}
  <TableCell>
    <SearchComboBox
      name={medicationFormConfig.medication_dose_unit(index).name}
      label=""
      options={medicationUnits}
      getValue={(value) => console.log("Selected value:", value)}
      sx={{ width: '100%' }}
      multiple={false}
    />
  </TableCell>

  {/* Frequency */}
  <TableCell>
    {!otherFrequency ? (
      <SearchComboBox
        name={medicationFormConfig.medication_frequency(index).name}
        label=""
        options={frequencyOptions}
        getValue={(value) => {
          if (value === 'Other') setOtherFrequency(true);
        }}
        sx={{ width: '100%' }}
        multiple={false}
      />
    ) : (
      <TextInputField
        id={medicationFormConfig.medication_frequency(index).name}
        name={medicationFormConfig.medication_frequency(index).name}
        label="Specify frequency"
        sx={{ width: '100%' }}
      />
    )}
  </TableCell>

  {/* Route */}
  <TableCell>
    <SearchComboBox
      name={medicationFormConfig.medication_route(index).name}
      label=""
      options={routeOptions}
      sx={{ width: '100%' }}
      multiple={false}
    />
  </TableCell>

  {/* Duration */}
  <TableCell>
    <TextInputField
      id={medicationFormConfig.medication_duration(index).name}
      name={medicationFormConfig.medication_duration(index).name}
      label=""
      sx={{ width: '100%' }}
    />
  </TableCell>

  {/* Duration Unit */}
  <TableCell>
    <SearchComboBox
      name={medicationFormConfig.medication_duration_unit(index).name}
      label=""
      options={durationOptions}
      getValue={(value) => console.log("Selected value:", value)}
      sx={{ width: '100%' }}
      multiple={false}
    />
  </TableCell>

  {/* Date of Last Taken */}
  <TableCell>
    <FormDatePicker
      name={medicationFormConfig.medication_date_last_taken(index).name}
      label=""
      sx={{ background: 'white', width: '100%' }}
    />
  </TableCell>

  {/* Date of Last Prescription */}
  <TableCell>
    <FormDatePicker
      name={medicationFormConfig.medication_date_of_last_prescription(index).name}
      label=""
      sx={{ background: 'white', width: '100%' }}
    />
  </TableCell>

            </>
          )}
        />
     <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
      </FormikInit>
    );
  }