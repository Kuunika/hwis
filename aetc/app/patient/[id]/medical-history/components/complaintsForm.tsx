'use client';
import { useState } from "react";
import DynamicFormList from "@/components/form/dynamicFormList";; // Import the updated component
import {
  FormikInit,
  FormValuesListener,
  MainButton,
  SearchComboBox,
  UnitInputField,
  WrapperBox,
} from "@/components";
import * as Yup from "yup";
import { IoTimeOutline } from "react-icons/io5";
import { concepts, durationOptions } from "@/constants";
import { FieldArray } from "formik";

// Define the structure of a complaint
type Complaint ={
  complaint: string;
  duration: number;
  duration_unit: string;
}


const complaintsTemplate: Complaint = {
  complaint: "",
  duration: 0,
  duration_unit: ""
}
type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };

const presentingComplaints = [
  { id: concepts.ASCITES, label: "Ascites" },
  { id: concepts.SHIVERING, label: "Shivering" },
  { id: concepts.ABDOMINAL_DISTENSION, label: "Abdominal distension" },
  { id: concepts.ABDOMINAL_MASS, label: "Abdominal mass" },
  { id: concepts.ABNORMAL_BIZARRE_BEHAVIOUR, label: "Abnormal bizzarre behaviour" },
  { id: concepts.ABNORMAL_LABORATORY_VALUES, label: "Abnormal laboratory values" },
  { id: concepts.ALLERGIC_REACTION, label: "Allergic reaction" },
  { id: concepts.AMPUTATION, label: "Amputation" },
  { id: concepts.ANIMAL_BITE_DOG, label: "Animal Bite Dog" },
  { id: concepts.ANIMAL_BITE_HUMAN, label: "Animal Bite Human" },
  { id: concepts.ANIMAL_BITE_HYENA, label: "Animal Bite Hyena" },
  { id: concepts.ANIMAL_BITE_CAT, label: "Animal Bite Cat" },
  // { id: concepts.ANIMAL_BITE_OTHER, label: "Other (specify)" },
  { id: concepts.ANXIETY, label: "Anxiety" },
  { id: concepts.APHASIA, label: "Aphasia (Unable to talk)" },
  { id: concepts.BLEEDING_PROBLEM, label: "Bleeding problem" },
  { id: concepts.BLOOD_AND_BODY_FLUID_EXPOSURE, label: "Blood and body fluid exposure" },
  { id: concepts.BLOOD_IN_STOOL, label: "Blood in stool" },
  { id: concepts.BURN_INJURY, label: "Burn injury" },
  { id: concepts.CARBON_MONOXIDE_POISONING, label: "Carbon monoxide poisoning" },
  // { id: concepts.CARDIAC_ARREST, label: "Cardiac arrest" },
  { id: concepts.CATHETER_CHANGE, label: "Catheter change (urethral)" },
  { id: concepts.COLD_EXPOSURE, label: "Cold exposure" },
  { id: concepts.CONFUSION, label: "Confusion" },
  { id: concepts.CONSTIPATION, label: "Constipation" },
  { id: concepts.CONVULSION_SEIZURE, label: "Convulsion/seizure" },
  { id: concepts.COOL_PULSELESS_LIMB, label: "Cool pulseless limb" },
  { id: concepts.COUGH, label: "Cough" },
  { id: concepts.DEHYDRATION, label: "Dehydration" },
  { id: concepts.DENTAL, label: "Dental" },
  { id: concepts.DIARRHOEA, label: "Diarrhoea" },
  { id: concepts.DIPLOPIA, label: "Diplopia" },
  // { id: concepts.DIRECT_REFERRAL_FOR_OTHER_SPECIALTY, label: "Direct referral for other specialty" },
  { id: concepts.DIZZINESS, label: "Dizziness" },
  { id: concepts.DRESSING_CHANGE, label: "Dressing change" },
  { id: concepts.DROWNING, label: "Drowning" },
  { id: concepts.DRUG_ADMINISTRATION, label: "Drug administration" },
  { id: concepts.DYSPHAGIA, label: "Dysphagia (difficulty swallowing)" },
  { id: concepts.DYSURIA, label: "Dysuria (Painful urination)" },
  { id: concepts.EAR_DISCHARGE, label: "Ear discharge" },
  { id: concepts.EARACHE, label: "Earache" },
  { id: concepts.ELECTRIC_SHOCK, label: "Electric shock" },
  { id: concepts.EPISTAXIS, label: "Epistaxis (Nose bleed)" },
  { id: concepts.EXPOSURE_TO_COMMUNICABLE_DISEASES, label: "Exposure to communicable diseases" },
  { id: concepts.EXPOSURE_TO_GAS, label: "Exposure to gas" },
  { id: concepts.EYE_DISCHARGE, label: "Eye discharge" },
  { id: concepts.FAINTING_SYNCOPE_COLLAPSE, label: "Fainting/syncope/collapse" },
  { id: concepts.FEVER, label: "Fever" },
  { id: concepts.FOCAL_NUMBNESS, label: "Focal numbness" },
  { id: concepts.FOCAL_WEAKNESS, label: "Focal weakness" },
  { id: concepts.FOR_SICK_LEAVE, label: "For sick leave" },
  { id: concepts.FOREIGN_BODY_EAR, label: "Foreign body ear" },
  { id: concepts.FOREIGN_BODY_EYE, label: "Foreign body eye" },
  { id: concepts.FOREIGN_BODY_NOSE, label: "Foreign body nose" },
  { id: concepts.FOREIGN_BODY_OESOPHAGEAL_OR_ORAL, label: "Foreign body oesophageal or oral" },
  { id: concepts.FOREIGN_BODY_RECTUM, label: "Foreign body rectum" },
  { id: concepts.FOREIGN_BODY_RESPIRATORY, label: "Foreign body respiratory" },
  { id: concepts.FOREIGN_BODY_THROAT, label: "Foreign body throat" },
  { id: concepts.FOREIGN_BODY_VAGINA, label: "Foreign body vagina" },
  { id: concepts.GENERAL_BODY_WEAKNESS, label: "General body weakness" },
  { id: concepts.GENITAL_DISCHARGE, label: "Genital discharge" },
  { id: concepts.GENITAL_LESION, label: "Genital lesion" },
  { id: concepts.HAEMATURIA, label: "Haematuria (bloody urine)" },
  { id: concepts.HAEMOPTYSIS, label: "Haemoptysis (Coughing blood)" },
  { id: concepts.HAEMORRHOID, label: "Haemorrhoid" },
  { id: concepts.HEADACHE, label: "Headache" },
  { id: concepts.HEART_PALPITATIONS, label: "Heart palpitations" },
  { id: concepts.HEAVY_MENSTRUATION, label: "Heavy menstruation" },
  { id: concepts.HICCUPS, label: "Hiccups" },
  { id: concepts.HIGH_BLOOD_GLUCOSE, label: "High blood glucose" },
  { id: concepts.HIGH_BLOOD_PRESSURE, label: "High blood pressure" },
  { id: concepts.HYPERGLYCAEMIA, label: "Hyperglycaemia" },
  { id: concepts.HYPERTENSION, label: "Hypertension" },
  { id: concepts.HYPERVENTILATION, label: "Hyperventilation" },
  { id: concepts.HYPOGLYCAEMIA, label: "Hypoglycaemia" },
  { id: concepts.HYPOTHERMIA, label: "Hypothermia" },
  { id: concepts.IMAGING_TESTS, label: "Imaging tests" },
  { id: concepts.INJURY_ABDOMEN_BLUNT, label: "Injury abdomen blunt" },
  { id: concepts.INJURY_ABDOMEN_PENETRATING, label: "Injury abdomen penetrating" },
  { id: concepts.INJURY_ANAL_OR_RECTAL, label: "Injury anal or rectal" },
  { id: concepts.INJURY_CHEMICAL_EXPOSURE, label: "Injury chemical exposure" },
  { id: concepts.INJURY_CHEST_BLUNT, label: "Injury chest blunt" },
  { id: concepts.INJURY_CHEST_PENETRATING, label: "Injury chest penetrating" },
  { id: concepts.INJURY_EAR, label: "Injury ear" },
  { id: concepts.INJURY_ELECTRICAL, label: "Injury electrical" },
  { id: concepts.INJURY_EYE, label: "Injury eye" },
  { id: concepts.INJURY_FACE, label: "Injury face" },
  { id: concepts.INJURY_GENITAL, label: "Injury genital" },
  { id: concepts.INJURY_HEAD, label: "Injury head" },
  { id: concepts.INJURY_LOWER_EXTREMITY, label: "Injury lower extremity" },
  { id: concepts.INJURY_MAJOR_TRAUMA_BLUNT, label: "Injury major trauma blunt" },
  { id: concepts.INJURY_MAJOR_TRAUMA_PENETRATING, label: "Injury Major trauma penetrating" },
  { id: concepts.INJURY_NECK, label: "Injury neck" },
  { id: concepts.INJURY_NOSE, label: "Injury nose" },
  { id: concepts.INJURY_SPINE, label: "Injury spine" },
  { id: concepts.INJURY_UPPER_EXTREMITY, label: "Injury upper extremity" },
  { id: concepts.INSOMNIA, label: "Insomnia (difficulty sleeping)" },
  { id: concepts.INTOXICATION, label: "Intoxication" },
  { id: concepts.JAUNDICE, label: "Jaundice" },
  { id: concepts.LOSS_OF_APPETITE, label: "Loss of appetite (Anorexia)" },
  { id: concepts.LOSS_OF_CONSCIOUSNESS, label: "Loss of consciousness" },
  { id: concepts.LOSS_OF_HEARING, label: "Loss of hearing" },
  { id: concepts.LUMP_MASS, label: "Lump/mass" },
  { id: concepts.MEDICAL_DEVICE_PROBLEM, label: "Medical device problem" },
  { id: concepts.MUSCLE_CRAMPS, label: "Muscle Cramp s" },
  { id: concepts.NASAL_CONGESTION, label: "Nasal congestion" },
  { id: concepts.NAUSEA, label: "Nausea" },
  { id: concepts.NOSE_BLEED, label: "Nose bleed" },
  { id: concepts.NUMBNESS_PARASTHESIAS, label: "Numbness/Parasthesias" },
  { id: concepts.ODYNOPHAGIA, label: "Odynophagia (Painful swallowing)" },
  { id: concepts.OEDEMA_BILATERAL_LEG, label: "Oedema bilateral leg (Leg swelling)" },
  { id: concepts.OEDEMA_GENERALISED, label: "Oedema generalised (General body swelling)" },
  { id: concepts.OLIGURIA, label: "Oliguria (Reduced urine output" },
  { id: concepts.OTHER_CONDITION, label: "Other" },
  // { id: concepts.OTHER_SPECIFY, label: "Specify" },
  { id: concepts.PAIN_ABDOMINAL, label: "Pain abdominal" },
  { id: concepts.PAIN_BACK, label: "Pain back" },
  { id: concepts.PAIN_CHEST, label: "Pain chest" },
  { id: concepts.PAIN_FLANK, label: "Pain flank" },
  { id: concepts.PAIN_GROIN, label: "Pain groin" },
  { id: concepts.PAIN_LOWER_EXTREMITY, label: "Pain lower extremity" },
  { id: concepts.PAIN_NECK, label: "Pain neck" },
  { id: concepts.PAIN_ON_THE_FACE, label: "Pain on the face" },
  { id: concepts.PAIN_RECTAL_OR_PERIANAL, label: "Pain rectal or perianal" },
  { id: concepts.PAIN_SCROTAL, label: "Pain scrotal" },
  { id: concepts.PAIN_UPPER_EXTREMITY, label: "Pain upper extremity" },
  { id: concepts.PAINFUL_EAR, label: "Painful ear" },
  { id: concepts.PAINFUL_EYE, label: "Painful eye" },
  { id: concepts.PAINFUL_URINATION, label: "Painful urination (Dysuria)" },
  { id: concepts.PATIENT_SAFETY_CONCERN, label: "Patient safety concern" },
  { id: concepts.PER_VAGINAL_BLEEDING, label: "Per vaginal bleeding" },
  { id: concepts.PER_VAGINAL_BLEEDING_WITH_AMENORRHOEA, label: "Per vaginal bleeding with amenorrhoea" },
  { id: concepts.PHOTOPHOBIA, label: "Photophobia" },
  { id: concepts.POISONING, label: "Poisoning" },
  { id: concepts.POLYURIA, label: "Polyuria" },
  { id: concepts.POSTOPERATIVE_COMPLICATION, label: "Postoperative complication" },
  { id: concepts.PROLONGED_MENSTRUATION, label: "Prolonged menstruation" },
  { id: concepts.PRURITUS, label: "Pruritus (Itching)" },
  { id: concepts.RASH, label: "Rash" },
  { id: concepts.RED_EYE, label: "Red eye" },
  // { id: concepts.RESPIRATORY_ARREST, label: "Respiratory arrest" },
  { id: concepts.RING_REMOVAL, label: "Ring removal" },
  { id: concepts.SELF_HARM, label: "Self harm" },
  { id: concepts.SEXUAL_ASSAULT, label: "Sexual assault" },
  { id: concepts.SHORTNESS_OF_BREATH, label: "Shortness of breath" },
  { id: concepts.SLEEP_DISTURBANCE, label: "Sleep disturbance" },
  { id: concepts.SOCIAL_PROBLEM, label: "Social problem" },
  { id: concepts.SORE_THROAT, label: "Sore throat" },
  { id: concepts.STING_BEE, label: "Sting Bee" },
  { id: concepts.STING_SCORPION, label: "Sting Scorpion" },
  { id: concepts.STING_WASP, label: "Sting Wasp" },
  // { id: concepts.STING_OTHER_SPECIFY, label: "Other specify" },
  { id: concepts.STRIDOR, label: "Stridor" },
  { id: concepts.SUBSTANCE_WITHDRAWAL_ALCOHOL, label: "Substance Withdrawal Alcohol" },
  { id: concepts.SUBSTANCE_WITHDRAWAL_OPIOID, label: "Substance Withdrawal Opioid" },
  { id: concepts.SUBSTANCE_WITHDRAWAL_BENZODIAZEPINE, label: "Substance Withdrawal benzodiazepine" },
  // { id: concepts.SUBSTANCE_WITHDRAWAL_OTHER_SPECIFY, label: "Other specify" },
  { id: concepts.SURGICAL_ADMISSION_FOR_ELECTIVE_SURGERY, label: "Surgical admission for elective surgery" },
  { id: concepts.SUSPECTED_BOWEL_OBSTRUCTION, label: "Suspected bowel obstruction" },
  { id: concepts.SUTURE_REMOVAL, label: "Suture removal" },
  { id: concepts.SWELLING_GROIN, label: "Swelling groin" },
  { id: concepts.SWELLING_JOINT, label: "Swelling joint" },
  { id: concepts.SWELLING_NECK, label: "Swelling neck" },
  { id: concepts.SWELLING_PENILE, label: "Swelling penile" },
  { id: concepts.SWELLING_PERI_ORBITAL, label: "Swelling peri orbital" },
  { id: concepts.SWELLING_SCROTAL, label: "Swelling scrotal" },
  { id: concepts.TINNITUS, label: "Tinnitus (Ringing in the ears)" },
  { id: concepts.TREMOR, label: "Tremor" },
  { id: concepts.UNABLE_TO_SEE, label: "Unable to see" },
  { id: concepts.URINARY_RETENTION, label: "Urinary retention" },
  { id: concepts.VAGINAL_DISCHARGE, label: "Vaginal discharge" },
  { id: concepts.VERTIGO, label: "Vertigo" },
  { id: concepts.VIOLENT_BEHAVIOUR, label: "Violent behaviour" },
  { id: concepts.VISUAL_DISTURBANCE, label: "Visual disturbance" },
  { id: concepts.VOMITING, label: "vomiting" },
  { id: concepts.VOMITING_BLOOD, label: "Vomiting blood" },
  { id: concepts.WALKING_DIFFICULTY, label: "Walking difficulty (Gait disturbance or ataxia)" },
  { id: concepts.WHEEZING, label: "Wheezing" },
  { id: concepts.WOUND_REVIEW, label: "Wound review" },
  { id: concepts.PAIN_SHOULDER, label: "Pain shoulder" },
  { id: concepts.PAIN_LOWER_ABDOMEN, label: "Pain lower abdomen (suprapubic)" },
  { id: concepts.WOUND_DISCHARGE, label: "Wound discharge" },
  { id: concepts.NOT_PASSING_STOOLS, label: "Not passing stools" },
  { id: concepts.FOOD_POISONING, label: "Food poisoning" }
  ];



