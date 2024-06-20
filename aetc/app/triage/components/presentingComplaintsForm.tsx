import { Box } from "@mui/material";
import React, { useState } from "react";
import { SearchComboBox, FormikInit, MainButton } from "@/components";
import * as Yup from "yup";

import { getInitialValues, notify } from "@/helpers";
import { NO, YES, concepts } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
  setTriageResult: (triage: any, name: string) => void;
  triageResult: string;
};
const form = {
  complaints: {
    name: concepts.COMPLAINTS,
    label: "Complaints",
  },
};

const schema = Yup.object().shape({
  [form.complaints.name]: Yup.array().required().label(form.complaints.label),
});

const initialValues = getInitialValues(form);

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
  // { id: "Other", label: "Other" },
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



export const PresentingComplaintsForm = ({ onSubmit, setTriageResult }: Prop) => {
  const handleValueChange = (values: Array<any>) => {
    const triage = ['Carbon Monoxide Poisoning', 'Injury Major Trauma Penetrating', 'Poisoning', 'Vomiting blood']

    triage.forEach(triage => {
      const found = values.find(v => {
        return v.id == triage
      });

      if (found) {
        setTriageResult("red", triage)
      } else {
        setTriageResult("", triage)
      }
    })
  }
  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={false}
      submitButtonText="next"
    >
      <SearchComboBox
        getValue={handleValueChange}
        name={form.complaints.name}
        label={form.complaints.label}
        options={presentingComplaints}
      />

      <MainButton sx={{ m: 0.5 }} title={"next"} type="submit" onClick={() => { }} />
    </FormikInit>
  );
}; 