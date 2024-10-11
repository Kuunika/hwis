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
type Props = {
  onSubmit: (values: any) => void;
};
const form = {
  complaints_name: (index: number) => ({
    name: `${concepts.COMPLAINTS}[${index}].name`,
    label: `Complaints`,
  }),
  complaints_duration: (index: number) => ({
    name: `${concepts.COMPLAINTS}[${index}].duration`,
    label: "Duration",
  }),
  complaints_duration_units: (index: number) => ({
    name: `${concepts.COMPLAINTS}[${index}].duration_units`,
    label: "Units",
  }),
  allergy: {
    name: concepts.ALLERGY,
    label: "Allergies",
  },
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
  },
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
  })
};

const schema = yup.object({

});

const durationOptions= [
  { id: "Days", label: "Days" },
  { id: "Weeks", label: "Weeks" },
  { id: "Months", label: "Months" },
  { id: "Years", label: "Years" },
]

const presentingComplaints = [
  { id: "Ascites", label: "Ascites" },
  { id: "Shivering", label: "Shivering" },
  { id: "Abdominal Distension", label: "Abdominal distension" },
  { id: "Abdominal Mass", label: "Abdominal mass" },
  { id: "Abnormal Bizzarre Behaviour", label: "Abnormal bizzarre behaviour" },
  { id: "Abnormal Laboratory Values", label: "Abnormal laboratory values" },
  { id: "Allergic Reaction", label: "Allergic reaction" },
  { id: "Amputation", label: "Amputation" },
  { id: "Animal Bite Dog", label: "Animal Bite Dog" },
  { id: "Animal Bite Human", label: "Animal Bite Human" },
  { id: "Animal Bite Hyena", label: "Animal Bite Hyena" },
  { id: "Animal Bite Cat", label: "Animal Bite Cat" },
  // { id: "Animal Bite Other", label: "Other (specify)" },
  { id: "Anxiety", label: "Anxiety" },
  { id: "Aphasia", label: "Aphasia (Unable to talk)" },
  { id: "Bleeding Problem", label: "Bleeding problem" },
  { id: "Blood And Body Fluid Exposure", label: "Blood and body fluid exposure" },
  { id: "Blood In Stool", label: "Blood in stool" },
  { id: "Burn Injury", label: "Burn injury" },
  { id: "Carbon Monoxide Poisoning", label: "Carbon monoxide poisoning" },
  // { id: "Cardiac Arrest", label: "Cardiac arrest" },
  { id: "Catheter Change", label: "Catheter change (urethral)" },
  { id: "Cold Exposure", label: "Cold exposure" },
  { id: "Confusion", label: "Confusion" },
  { id: "Constipation", label: "Constipation" },
  { id: "Convulsion Seizure", label: "Convulsion/seizure" },
  { id: "Cool Pulseless Limb", label: "Cool pulseless limb" },
  { id: "Cough", label: "Cough" },
  { id: "Dehydration", label: "Dehydration" },
  { id: "Dental", label: "Dental" },
  { id: "Diarrhoea", label: "Diarrhoea" },
  { id: "Diplopia", label: "Diplopia" },
  // { id: "Direct Referral For Other Specialty", label: "Direct referral for other specialty" },
  { id: "Dizziness", label: "Dizziness" },
  { id: "Dressing Change", label: "Dressing change" },
  { id: "Drowning", label: "Drowning" },
  { id: "Drug Administration", label: "Drug administration" },
  { id: "Dysphagia", label: "Dysphagia (difficulty swallowing)" },
  { id: "Dysuria", label: "Dysuria (Painful urination)" },
  { id: "Ear Discharge", label: "Ear discharge" },
  { id: "Earache", label: "Earache" },
  { id: "Electric Shock", label: "Electric shock" },
  { id: "Epistaxis", label: "Epistaxis (Nose bleed)" },
  { id: "Exposure To Communicable Diseases", label: "Exposure to communicable diseases" },
  { id: "Exposure To Gas", label: "Exposure to gas" },
  { id: "Eye Discharge", label: "Eye discharge" },
  { id: "Fainting Syncope Collapse", label: "Fainting/syncope/collapse" },
  { id: "Fever", label: "Fever" },
  { id: "Focal Numbness", label: "Focal numbness" },
  { id: "Focal Weakness", label: "Focal weakness" },
  { id: "For Sick Leave", label: "For sick leave" },
  { id: "Foreign Body Ear", label: "Foreign body ear" },
  { id: "Foreign Body Eye", label: "Foreign body eye" },
  { id: "Foreign Body Nose", label: "Foreign body nose" },
  { id: "Foreign Body Oesophageal Or Oral", label: "Foreign body oesophageal or oral" },
  { id: "Foreign Body Rectum", label: "Foreign body rectum" },
  { id: "Foreign Body Respiratory", label: "Foreign body respiratory" },
  { id: "Foreign Body Throat", label: "Foreign body throat" },
  { id: "Foreign Body Vagina", label: "Foreign body vagina" },
  { id: "General Body Weakness", label: "General body weakness" },
  { id: "Genital Discharge", label: "Genital discharge" },
  { id: "Genital Lesion", label: "Genital lesion" },
  { id: "Haematuria (bloody urine)", label: "Haematuria (bloody urine)" },
  { id: "Haemoptysis (Coughing blood)``", label: "Haemoptysis (Coughing blood)" },
  { id: "Haemorrhoid", label: "Haemorrhoid" },
  { id: "Headache", label: "Headache" },
  { id: "Heart Palpitations", label: "Heart palpitations" },
  { id: "Heavy Menstruation", label: "Heavy menstruation" },
  { id: "Hiccups", label: "Hiccups" },
  { id: "High Blood Glucose", label: "High blood glucose" },
  { id: "High Blood Pressure", label: "High blood pressure" },
  { id: "Hyperglycaemia", label: "Hyperglycaemia" },
  { id: "Hypertension", label: "Hypertension" },
  { id: "Hyperventilation", label: "Hyperventilation" },
  { id: "Hypoglycaemia", label: "Hypoglycaemia" },
  { id: "Hypothermia", label: "Hypothermia" },
  { id: "Imaging Tests", label: "Imaging tests" },
  { id: "Injury Abdomen Blunt", label: "Injury abdomen blunt" },
  { id: "Injury Abdomen Penetrating", label: "Injury abdomen penetrating" },
  { id: "Injury Anal Or Rectal", label: "Injury anal or rectal" },
  { id: "Injury Chemical Exposure", label: "Injury chemical exposure" },
  { id: "Injury Chest Blunt", label: "Injury chest blunt" },
  { id: "Injury Chest Penetrating", label: "Injury chest penetrating" },
  { id: "Injury Ear", label: "Injury ear" },
  { id: "Injury Electrical", label: "Injury electrical" },
  { id: "Injury Eye", label: "Injury eye" },
  { id: "Injury Face", label: "Injury face" },
  { id: "Injury Genital", label: "Injury genital" },
  { id: "Injury Head", label: "Injury head" },
  { id: "Injury Lower Extremity", label: "Injury lower extremity" },
  { id: "Injury Major Trauma Blunt", label: "Injury major trauma blunt" },
  { id: "Injury Major Trauma Penetrating", label: "Injury Major trauma penetrating" },
  { id: "Injury Neck", label: "Injury neck" },
  { id: "Injury Nose", label: "Injury nose" },
  { id: "Injury Spine", label: "Injury spine" },
  { id: "Injury Upper Extremity", label: "Injury upper extremity" },
  { id: "Insomnia", label: "Insomnia (difficulty sleeping)" },
  { id: "Intoxication", label: "Intoxication" },
  { id: "Jaundice", label: "Jaundice" },
  { id: "Loss Of Appetite", label: "Loss of appetite (Anorexia)" },
  { id: "Loss Of Consciousness", label: "Loss of consciousness" },
  { id: "Loss Of Hearing", label: "Loss of hearing" },
  { id: "Lump Mass", label: "Lump/mass" },
  { id: "Medical Device Problem", label: "Medical device problem" },
  { id: "Muscle Cramps", label: "Muscle Cramp s" },
  { id: "Nasal Congestion", label: "Nasal congestion" },
  { id: "Nausea", label: "Nausea" },
  { id: "Nose Bleed", label: "Nose bleed" },
  { id: "Numbness Parasthesias", label: "Numbness/Parasthesias" },
  { id: "Odynophagia", label: "Odynophagia (Painful swallowing)" },
  { id: "Oedema Bilateral Leg", label: "Oedema bilateral leg (Leg swelling)" },
  { id: "Oedema Generalised", label: "Oedema generalised (General body swelling)" },
  { id: "Oliguria", label: "Oliguria (Reduced urine output" },
  { id: "Other", label: "Other" },
  // { id: "Other Specify", label: "Specify" },
  { id: "Pain Abdominal", label: "Pain abdominal" },
  { id: "Pain Back", label: "Pain back" },
  { id: "Pain Chest", label: "Pain chest" },
  { id: "Pain Flank", label: "Pain flank" },
  { id: "Pain Groin", label: "Pain groin" },
  { id: "Pain Lower Extremity", label: "Pain lower extremity" },
  { id: "Pain Neck", label: "Pain neck" },
  { id: "Pain On The Face", label: "Pain on the face" },
  { id: "Pain Rectal Or Perianal", label: "Pain rectal or perianal" },
  { id: "Pain Scrotal", label: "Pain scrotal" },
  { id: "Pain Upper Extremity", label: "Pain upper extremity" },
  { id: "Painful Ear", label: "Painful ear" },
  { id: "Painful Eye", label: "Painful eye" },
  { id: "Painful Urination", label: "Painful urination (Dysuria)" },
  { id: "Patient Safety Concern", label: "Patient safety concern" },
  { id: "Per Vaginal Bleeding", label: "Per vaginal bleeding" },
  { id: "Per Vaginal Bleeding With Amenorrhoea", label: "Per vaginal bleeding with amenorrhoea" },
  { id: "Photophobia", label: "Photophobia" },
  { id: "Poisoning", label: "Poisoning" },
  { id: "Polyuria", label: "Polyuria" },
  { id: "Postoperative Complication", label: "Postoperative complication" },
  { id: "Prolonged Menstruation", label: "Prolonged menstruation" },
  { id: "Pruritus", label: "Pruritus (Itching)" },
  { id: "Rash", label: "Rash" },
  { id: "Red Eye", label: "Red eye" },
  // { id: "Respiratory Arrest", label: "Respiratory arrest" },
  { id: "Ring Removal", label: "Ring removal" },
  { id: "Self Harm", label: "Self harm" },
  { id: "Sexual Assault", label: "Sexual assault" },
  { id: "Shortness Of Breath", label: "Shortness of breath" },
  { id: "Sleep Disturbance", label: "Sleep disturbance" },
  { id: "Social Problem", label: "Social problem" },
  { id: "Sore Throat", label: "Sore throat" },
  { id: "Sting Bee", label: "Sting Bee" },
  { id: "Sting Scorpion", label: "Sting Scorpion" },
  { id: "Sting Wasp", label: "Sting Wasp" },
  // { id: "Sting Other Specify", label: "Other specify" },
  { id: "Stridor", label: "Stridor" },
  { id: "Substance Withdrawal Alcohol", label: "Substance Withdrawal Alcohol" },
  { id: "Substance Withdrawal Opioid", label: "Substance Withdrawal Opioid" },
  { id: "Substance Withdrawal Benzodiazepine", label: "Substance Withdrawal benzodiazepine" },
  // { id: "Substance Withdrawal Other Specify", label: "Other specify" },
  { id: "Surgical Admission For Elective Surgery", label: "Surgical admission for elective surgery" },
  { id: "Suspected Bowel Obstruction", label: "Suspected bowel obstruction" },
  { id: "Suture Removal", label: "Suture removal" },
  { id: "Swelling Groin", label: "Swelling groin" },
  { id: "Swelling Joint", label: "Swelling joint" },
  { id: "Swelling Neck", label: "Swelling neck" },
  { id: "Swelling Penile", label: "Swelling penile" },
  { id: "Swelling Peri Orbital", label: "Swelling peri orbital" },
  { id: "Swelling Scrotal", label: "Swelling scrotal" },
  { id: "Tinnitus", label: "Tinnitus (Ringing in the ears)" },
  { id: "Tremor", label: "Tremor" },
  { id: "Unable To See", label: "Unable to see" },
  { id: "Urinary Retention", label: "Urinary retention" },
  { id: "Vaginal Discharge", label: "Vaginal discharge" },
  { id: "Vertigo", label: "Vertigo" },
  { id: "Violent Behaviour", label: "Violent behaviour" },
  { id: "Visual Disturbance", label: "Visual disturbance" },
  { id: "Vomiting", label: "vomiting" },
  { id: "Vomiting Blood", label: "Vomiting blood" },
  { id: "Walking Difficulty", label: "Walking difficulty (Gait disturbance or ataxia)" },
  { id: "Wheezing", label: "Wheezing" },
  { id: "Wound Review", label: "Wound review" },
  { id: "Pain Shoulder", label: "Pain shoulder" },
  { id: "Pain Lower Abdomen", label: "Pain lower abdomen (suprapubic)" },
  { id: "Wound Discharge", label: "Wound discharge" },
  { id: "Not Passing Stools", label: "Not passing stools" },
  { id: "Food Poisoning", label: "Food poisoning" }
];