export const ComplaintsForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
  const [value, setValue] = useState<number | string>("");
 

  // Function to access field names dynamically
  const complaintsFormConfig = {
    complaints_name: (index: number) => ({ name: `complaints[${index}].complaint`, label:'Symptom' }),
    complaints_duration: (index: number) => ({ name: `complaints[${index}].duration`, label:'Duration' }),
    complaints_duration_units: (index: number) => ({ name: `complaints[${index}].duration_unit`, label:'Unit' }),
  };

  const initialValues = {
    complaints: [complaintsTemplate],
  };

  const schema = Yup.object().shape({
    complaints: Yup.array().of(
      Yup.object().shape({
        complaint: Yup.string().required("Complaint is required"),
        duration: Yup.string().required("Duration is required"),
        duration_unit: Yup.string().required("Duration unit is required"),
      })
    ),
  });

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  return (
    <FormikInit
        validationSchema={schema}
        initialValues={ initialValues }
        onSubmit={handleSubmit}
        enableReinitialize={true}
        submitButtonText="Submit"
        submitButton={false}
      >
        {({ values, setFieldValue }) => (
        <>
        <FormValuesListener getValues={setFormValues} />
          <FieldArray name="complaints">
            {({ push, remove }) => (
              <DynamicFormList
                items={values.complaints}
                setItems={(newItems) => setFieldValue("complaints", newItems)}
                newItem={complaintsTemplate}
                renderFields={(item, index) => (
                  <>
            {/* Complaint Name Field */}
            <SearchComboBox
              name={complaintsFormConfig.complaints_name(index).name}
              label={complaintsFormConfig.complaints_name(index).label}
              options={presentingComplaints}
              multiple={false}
              sx={{ width: '100%' }}
            />
          
          {/* Duration and Unit Field */}
          <UnitInputField
            id={complaintsFormConfig.complaints_duration(index).name}
            name={complaintsFormConfig.complaints_duration(index).name}
            unitName={complaintsFormConfig.complaints_duration_units(index).name}
            label={complaintsFormConfig.complaints_duration(index).label}
            unitOptions={durationOptions}
            placeholder="e.g., 3"
            inputIcon={<IoTimeOutline/>} // Optional icon
          />
          </>
          )}
        />
          )}
      </FieldArray>
          <WrapperBox sx={{mt:'2ch'}}>
              <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit}/>
            <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
          </WrapperBox>
          </>
    )}
    </FormikInit>
  );
};

export default ComplaintsForm;