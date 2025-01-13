"use client";
import { FormDatePicker, FormikInit, FormValuesListener, MainButton, SearchComboBox, TextInputField, UnitInputField, WrapperBox } from "@/components";
import React, { useEffect, useState } from "react";
import { Field, FieldArray, getIn } from "formik";
import * as yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { IoTimeOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import { concepts, durationOptions } from "@/constants";
import { getAllDrugs } from "@/hooks/drugs";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";


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


const formulationOptions =   [
  { id: concepts.TABLET, label: "Tablet" },
  { id: concepts.VIAL, label: "Vial" },
  { id: concepts.INTRAVENOUS, label: "Intravenous" },
  { id: concepts.POWDER, label: "Powder" },
  { id: concepts.SOLUTION, label: "Solution" },
  { id: concepts.EYE_OINTMENT, label: "Eye Ointment" },
  { id: concepts.CREAM, label: "Cream" },
  { id: concepts.EYE_DROPS, label: "Eye Drops" },
  { id: concepts.OINTMENT, label: "Ointment" },
  { id: concepts.INHALER, label: "Inhaler" },
  { id: concepts.SUPPOSITORY, label: "Suppository" },
  { id: concepts.PESSARY, label: "Pessary" },
  { id: concepts.SUSPENSION, label: "Suspension" },
  { id: concepts.SHAMPOO, label: "Shampoo" },
  { id: concepts.EAR_DROPS, label: "Ear Drops" },
  { id: concepts.EYE_PASTE, label: "Eye Paste" },
  ];

  const frequencyOptions = [
      {id:concepts.ONCE_A_DAY, label:'24 Hourly (OD) - Once a day '},
      {id:concepts.TWICE_A_DAY, label:'12 Hourly (BID) - Twice a day'},
      {id:concepts.THREE_TIMES_A_DAY, label:'8 Hourly (TID) - Three times a day'},
      {id:concepts.FOUR_TIMES_A_DAY, label:'6 Hourly (QID) - Four times a day'},
      {id:concepts.SIX_TIMES_A_DAY, label:'4 Hourly (OD) - Six times a day '},
      {id:concepts.ONCE_A_WEEK, label:'Once a week'},
      {id:concepts.ONCE_A_MONTH, label:'Once a month'},
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
      medication_duration: yup.number().required("Duration is required").positive("Duration must be greater than 0"),
      medication_duration_unit: yup.string().required("Duration unit is required"),
      medication_date_last_taken: yup
        .date()
        .nullable()
        .required("Date of last taken is required")
        .test('is-in-the-past', 'Date of last taken must be in the past', (value) => {
          return value && value <= new Date(); // Ensure the date is in the past
        })
        .test('last-taken-after-prescription', 'Date of last taken cannot be before the date of last prescription', function(value) {
          const { medication_date_of_last_prescription } = this.parent;
          return !value || !medication_date_of_last_prescription || value >= medication_date_of_last_prescription; // Ensure it's not before the prescription date
        }),
      medication_date_of_last_prescription: yup
        .date()
        .nullable()
        .required("Date of last prescription is required")
        .test('is-in-the-past', 'Date of last prescription must be in the past', (value) => {
          return value && value <= new Date(); // Ensure the date is in the past
        }),
    })
  ),
});

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
        return data.map((drug: { concept_uuid: string; name: string }) => ({
          id: drug.concept_uuid.toString(),
          label: drug.name,
        }));
      };
      setMedicationOptions(formatMedicationOptions(data));
    }
  }, [data]);

  const handleSubmit=()=> {
    onSubmit(formValues);
  }

  return (
    <>
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
                                       <div style={{ color: "red", fontSize: "0.875rem" }}>
                   <ErrorMessage
                     name={`medications[${index}].name`}
                   />
                   </div>
                    <SearchComboBox
                      name={`medications[${index}].formulation`}
                      label="Formulation"
                      options={formulationOptions}
                      getValue={(value) => setFieldValue(`medications[${index}].formulation`, value)}
                      sx={{ width: "200px" }}
                      multiple={false}
                    />
                   <div style={{ color: "red", fontSize: "0.875rem" }}>
                   <ErrorMessage
                     name={`medications[${index}].formulation`}
                   />
                   </div>
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
                    <div style={{ color: "red", fontSize: "0.875rem" }}>
                   <ErrorMessage
                     name={`medications[${index}].medication_dose`}
                   />
                   </div>
                    {!otherFrequency[index] ? (
                      <>
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
                      <div style={{ color: "red", fontSize: "0.875rem" }}>
                      <ErrorMessage
                        name={`medications[${index}].medication_frequency`}
                      />
                      </div>
                      </>
                    ) : (
                      <>
                      <TextInputField
                        id={`medications[${index}].medication_frequency`}
                        name={`medications[${index}].medication_frequency`}
                        label="Specify frequency"
                        sx={{ width: "180px" }}
                      />
                      <div style={{ color: "red", fontSize: "0.875rem"}}>
                      <ErrorMessage
                        name={`medications[${index}].medication_frequency`}
                      />
                      </div>
                      </>
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
                            <div style={{ color: "red", fontSize: "0.875rem"}}>
                      <ErrorMessage
                        name={`medications[${index}].medication_duration`}
                      />
                      </div>
                    <FormDatePicker
                      name={`medications[${index}].medication_date_last_taken`}
                      label="Last Taken"
                      sx={{ width: "150px" }}
                    />
                                                <div style={{ color: "red", fontSize: "0.875rem"}}>
                      <ErrorMessage
                        name={`medications[${index}].medication_date_last_taken`}
                      />
                      </div>
                    <FormDatePicker
                      name={`medications[${index}].medication_date_of_last_prescription`}
                      label="Last Prescribed"
                      sx={{ width: "150px" }}
                    />
                                                <div style={{ color: "red", fontSize: "0.875rem"}}>
                      <ErrorMessage
                        name={`medications[${index}].medication_date_of_last_prescription`}
                      />
                      </div>
                  </>
                )}
              />
            )}
          </FieldArray>
          <WrapperBox sx={{mt: '2ch' }}>
    <MainButton variant="secondary" title="Previous" type="button" onClick={onSkip} sx={{ flex: 1, marginRight: '8px' }} />
    <MainButton onClick={handleSubmit} variant="primary" title="Next" type="submit" sx={{ flex: 1 }} />
  </WrapperBox>
        </>
      )}
    </FormikInit>

    </>
  );
};