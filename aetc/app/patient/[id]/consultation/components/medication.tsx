import { FormDatePicker, MainButton, SearchComboBox, UnitInputField, WrapperBox } from "@/components";
import React, { useState } from "react";
import medicationNames from "../../../../../constants/medicationnames.json";
import {
    FieldsContainer,
    FormikInit,
    SearchComboBox,
    FormValuesListener,
    FormikInit, TextInputField 
    MainButton,
    FormDatePicker,
    RadioGroupInput,
    WrapperBox,
} from "@/components";
import * as yup from "yup";
import { TableCell } from "@mui/material";
import DynamicFormList from "@/components/form/dynamicFormList";
import { IoTimeOutline } from "react-icons/io5";
import { GiMedicines } from "react-icons/gi";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { KeyValueContext, KeyValueContextType } from "@/contexts/keyValueContext";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

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
const schema = Yup.object().shape({
    medications: Yup.array().of(
        Yup.object().shape({
            formulation: Yup.string().required("Formulation is required"),
            frequency: Yup.string().required("Frequency is required"),
            route_of_administration: Yup.string().required("Route of administration is required"),
            duration: Yup.string().required("Duration is required"),
            last_prescribed_date: Yup.string().required("Date last prescribed is required"),
            date_and_time_of_last_med: Yup.string().required("Date and time last taken is required"),
        })
    ),
});

