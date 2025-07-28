"use client";
import { FormDatePicker, FormikInit, FormValuesListener, MainButton, MainTypography, RadioGroupInput, SearchComboBox, TextInputField, UnitInputField, WrapperBox } from "@/components";
import React, { useEffect, useState } from "react";
import { Field, FieldArray, getIn } from "formik";
import * as yup from "yup";
import DynamicFormList from "@/components/form/dynamicFormList";
import { IoTimeOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import { concepts, durationOptions } from "@/constants";
import { getAllDrugs } from "@/hooks/drugs";
import { getFrequencyOptions } from "@/hooks/getFrequencyOptions";
import { getFormulationOptions } from "@/hooks/getFormulationOptions";
import LabelledCheckbox from "@/components/form/labelledCheckBox";


type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
  onPrevious: ()=>void;
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
  medication_self_medicated: string;
};
const now = new Date();
const today = now.toISOString().split("T")[0]; 

const medicationTemplate: Medication = {
  name: "",
  formulation: "",
  medication_dose: 0,
  medication_dose_unit: "",
  medication_frequency: "",
  medication_duration: 0,
  medication_duration_unit: "",
  medication_date_last_taken: today,
  medication_date_of_last_prescription: today,
  medication_self_medicated: "",
};

const initialValues = {
  medications: [medicationTemplate],
  none: false
};

const medicationUnits = [
  "Milligrams (mg)" ,
 "Micrograms (µg)" ,
"Grams (g)" ,
"International Units (IU)",
"Milliliters (ml)" ,
"Millimoles (mmol)",	
];



const medicationItemSchema = yup.object().shape({
  name: yup.string().required("Medication name is required"),
  formulation: yup.string().required("Formulation is required"),
  medication_dose: yup
    .number()
    .required("Dose is required")
    .positive("Dose must be greater than 0"),
  medication_dose_unit: yup.string().required("Dose unit is required"),
  medication_frequency: yup.string().required("Frequency is required"),
  medication_duration: yup
    .number()
    .required("Duration is required")
    .positive("Duration must be greater than 0"),
  medication_duration_unit: yup.string().required("Duration unit is required"),
  medication_date_last_taken: yup
    .date()
    .nullable()
    .required("Date of last taken is required")
    .test(
      "is-in-the-past",
      "Date of last taken must be in the past",
      (value) => value && value <= new Date()
    )
    .test(
      "last-taken-after-prescription",
      "Date of last taken cannot be before the date of last prescription",
      function (value) {
        const { medication_date_of_last_prescription } = this.parent;
        return (
          !value ||
          !medication_date_of_last_prescription ||
          value >= medication_date_of_last_prescription
        );
      }
    ),
  medication_date_of_last_prescription: yup
    .date()
    .nullable()
    .required("Date of last prescription is required")
    .test(
      "is-in-the-past",
      "Date of last prescription must be in the past",
      (value) => value && value <= new Date()
    ),
    medication_self_medicated: yup
    .string()
    .required("Self-medication status is required")
    .oneOf(["Yes", "No"], "Self-medication status must be either Yes or No"),
});

