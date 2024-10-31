"use client";
import { FormDatePicker, FormikInit, FormValuesListener, MainButton, SearchComboBox, TextInputField, UnitInputField, WrapperBox } from "@/components";
import React, { useEffect, useState } from "react";
import { FieldArray } from "formik";
import * as yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { IoTimeOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import { durationOptions } from "@/constants";
import { getAllDrugs } from "@/hooks/drugs";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

type Medication = {
  name: string;
  formulation: string;
  medication_dose: number;
  medication_dose_unit: string;
  medication_frequency: string;
  medication_route: string;
  medication_duration: number;
  medication_duration_unit: string;
  medication_date_last_taken: string;
  medication_date_of_last_prescription: string;
};

const medicationTemplate: Medication = {
  name: "",
  formulation: "",
  medication_dose: 0,
  medication_dose_unit: "",
  medication_frequency: "",
  medication_route: "",
  medication_duration: 0,
  medication_duration_unit: "",
  medication_date_last_taken: "",
  medication_date_of_last_prescription: "",
};

const initialValues = {
  medications: [medicationTemplate],
};

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

// Validation schema
const schema = yup.object().shape({
  medications: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Medication name is required"),
      formulation: yup.string().required("Formulation is required"),
      medication_dose: yup.number().required("Dose is required").positive("Dose must be greater than 0"),
      medication_dose_unit: yup.string().required("Dose unit is required"),
      medication_frequency: yup.string().required("Frequency is required"),
      medication_route: yup.string().required("Route is required"),
      medication_duration: yup.number().required("Duration is required").positive("Duration must be greater than 0"),
      medication_duration_unit: yup.string().required("Duration unit is required"),
      medication_date_last_taken: yup.date().nullable().required("Date of last taken is required"),
      medication_date_of_last_prescription: yup.date().nullable().required("Date of last prescription is required"),
    })
  ),
});

export const MedicationsForm = ({ onSubmit, onSkip }: Prop) => {
  const { data } = getAllDrugs();
  const [medicationOptions, setMedicationOptions] = useState<{ id: string; label: string }[]>([]);
  const [otherFrequency, setOtherFrequency] = useState<{ [key: number]: boolean }>({});
  const [formValues, setFormValues] = useState<any>({});


  
  const handleUpdateFrequency = (index: number, value: boolean) => {
    setOtherFrequency((prevState) => ({
      ...prevState,
      [index]: value,
    }));
  };

  useEffect(() => {
    
    if (data) {
      const formatMedicationOptions = (data: any) => {
        return data.map((drug: { uuid: string; name: string }) => ({
          id: drug.uuid.toString(),
          label: drug.name,
        }));
      };
      setMedicationOptions(formatMedicationOptions(data));
    }
  }, [data]);

  return (
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
      enableReinitialize
      submitButton={false}
    >
      {({ values, setFieldValue }) => (
        <>
        <FormValuesListener getValues={setFormValues} />
          <FieldArray name="medications">
            {({ push, remove }) => (
              <DynamicFormList
                items={values.medications}
                setItems={(newItems) => setFieldValue("medications", newItems)}
                newItem={medicationTemplate}
                renderFields={(item, index) => (
                  <>
                    <SearchComboBox
                      name={`medications[${index}].name`}
                      label="Medication Name"
                      options={medicationOptions}
                      getValue={(value) => setFieldValue(`medications[${index}].name`, value)}
                      sx={{ width: "200px" }}
                      multiple={false}
                    />
                    <SearchComboBox
                      name={`medications[${index}].formulation`}
                      label="Formulation"
                      options={formulationOptions}
                      getValue={(value) => setFieldValue(`medications[${index}].formulation`, value)}
                      sx={{ width: "200px" }}
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
                        name={`medications[${index}].medication_frequency`}
                        label="Frequency"
                        options={frequencyOptions}
                        getValue={(value) => {
                          if (value === "Other") handleUpdateFrequency(index, true);
                          setFieldValue(`medications[${index}].medication_frequency`, value);
                        }}
                        sx={{ width: "180px" }}
                        multiple={false}
                      />
                    ) : (
                      <TextInputField
                        id={`medications[${index}].medication_frequency`}
                        name={`medications[${index}].medication_frequency`}
                        label="Specify frequency"
                        sx={{ width: "180px" }}
                      />
                    )}
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
                      name={`medications[${index}].medication_date_last_taken`}
                      label="Last Taken"
                      sx={{ width: "150px" }}
                    />
                    <FormDatePicker
                      name={`medications[${index}].medication_date_of_last_prescription`}
                      label="Last Prescribed"
                      sx={{ width: "150px" }}
                    />
                  </>
                )}
              />
            )}
          </FieldArray>
          <WrapperBox sx={{ mt: "2ch" }}>
            <MainButton sx={{ m: 0.5 }} title="Submit" type="submit" onClick={function (params?: any): void {
              console.log(formValues)
            } } />
            <MainButton variant="secondary" title="Skip" type="button" onClick={onSkip} />
          </WrapperBox>
        </>
      )}
    </FormikInit>
  );
};