export const MedicationsForm = ({ onSubmit, onSkip }: Prop) => {
        const [formValues, setFormValues] = useState<any>({});
        const [value, setValue] = useState<number | string>("");
        const [medications, setMedications] = React.useState([
            { 
         //     name: "", 
              formulation: "", 
              medication_dose: 0, 
         //     medication_dose_unit: "", 
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
  
    const [formValues, setFormValues] = useState<any>({});
    const [medications, setMedications] = useState([
        { formulation: "", frequency: "", route_of_administration: "", duration: "", last_prescribed_date: "", date_and_time_of_last_med: "" },
    ]);
    const { addKeyToFlow } = useContext(KeyValueContext) as KeyValueContextType;

    const formulationLists = [
        { id: "tablet", label: "Tablet" },
        { id: "syrup", label: "Syrup" },
        { id: "injection", label: "Injection" },
    ];

    const frequencyLists = [
        { id: "24-Hourly-(OD)-Once-a-day", label: "24 Hourly (OD)-Once a day" },
        { id: "12-Hourly-(BID)-Twice-a-day", label: "12 Hourly (BID)-Twice a day" },
        { id: "8-Hourly-(TID)-Three-times-a-day", label: "8 Hourly (TID) -Three times a day" },
        { id: "6-Hourly-(QID)-Four-times-a-day", label: "6 Hourly (QID)- Four times a day" },
        { id: "4-Hourly-Six-times-a-day", label: "4 Hourly- Six times a day" },
    ];

    const durationLists = [
        { id: "singledose", label: "Single dose" },
        { id: "numberofdays", label: "Number of days" },
        { id: "numberofmonths", label: "Number of months" },
        { id: "numberofyears", label: "Number of years" },
    ];

    const handleInputChange = (index: number, field: string, value: string) => {
        const updatedMedications = medications.map((medication, i) =>
            i === index ? { ...medication, [field]: value } : medication
        );
        setMedications(updatedMedications);
    };

    const handleAddMedication = () => {
      setMedications([...medications, { 
     //   name: "", 
        formulation: "", 
        medication_dose: 0, 
    //    medication_dose_unit: "", 
        medication_frequency: "", 
        medication_route: "", 
        medication_duration: 0, 
        medication_duration_unit: "", 
        medication_date_last_taken: "", 
        medication_date_of_last_prescription: "" 
      }]);
        setMedications([...medications, { formulation: "", frequency: "", route_of_administration: "", duration: "", last_prescribed_date: "", date_and_time_of_last_med: "" }]);
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
        formValues["medications"] = medications;
        onSubmit(formValues);
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
        //    name: "", 
            formulation: "", 
            medication_dose: 0, 
        //    medication_dose_unit: "", 
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
  id={medicationFormConfig.medication_dose(index).name}
  label={medicationFormConfig.medication_dose(index).label}
  initialValue=""  
  initialUnit={medicationUnits[0]} 
  unitOptions={medicationUnits} 
  placeholder="e.g., 500"
  sx={{ width: '320px' }}  
  onValueChange={(value) => console.log("Entered dose:", value)} 
  onUnitChange={(unit) => console.log("Selected unit:", unit)}  
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
  id={medicationFormConfig.medication_duration(index).name}
  label={medicationFormConfig.medication_duration(index).label}
  initialValue=""  // Replace with the appropriate initial value if needed
  initialUnit={durationOptions[0]}   // Replace with the appropriate initial unit if needed
  unitOptions={durationOptions}  // Pass the unit options
  placeholder="e.g. 7"
  onValueChange={(value) => console.log("Entered duration:", value)}
  onUnitChange={(unit) => console.log("Selected unit:", unit)}
  inputIcon={<IoTimeOutline/>}  // Optional icon, adjust as needed
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
            validationSchema={schema}
            initialValues={{ medications }}
            onSubmit={handleSubmit}
            enableReinitialize={true}
            submitButtonText="Submit"
            submitButton={false}
        >
            <FormValuesListener getValues={setFormValues} />

            <WrapperBox sx={{ padding: "1.5rem", borderRadius: "8px", backgroundColor: "#f7f9fc" }}>
                {medications.map((medication, index) => (
                    <div key={index}>
                        {/* Formulation */}
                        <FieldsContainer sx={{ mb: "1.5ch" }}>


                            <FormControl sx={{ width: 300 }}>
                                <InputLabel id={`formulation-label-${index}`}>Formulation</InputLabel>
                                <Select
                                    labelId={`formulation-label-${index}`}
                                    id={`formulation-${index}`}
                                    value={medications[index].formulation || ""}
                                    onChange={(e) => handleInputChange(index, "formulation", e.target.value)}
                                    label="Formulation"
                                >
                                    {formulationLists.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>


                            <FormControl sx={{ width: 300 }}>
                                <InputLabel id={`frequency-${index}`}>Frequency</InputLabel>
                                <Select
                                    labelId={`frequency-label-${index}`}
                                    id={`frequency-${index}`}
                                    value={medications[index].frequency || ""}
                                    onChange={(e) => handleInputChange(index, "frequency", e.target.value)}
                                    label="Frequency"
                                >
                                    {frequencyLists.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </FieldsContainer>

                        {/* Route of Administration */}
                        <FieldsContainer sx={{ mb: "1.5ch" }}>
                            <RadioGroupInput
                                row={true}
                                name={`medications[${index}].route_of_administration`}
                                label="Route of Administration"
                                options={[
                                    { label: "Oral", value: "oral" },
                                    { label: "Oral suppository", value: "oral-suppository" },
                                    { label: "Intravenous", value: "Intravenous" },
                                ]}
                            />
                        </FieldsContainer>




                        <FormControl sx={{ width: 300, marginBottom: '2ch' }}>
                            <InputLabel id={`duration-label-${index}`}>Duration</InputLabel>
                            <Select
                                labelId={`duration-label-${index}`}
                                id={`duration-${index}`}
                                value={medications[index].duration || ""}
                                onChange={(e) => handleInputChange(index, "duration", e.target.value)}
                                label="Duration"
                            >
                                {durationLists.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        {/* Last Prescribed Date */}
                        <FieldsContainer sx={{ mb: "1.5ch" }}>
                            <label style={{ marginBottom: '0.5ch', fontSize: '14px' }}>
                                Date Last Prescribed
                            </label>
                            <input
                                type="date"
                                name={`medications[${index}].last_prescribed_date`}
                                onChange={(e) => handleInputChange(index, "last_prescribed_date", e.target.value)}
                                value={medication.last_prescribed_date}
                                style={{
                                    padding: '0.5ch 1ch',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f4f4f4',
                                    color: '#333',
                                    cursor: 'pointer',
                                    marginRight: '1ch',
                                    width: '15%',
                                }}
                            />
                        </FieldsContainer>

                        {/* Date and Time Last Taken */}
                        <FieldsContainer sx={{ mb: "1.5ch" }}>
                            <label style={{ marginBottom: '0.5ch', fontSize: '14px' }}>
                                Date and Time Last Taken
                            </label>
                            <input
                                type="datetime-local"
                                name={`medications[${index}].date_and_time_of_last_med`}
                                onChange={(e) => handleInputChange(index, "date_and_time_of_last_med", e.target.value)}
                                value={medication.date_and_time_of_last_med}
                                style={{
                                    padding: '0.5ch 1ch',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f4f4f4',
                                    color: '#333',
                                    cursor: 'pointer',
                                    marginRight: '1ch',
                                    width: '20%',
                                }}
                            />
                        </FieldsContainer>

                    </div>
                ))}
            </WrapperBox>
            <MainButton sx={{ m: 0.5 }} onClick={handleSubmit} title="Submit" />
            <MainButton variant={"secondary"} sx={{ m: 0.5 }} onClick={onSkip} title="Skip" />
        </FormikInit>
    );
  }
};