const allergyOptions = [
  {
    label: 'Medications',
    options: [
      { value: "Aspirin", label: "Aspirin" },
      { value: "Ibuprofen", label: "Ibuprofen" },
      { value: "Indomethacin", label: "Indomethacin" },
      { value: "Diclofenac", label: "Diclofenac" },
      { value: "Amoxicillin", label: "Amoxicillin" },
      { value: "Penicillin V", label: "Penicillin V" },
      { value: "Amoxicillin - clavulanic acid", label: "Amoxicillin - clavulanic acid" },
      { value: "Cotrimoxazole", label: "Cotrimoxazole" },
      { value: "Sulfadoxime Pyrimethamine (SP)", label: "Sulfadoxime Pyrimethamine (SP)" },
      { value: "Sulphur containing medication", label: "Sulphur containing medication" },
    ],
  },
  {
    label: 'Medical Substances',
    options: [
      { value: "Radiocontrast", label: "Radiocontrast" },
      { value: "Latex", label: "Latex" },
    ],
  },
  {
    label: 'Other Substances',
    options: [
      { value: "Pollen", label: "Pollen" },
      { value: "Bees", label: "Bees" },
      { value: "Wasps", label: "Wasps" },
    ],
  },
  {
    label: 'Food',
    options: [
      { value: "Seafood: Shellfish, prawns, calamari", label: "Seafood: Shellfish, prawns, calamari" },
      { value: "Other fish", label: "Other fish" },
      { value: "Eggs", label: "Eggs" },
      { value: "Peanut butter", label: "Peanut butter" },
    ],
  },
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

const medicationUnits = [
  { id: "Milligrams", label: "Milligrams (mg)" },
  { id: "Micrograms", label: "Micrograms (µg)" },
  { id: "Grams ", label: "Grams (g)" },
  { id: "International Units", label: "International Units (IU)" },
  { id: "Milliliters", label: "Milliliters (ml)" },
  { id: "Millimoles", label: "Millimoles (mmol)" },	
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

const binaryOptions = [
  {label:'yes', value:'yes'},
  {label:'no', value:'no'}
]

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
]

const initialValues = {};

export const MedicalHistoryForm = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState<any>({});
  const [complaints, setComplaints] = useState([
    { complaint: "", duration: 0, duration_unit: "" },
  ]);
  const [medications, setMedication] = useState([
    { name: "", formulation: "", medication_dose:0, medication_dose_unit: "" },
  ]);
  const [conditions, setConditions] = useState([
    { name: "", date_of_diagnosis: "", on_treatment:"No", additional_notes: "" },
  ]);
  const [otherFrequency, setOtherFrequency] = useState(false);


  function handleRemoveComplaint(index: number): void {
    const updatedComplaints = complaints.filter((_, i) => i !== index);
    setComplaints(updatedComplaints);
  }

  function handleAddComplaint(): void {
    setComplaints([
      ...complaints,
      { complaint: "", duration: 0, duration_unit: "" },
    ]);;
  }
  function handleRemoveCondition(index: number): void {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  }

  function handleAddCondition(): void {
    setConditions([
      ...conditions,
      { name: "", date_of_diagnosis: "", on_treatment:"No", additional_notes: ""  },
    ]);;
  }

  function handleRemoveMedication(index: number): void {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedication(updatedMedications);
  }

  function handleAddMedication(): void {
    setMedication([
      ...medications,
      { name: "", formulation: "", medication_dose:0, medication_dose_unit: "" },
    ]);;
  }


  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButtonText="submit"
    >
      <FormValuesListener getValues={setFormValues} />
      <FormFieldContainerLayout title="Presenting Complaints">
        <Table>
        <TableHead>
          <TableRow>
        <TableCell sx={{ width: '30%', textAlign: 'left' }}>{form.complaints_name(0).label}</TableCell>
        <TableCell sx={{ width: '20%', textAlign: 'left' }}>{form.complaints_duration(0).label}</TableCell>
        <TableCell sx={{ width: '20%', textAlign: 'left' }}>{form.complaints_duration_units(0).label}</TableCell>
        <TableCell sx={{ width: '10%', textAlign: 'left' }}>Actions</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
      {complaints.map((complaint, index) => (
        <TableRow key={index}>
          {/* Complaint */}
          <TableCell sx={{ width: '30%', textAlign: 'center' }}>
            <SearchComboBox
              name={form.complaints_name(index).name}
              label=""
              options={presentingComplaints}
              multiple={false}
              sx={{ width: '100%' }} // Adjust width to match the cell
            />
          </TableCell>

          {/* Duration */}
          <TableCell sx={{ width: '20%', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center',  marginTop:'5px' }}>
              <TextInputField
                id={form.complaints_duration(index).name}
                name={form.complaints_duration(index).name}
                label=""
                sx={{ width: '100%' }}
              />
            </div>
          </TableCell>

          {/* Units */}
          <TableCell sx={{ width: '30%', textAlign: 'center' }}>
            <SearchComboBox
              name={form.complaints_duration_units(index).name}
              label=""
              options={durationOptions}
              multiple={false}
              sx={{ width: '100%' }}
            />
          </TableCell>

          {/* Action Buttons */}
          <TableCell sx={{ width: '10%', textAlign: 'center' }}>
            <IconButton
              disabled={index === 0}
              onClick={() => handleRemoveComplaint(index)}
              color="error"
            >
              <FaMinus />
            </IconButton>
            {index === complaints.length - 1 && (
              <IconButton onClick={handleAddComplaint} color="primary">
                <FaPlus />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
      </Table>

      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Allergies">
        <FieldsContainer>
        <GroupedSearchComboBox options={allergyOptions} getValue={(value) => console.log(value)}  multiple={true} name={form.allergy.name}label={form.allergy.label} />
        </FieldsContainer>
      </FormFieldContainerLayout>
      <FormFieldContainerLayout title="Medications">
  {medications.map((medication, index) => (
    <WrapperBox key={index} sx={{ borderBottom: '1px solid #B3B3B3', marginBottom: '2ch' }}>
      <Grid container spacing={2}>
        {/* Medication Name */}
        <Grid item xs={12} sm={6} md={3}>
          <SearchComboBox
            name={form.medication_name.name}
            label={form.medication_name.label}
            options={medicationNames}
            getValue={(value) => console.log("Selected value:", value)}
            sx={{ width: '100%' }}
            multiple={false}
          />
        </Grid>

        {/* Formulation */}
        <Grid item xs={12} sm={6} md={3}>
          <SearchComboBox
            name={form.medication_formulation.name}
            label={form.medication_formulation.label}
            options={formulationOptions}
            getValue={(value) => console.log("Selected value:", value)}
            sx={{ width: '100%' }}
            multiple={false}
          />
        </Grid>

        {/* Dose */}
        <Grid item xs={12} sm={6} md={2}>
          <TextInputField
            id={form.medication_dose.name}
            name={form.medication_dose.name}
            label={form.medication_dose.label}
            sx={{ width: '100%' }}
          />
        </Grid>

        {/* Dose Unit */}
        <Grid item xs={12} sm={6} md={2}>
          <SearchComboBox
            name={form.medication_dose_unit.name}
            label={form.medication_dose_unit.label}
            options={medicationUnits}
            getValue={(value) => console.log("Selected value:", value)}
            sx={{ width: '100%' }}
            multiple={false}
          />
        </Grid>

        {/* Frequency */}
        <Grid item xs={12} sm={6} md={2}>
          {!otherFrequency && (
            <SearchComboBox
              name={form.medication_frequency.name}
              label={form.medication_frequency.label}
              options={frequencyOptions}
              getValue={(value) => {
                if (value === 'Other') setOtherFrequency(true);
              }}
              sx={{ width: '100%' }}
              multiple={false}
            />
          )}
          {otherFrequency && (
            <TextInputField
              id={form.medication_frequency.name}
              name={form.medication_frequency.name}
              label="Specify frequency"
              sx={{ width: '100%' }}
            />
          )}
        </Grid>

        {/* Route */}
        <Grid item xs={12} sm={6} md={3}>
          <SearchComboBox
            name={form.medication_route.name}
            label={form.medication_route.label}
            options={routeOptions}
            sx={{ width: '100%' }}
            multiple={false}
          />
        </Grid>

        {/* Duration */}
        <Grid item xs={12} sm={6} md={2}>
          <TextInputField
            id={form.medication_duration.name}
            name={form.medication_duration.name}
            label={form.medication_duration.label}
            sx={{ width: '100%' }}
          />
        </Grid>

        {/* Duration Unit */}
        <Grid item xs={12} sm={6} md={2}>
          <SearchComboBox
            name={form.medication_duration_unit.name}
            label={form.medication_duration_unit.label}
            options={durationOptions}
            getValue={(value) => console.log("Selected value:", value)}
            sx={{ width: '100%' }}
            multiple={false}
          />
        </Grid>

        

        {/* Date of Last Taken */}
        <Grid item xs={12} sm={6} md={3}>
          <FormDatePicker
            name={form.medication_date_last_taken.name}
            label={form.medication_date_last_taken.label}
            sx={{ background: 'white', width: '100%' }}
          />
        </Grid>

        {/* Date of Last Prescription */}
        <Grid item xs={12} sm={6} md={3}>
          <FormDatePicker
            name={form.medication_date_of_last_prescription.name}
            label={form.medication_date_of_last_prescription.label}
            sx={{ background: 'white', width: '100%' }}
          />
        </Grid>
        {/* Action Buttons */}
        <Grid 
  item 
  xs={12} 
  sm={12} 
  md={2} 
  sx={{ 
    textAlign: 'center', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center'  // Center both icons horizontally
  }}>
  <IconButton
    disabled={index === 0}
    onClick={() => handleRemoveMedication(index)}
    color="error"
    sx={{ mb: 1 }}  // Add margin bottom to space out the buttons
  >
    <FaMinus />
  </IconButton>
  <IconButton onClick={handleAddMedication} color="primary">
    <FaPlus />
  </IconButton>
</Grid>
      </Grid>
    </WrapperBox>
  ))}
</FormFieldContainerLayout>
      <FormFieldContainerLayout title="Prior/Existing Conditions">
      <Table>
    <TableHead>
      <TableRow>
        <TableCell sx={{ width: '25%', textAlign: 'left' }}>Condition</TableCell>
        <TableCell sx={{ width: '20%', textAlign: 'left' }}>Diagnosis Date</TableCell>
        <TableCell sx={{ width: '10%', textAlign: 'left' }}>On Treatment?</TableCell>
        <TableCell sx={{ width: '30%', textAlign: 'left' }}>Additional Details</TableCell>
        <TableCell sx={{ width: '15%', textAlign: 'left' }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {conditions.map((condition, index) => (
        <TableRow key={index}>
          {/* Condition */}
          <TableCell sx={{ width: '25%', textAlign: 'center' }}>
            <SearchComboBox
              name={form.conditions_name(index).name}
              label=""
              options={commonConditions}
              multiple={false}
              sx={{ width: '100%' }} // Adjust width to fit the cell
            />
          </TableCell>

          {/* Diagnosis Date */}
          <TableCell sx={{ width: '20%', textAlign: 'center' }}>
            <FormDatePicker 
              name={form.conditions_diagnosis_date(index).name}  
              label=""
              sx={{ background: 'white', width: '100%' }}
            />
          </TableCell>

          {/* On Treatment */}
          <TableCell sx={{ width: '10%', textAlign: 'center' }}>
            <Checkbox
              name={form.conditions_on_treatment(index).name}
              sx={{ margin: '0 auto' }} // Center the checkbox
            />
          </TableCell>

          {/* Additional Details */}
          <TableCell sx={{ width: '30%', textAlign: 'center' }}>
            <TextInputField
              id={form.conditions_additional_details(index).name}
              name={form.conditions_additional_details(index).name}
              label=""
              sx={{ width: '100%' }}
              multiline={true}
            />
          </TableCell>

          {/* Action Buttons */}
          <TableCell sx={{ width: '15%', textAlign: 'center' }}>
            <IconButton
              disabled={index === 0}
              onClick={() => handleRemoveCondition(index)}
              color="error"
            >
              <FaMinus />
            </IconButton>
            {index === conditions.length - 1 && (
              <IconButton onClick={handleAddCondition} color="primary">
                <FaPlus />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
      </FormFieldContainerLayout>
      
    </FormikInit>
  );
};
