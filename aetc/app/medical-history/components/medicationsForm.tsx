import { FormDatePicker, SearchComboBox,  SelectInputField, WrapperBox } from "@/components";
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
import { Checkbox, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import DynamicFormList from "@/components/form/dynamicFormList";

type Props = {
    onSubmit: (values: any) => void;
  };

  const form = {
    medication_name: {
        name: 'Medication',
        label: "Name",
      },
      medication_formulation: {
        name: 'medication_formulation',
        label: "Formulation",
      },
      medication_dose: {
        name: 'Medication_dose',
        label: "Dose",
      },
      medication_dose_unit: {
        name: 'medication_dose_unit',
        label: "Unit",
      },
      medication_frequency: {
        name: 'medication_frequency',
        label: "Frequency",
      },
      medication_route:{
        name: 'medication_route',
        label: 'Route'
      },
      medication_duration:{
        name: 'medication_duration',
        label: 'Duration'
      },
      medication_duration_unit:{
        name: 'medication_duration_unit',
        label: 'Unit'
      },
      medication_date_last_taken:{
        name: 'medication_date_last_taken',
        label: 'Last Taken'
      },
      medication_date_of_last_prescription:{
        name: 'medication_date_of_last_prescription',
        label: 'Last Prescribed'
      },}

function MedicationsForm({ form, medicationNames, formulationOptions, medicationUnits, frequencyOptions, routeOptions, durationOptions }) {
    const [medications, setMedications] = React.useState([
      { name: "", formulation: "", medication_dose: 0, medication_dose_unit: "" },
    ]);
  
    const handleAddMedication = () => {
      setMedications([...medications, { name: "", formulation: "", medication_dose: 0, medication_dose_unit: "" }]);
    };
  
    const handleRemoveMedication = (index: number) => {
      const updatedMedications = medications.filter((_, i) => i !== index);
      setMedications(updatedMedications);
    };
  
    return (
      <FormFieldContainerLayout title="Medications">
        <DynamicFormList
          items={medications}
          addItem={handleAddMedication}
          removeItem={handleRemoveMedication}
          renderFields={(medication, index) => (
            <>
              <TableCell sx={{ width: '30%', textAlign: 'center' }}>
                <SearchComboBox
                  name={form.medication_name(index).name}
                  label=""
                  options={medicationNames}
                  multiple={false}
                  sx={{ width: '100%' }}
                />
              </TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                <TextInputField
                  id={form.medication_dose(index).name}
                  name={form.medication_dose(index).name}
                  label=""
                  sx={{ width: '100%' }}
                />
              </TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'center' }}>
                <SearchComboBox
                  name={form.medication_dose_unit(index).name}
                  label=""
                  options={medicationUnits}
                  multiple={false}
                  sx={{ width: '100%' }}
                />
              </TableCell>
            </>
          )}
        />
      </FormFieldContainerLayout>
    );
  }