export const schema = yup.object().shape({
  none: yup.boolean().required(),
  medications: yup.array().when("none", {
    is: false,
    then: (schema) =>
      schema
        .of(medicationItemSchema)
        .min(1, "At least one medication must be added"),
    otherwise: (schema) => schema.notRequired(),
  }),
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

export const MedicationsForm = ({ onSubmit, onSkip, onPrevious }: Prop) => {
  const { data } = getAllDrugs();
  const [medicationOptions, setMedicationOptions] = useState<{ id: string; label: string }[]>([]);
  const [otherFrequency, setOtherFrequency] = useState<{ [key: number]: boolean }>({});
  const [formValues, setFormValues] = useState<any>({});
  const { frequencyOptions } = getFrequencyOptions();
  const { formulationOptions } = getFormulationOptions();  

  
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
          id: drug.concept_uuid?.toString(),
          label: drug.name,
        }));
      };
      setMedicationOptions(formatMedicationOptions(data));
    }
  }, [data]);
  
  const handleSubmit= async()=> {
    if(formValues.none){
      onSkip();
      return;
    }
    onSubmit(formValues);
  }

  return (
    <>
    <FormikInit
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
      enableReinitialize
      submitButton={false}
    >
      {({ values, setFieldValue }) => (
        <>
        <FormValuesListener getValues={setFormValues} />
        <div style={{marginBottom:"2ch"}}>
        <LabelledCheckbox
          name="none"
          label="Patient was not prescribed any medication"
        />
        </div>
          <FieldArray name="medications">
            {({ push, remove }) => (
              <DynamicFormList
                items={values.medications}
                setItems={(newItems) => setFieldValue("medications", newItems)}
                newItem={medicationTemplate}
                renderFields={(item, index) => (
                  <>
                  <div>
                    
                    <SearchComboBox
                      name={`medications[${index}].name`}
                      label="Medication Name"
                      options={medicationOptions}
                      getValue={(value) => setFieldValue(`medications[${index}].name`, value)}
                      sx={{ width: "200px" }}
                      multiple={false}
                      disabled={formValues['none']}
                    />
                   <MainTypography color="red" variant="subtitle2">
                   <ErrorMessage
                     name={`medications[${index}].name`}
                   />
                   </MainTypography>
                   </div>
                   <div>
                    <SearchComboBox
                      name={`medications[${index}].formulation`}
                      label="Formulation"
                      options={formulationOptions}
                      getValue={(value) => setFieldValue(`medications[${index}].formulation`, value)}
                      sx={{ width: "200px" }}
                      multiple={false}
                      disabled={formValues['none']}
                    />
                   <MainTypography color="red" variant="subtitle2">
                   <ErrorMessage
                     name={`medications[${index}].formulation`}
                   />
                   </MainTypography>
                   </div>
                   <div>
                    <UnitInputField
                    disabled={formValues['none']}
                      id={`medications[${index}].medication_dose`}
                      label="Dose"
                      name={`medications[${index}].medication_dose`}
                      unitName={`medications[${index}].medication_dose_unit`}
                      unitOptions={medicationUnits}
                      placeholder="e.g., 500"
                      sx={{ width: "320px" }}
                      inputIcon={<GiMedicines
                         />}
                    />
                    <MainTypography color="red" variant="subtitle2">
                   <ErrorMessage
                     name={`medications[${index}].medication_dose`}
                   />
                   </MainTypography>
                   </div>
                    {!otherFrequency[index] ? (
                      <>
                      <div>
                      <SearchComboBox
                      disabled={formValues['none']}
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
                      <MainTypography color="red" variant="subtitle2">
                      <ErrorMessage
                        name={`medications[${index}].medication_frequency`}
                      />
                      </MainTypography>
                      </div>
                      </>
                    ) : (
                      <>
                      <div>
                      <TextInputField
                      disabled={formValues['none']}
                        id={`medications[${index}].medication_frequency`}
                        name={`medications[${index}].medication_frequency`}
                        label="Specify frequency"
                        sx={{ width: "180px" }}
                      />
                      <MainTypography color="red" variant="subtitle2">
                      <ErrorMessage
                        name={`medications[${index}].medication_frequency`}
                      />
                      </MainTypography>
                      </div>
                      </>
                    )}
                    <div>
                    <UnitInputField
                    disabled={formValues['none']}
                      id={`medications[${index}].medication_duration`}
                      name={`medications[${index}].medication_duration`}
                      unitName={`medications[${index}].medication_duration_unit`}
                      label="Duration"
                      unitOptions={durationOptions}
                      placeholder="e.g. 7"
                      inputIcon={<IoTimeOutline />}
                    />
                       <MainTypography color="red" variant="subtitle2">
                      <ErrorMessage
                        name={`medications[${index}].medication_duration`}
                      />
                      </MainTypography>
                      </div>
                      <div>
                    <FormDatePicker
                    disabled={formValues['none']}
                      name={`medications[${index}].medication_date_last_taken`}
                      label="Last Taken"
                      sx={{ width: "150px" }}
                    />
                    <MainTypography color="red" variant="subtitle2">
                      <ErrorMessage
                        name={`medications[${index}].medication_date_last_taken`}
                      />
                      </MainTypography>
                      </div>
                      <div>
                    <FormDatePicker
                    disabled={formValues['none']}
                      name={`medications[${index}].medication_date_of_last_prescription`}
                      label="Last Prescribed"
                      sx={{ width: "150px" }}
                    />
                    <MainTypography color="red" variant="subtitle2">
                      <ErrorMessage
                        name={`medications[${index}].medication_date_of_last_prescription`}
                      />
                    </MainTypography>
                      </div>
                    <div style={{ marginTop: "24px" }}>
                      <RadioGroupInput
                        row
                        name={`medications[${index}].medication_self_medicated`}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        label="Did the patient self medicate?"
                        disabled={formValues["none"]}
                      />
                      <MainTypography color="red" variant="subtitle2">
                      <ErrorMessage
                        name={`medications[${index}].medication_self_medicated`}
                      />
                      </MainTypography>
                    </div>
                  </>
                )}
              />
            )}
          </FieldArray>
          <WrapperBox sx={{mt: '2ch' }}>
    <MainButton variant="secondary" title="Previous" type="button" onClick={onPrevious} sx={{ flex: 1, marginRight: '8px' }} />
    <MainButton onClick={() => {}} variant="primary" title="Next" type="submit" sx={{ flex: 1 }} />
  </WrapperBox>
        </>
      )}
    </FormikInit>

    </>
  );
};