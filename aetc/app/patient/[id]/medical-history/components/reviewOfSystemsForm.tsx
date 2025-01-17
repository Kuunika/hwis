import React, { useEffect, useState } from "react";
import { FormikInit, MainButton, WrapperBox, FormFieldContainer, TextInputField, FormDatePicker, FormValuesListener, RadioGroupInput, SearchComboBox, UnitInputField, FormFieldContainerLayout, CheckboxesGroup } from "@/components";
import * as yup from "yup";
import LabelledCheckbox from "@/components/form/labelledCheckBox";
import { concepts, durationOptions } from "@/constants";
import { IoTimeOutline } from "react-icons/io5";
import { DateTimePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getDateTime } from "@/helpers/dateTime";
import dayjs, { Dayjs } from 'dayjs';
import { Field, getIn } from "formik";


type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

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

const symptomList = {
  lastMeal: { name: "lastMeal", label: "Date of Last Meal", requiresSite: true },
  events: { name: "events", label: "Events(History of presenting complaints)", requiresSite: true },
  pain: { name: "pain", label: "Pain", requiresSite: true },
  rash: { name: "rash", label: "Rash", requiresSite: true },
  itching: { name: "itching", label: "Itching", requiresSite: true },
  earDischarge: { name: "earDischarge", label: "Ear Discharge", requiresSite: true },
  redEye: { name: "redEye", label: "Red Eye", requiresSite: true },
  dizziness: { name: "dizziness", label: "Dizziness", requiresSite: false },
  excessiveThirst: { name: "excessiveThirst", label: "Excessive Thirst", requiresSite: false },
  painfulEar: { name: "painfulEar", label: "Painful Ear", requiresSite: true },
  poorVision: { name: "poorVision", label: "Poor Vision", requiresSite: true },
  toothache: { name: "toothache", label: "Toothache", requiresSite: true },
  runnyNose: { name: "runnyNose", label: "Runny Nose", requiresSite: false },
  noseBleeding: { name: "noseBleeding", label: "Nose Bleeding", requiresSite: false},
  jointSwelling: { name: "jointSwelling", label: "Joint Swelling", requiresSite: true },
  jointPain: { name: "jointPain", label: "Joint Pain", requiresSite: true },
  deformity: { name: "deformity", label: "Deformity", requiresSite: true },
  fever: { name: "fever", label: "Fever", requiresSite: false },
  nightSweats: { name: "nightSweats", label: "Night Sweats", requiresSite: false },
  weightLoss: { name: "weightLoss", label: "Weight Loss", requiresSite: false },
  heatIntolerance: { name: "heatIntolerance", label: "Heat Intolerance", requiresSite: false },
  coldIntolerance: { name: "coldIntolerance", label: "Cold Intolerance", requiresSite: false },
  bodySwelling: { name: "bodySwelling", label: "Body Swelling", requiresSite: true },
  fatigue: { name: "fatigue", label: "Fatigue", requiresSite: false },
  poisoning: { name: "poisoning", label: "Poisoning", requiresSite: false },
  poisoningIntentional: { name: "intentionalPoisoning", label: "Intentional Poisoning", requiresSite: false },
  ulcerWound: { name: "ulcerWound", label: "Ulcer/Wound", requiresSite: true },
};

const injuryMechanismList = {
  assault: { name: "assault", label: "Assault", subOptions: [{ label: "Physical", value: "Physical" },{ label: "Sexual", value: "Sexual" }]},
  roadTraffic: { name: "roadTraffic", label: "Road Traffic" },
  fall: { name: "fall", label: "Fall" },
  bite: { name: "bite", label: "Bite" },
  gunshot: { name: "gunshot", label: "Gunshot" },
  collapse: { name: "collapse", label: "Collapse of Building" },
  selfInflicted: { name: "selfInflicted", label: "Self-inflicted" },
  burns: { name: "burns", label: "Burns" },
  drowning: { name: "drowning", label: "Drowning" },
  occupationalInjury: { name: "occupationalInjury", label: "Occupational Injury" },
};

const GastrointenstinalOptions = [
  { id: concepts.YellowingOfEyesOrSkin, label: 'Yellowing of eyes or skin' },
  { id: concepts.Nausea, label: 'Nausea' },
  { id: concepts.Dyspepsia, label: 'Dyspepsia' },
  { id: concepts.AbdominalPains, label: 'Abdominal pains' },
  { id: concepts.Vomiting, label: 'Vomiting' },
  { id: concepts.Diarrhoea, label: 'Diarrhoea' },
  { id: concepts.DifficultyInSwallowing, label: 'Difficulty in swallowing' },
  { id: concepts.PainfulSwallowing, label: 'Painful in swallowing' },
  { id: concepts.AbdominalDistension, label: 'Abdominal distension' },
  { id: concepts.BloodyStool, label: 'Bloody stool' },
  { id: concepts.STOOL_INCONTINENCE, label: 'Stool incontinence' },
  { id: concepts.ANAL_SWELLING, label: 'Anal swelling' },
  { id: concepts.ANAL_DISCHARGE, label: 'Anal discharge' }
];

const cardiacRespiratoryOptions = [
  { id: concepts.COUGH, label: 'Cough' },
  { id: concepts.SHORTNESS_OF_BREATH, label: 'Shortness of breath' },
  { id: concepts.HEART_PALPITATIONS, label: 'Heart palpitations' },
  { id: concepts.WHEEZES, label: 'Wheezing' }
];

const nervousSystemOptions = [
  { id: concepts.HEADACHE, label: 'Headache' },
  { id: concepts.CONVULSIONS, label: 'Convulsions' },
  { id: concepts.CONFUSION, label: 'Confusions' },
  { id: concepts.HALLUCINATIONS, label: 'Hallucinations' },
  { id: concepts.ABNORMAL_BEHAVIOUR, label: 'Abnormal behaviour' },
  { id: concepts.TREMOR, label: 'Tremor' },
  { id: concepts.ABNORMAL_GAIT, label: 'Abnormal gait' },
  { id: concepts.NUMBNESS, label: 'Numbness' },
  { id: concepts.NECK_PAINS, label: 'Neck pain' },
  { id: concepts.NECK_STIFFNESS, label: 'Neck stiffness' },
  { id: concepts.WEAKNESS, label: 'Weakness' }
];

const genitourinaryOptions = [
  { id: concepts.FREQUENT_URINATION, label: 'Frequent urination' },
  { id: concepts.PAINFUL_URINATION, label: 'Painful urination' },
  { id: concepts.BLOODY_URINE, label: 'Bloody urine' },
  { id: concepts.ABNORMAL_VAGINAL_DISCHARGE, label: 'Abnormal vaginal discharge' },
  { id: concepts.VAGINAL_BLEEDING, label: 'Vaginal bleeding' },
  { id: concepts.SCROTAL_SWELLING, label: 'Scrotal swelling' },
  { id: concepts.GENITAL_ULCER, label: 'Genital ulcer' },
  { id: concepts.URINARY_RETENTION, label: 'Urinary retention' },
  { id: concepts.URINARY_INCONTINENCE, label: 'Urine incontinence' },
  { id: concepts.ERECTILE_DYSFUNCTION, label: 'Erectile dysfunction' },
  { id: concepts.INFERTILITY, label: 'Infertility' },
  { id: concepts.PROLAPSE, label: 'Prolapse' },
  { id: concepts.OTHER_GENITOURINARY_CONDITION, label: 'Other' }
];

const dateTime = getDateTime();



export const ReviewOfSystemsForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showExtraFields, setShowExtraFields] = useState<any>({});
  const [showTraumaFields, setShowTraumaFields] = useState(false);
  const [showAssaultOptions, setShowAssaultOptions] = useState(false);
  const [selectedMechanism, setSelectedMechanism] = useState<string | null>(null);
  const [genitourinaryOther, setGenitourinaryOther] = useState(false); 
  const [updateSocial, setUpdateSocial]= useState(false); 
  
  const generateValidationSchema = (symptomList: Record<string, any>): yup.ObjectSchema<any> => {
    const shape: Record<string, yup.Schema<any>> = {};
  
    Object.keys(symptomList).forEach((key) => {
      const symptom = symptomList[key];
  
      if (!(key === 'lastMeal' || key === 'events')) {
        if (typeof symptom === 'object') {
          const symptomName = symptom.name;
  
          shape[`${symptomName}Duration`] = yup.string().when(symptomName, (value, schema) => {
            if (formValues[key]) {
              return schema.required(`Duration of ${symptom.label} is required`);
            }
            return schema.notRequired();
          });
  
          if (symptom.requiresSite) {
            shape[`${symptomName}_site`] = yup.string().when(symptomName, (value, schema) => {
              if (formValues[key]) {
                return schema.required(`Please specify the site of ${symptom.label}`);
              }
              return schema.notRequired();
            });
          }
        }
      }
    });
  
    shape['lastMeal'] = yup.date().required('Last meal is required.').max(new Date(), 'Last meal cannot be in the future.');
    shape['events'] = yup.string().required('Events field is required.');
    shape['timeOfInjury'] = yup.date().required('Time of injury is required.');
  
    // Update for object validation
    shape['Gastrointenstinal_history'] = yup.array().of(
      yup.object({
        id: yup.string().required('ID is required for Gastrointestinal history.'),
        label: yup.string().required('Label is required for Gastrointestinal history.'),
      })
    );
  
    shape['Cardiac/Respiratory history'] = yup.array().of(
      yup.object({
        id: yup.string().required('ID is required for Cardiac/Respiratory history.'),
        label: yup.string().required('Label is required for Cardiac/Respiratory history.'),
      })
    );
  
    shape['Nervous system history'] = yup.array().of(
      yup.object({
        id: yup.string().required('ID is required for Nervous system history.'),
        label: yup.string().required('Label is required for Nervous system history history.'),
      })
    );
  
    shape['genitourinaryHistory'] = yup
      .array()
      .of(    yup.object({
        id: yup.string().required('ID is required for genitourinary history.'),
        label: yup.string().required('Label is required for genitourinary history.'),
      })
    );
  
    return yup.object().shape(shape);
  };

  const schema = generateValidationSchema(symptomList);

  const initialValues = {

    pain: false,
    painDuration: "",
    pain_site: "",
    rash: false,
    rashDuration: "",
    rash_site: "",
    itching: false,
    itchingDuration: "",
    itching_site: "",
    earDischarge: false,
    earDischargeDuration: "",
    earDischarge_site: "",
    redEye: false,
    redEyeDuration: "",
    redEye_site: "",
    dizziness: false,
    dizzinessDuration: "",
    excessiveThirst: false,
    excessiveThirstDuration: "",
    painfulEar: false,
    painfulEarDuration: "",
    painfulEar_site: "",
    poorVision: false,
    poorVisionDuration: "",
    poorVision_site: "",
    toothache: false,
    toothacheDuration: "",
    toothache_site: "",
    runnyNose: false,
    runnyNoseDuration: "",
    noseBleeding: false,
    noseBleedingDuration: "",
    jointSwelling: false,
    jointSwellingDuration: "",
    jointSwelling_site: "",
    jointPain: false,
    jointPainDuration: "",
    jointPain_site: "",
    deformity: false,
    deformityDuration: "",
    deformity_site: "",
    fever: false,
    feverDuration: "",
    nightSweats: false,
    nightSweatsDuration: "",
    weightLoss: false,
    weightLossDuration: "",
    heatIntolerance: false,
    heatIntoleranceDuration: "",
    coldIntolerance: false,
    coldIntoleranceDuration: "",
    bodySwelling: false,
    bodySwellingDuration: "",
    bodySwelling_site: "",
    fatigue: false,
    fatigueDuration: "",
    poisoning: false,
    poisoningDuration: "",
    poisoningIntentional: false,
    poisoningIntentionalDuration: "",
    ulcerWound: false,
    ulcerWoundDuration: "",
    ulcerWound_site: "",
    wasInjured: false,
    timeOfInjury: dayjs(dateTime),
    showSocialHistory: false
  }



  useEffect(() => {
    const updatedShowExtraFields: Record<string, boolean> = {};
  
    Object.keys(symptomList).forEach((key) => {
      if(key!='lastMeal' && key!='events')
      updatedShowExtraFields[key] = !!formValues[key];
    });
  
    setShowExtraFields(updatedShowExtraFields);

    setShowTraumaFields(!!formValues['wasInjured']);

    setShowAssaultOptions((formValues['mechanism'] || []).length > 0);
  
    const socialHistory = formValues['showSocialHistory'];
    setUpdateSocial(!!socialHistory);
    
  }, [formValues, symptomList, formValues['showSocialHistory']]);


    const handleSubmit = async () => {
    await schema.validate(formValues)

    onSubmit(formValues);
   };

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButton={false}
    >
      <FormValuesListener getValues={setFormValues} />
      <FormFieldContainer direction="row">
        <FormDatePicker
          label={symptomList.lastMeal.label}
          name={symptomList.lastMeal.name}
          sx={{ background: 'white' }}
        />
          <div style={{ color: "red", fontSize: "0.875rem" }}>
                    <ErrorMessage
                      name='lastMeal'
                    />
                  </div>
      </FormFieldContainer>

      <TextInputField
        id={symptomList.events.name}
        label={symptomList.events.label}
        name={symptomList.events.name}
        placeholder="e.g., Started with mild abdominal pain 3 days ago..."
        multiline
        rows={4}
      />
                  <div style={{ color: "red", fontSize: "0.875rem" }}>
                    <ErrorMessage
                      name={symptomList.events.name}
                    />
                  </div>

      <FormFieldContainer direction="row">
        <WrapperBox sx={{ bgcolor: "white", padding: "2ch", mb: "2ch", width: '100%' }}>
        <h3>General History</h3>
          {Object.keys(symptomList).map((key) => {
            const typedKey = key as keyof typeof symptomList;
            const symptom = symptomList[typedKey];

            return (
              <div key={typedKey}>
                {typedKey !== "poisoningIntentional" && typedKey !== "lastMeal" && typedKey !== "events" &&(
                <LabelledCheckbox
                    name={symptomList[typedKey].name}
                    label={symptomList[typedKey].label}
                    checked={formValues[typedKey]}
                  />
           
          )}
                {/* Show extra fields if the smptom is selected */}
                {showExtraFields[typedKey]&& typedKey !== "poisoningIntentional" && (
                  <>
               
                      <>
                      <UnitInputField
                      id={`${typedKey}Duration`}
                      name={`${typedKey}Duration`}
                      unitName={`${typedKey}DurationUnit`}
                      label="Duration"
                      unitOptions={durationOptions}
                      placeholder="e.g. 7"
                      inputIcon={<IoTimeOutline />}
                    />
             
                      </>
               
    
                    {/* Show 'Specify site' for symptoms that require it */}
                    {symptom.requiresSite  && typedKey !== "poisoning" && (
                      <TextInputField
                        id={`${symptom.name}_site`}
                        label="Specify Site"
                        name={`${symptom.name}_site`}
                        placeholder="Specify the site"
                      />
                    )}

                    {typedKey == "poisoning" && (
                     <LabelledCheckbox
                     name="poisoningIntentional"
                     label={symptomList["poisoningIntentional"].label}
                     checked={formValues["poisoningIntentional"] || false}
                   />
                    )}
                  </>
                )}

                
              </div>
            );
          })}

<h3>Trauma/Injury History</h3>
          <LabelledCheckbox
            name="wasInjured"
            label="Was the patient injured?"
            checked={formValues.wasInjured}
          />
          {showTraumaFields && (
            <>
            <FormFieldContainer direction="row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Date and Time of Injury"
              value={formValues['timeOfInjury']}
              onChange={(newValue: any) =>  setFormValues((prev: any) => ({
                ...prev,
                'timeOfInjury': newValue,
              }))}
              sx={{mb:'1ch', mt:'1ch'}}
            />
            </LocalizationProvider>
            </FormFieldContainer>
              <div>
                <h4>Mechanism of Injury</h4>
                {Object.keys(injuryMechanismList).map((key) => {
                  const mechanism = injuryMechanismList[key as keyof typeof injuryMechanismList];

                  if (!selectedMechanism || selectedMechanism === key) {
                    return (
                      <LabelledCheckbox
                        name={"mechanism"}
                        key={key}
                        label={mechanism.label}
                        checked={formValues[mechanism.name]}
                      />
                    );
                  }
                  return null;
                })}

                {showAssaultOptions && (
                  <div style={{ marginLeft: "1em" }}>
                     <RadioGroupInput
                      name="assaultType"
                      label="Type of assault"
                      options={injuryMechanismList.assault.subOptions}
                      row={true}
                      />
                  </div>
                )}
              </div>


              <LabelledCheckbox
              name={"lostConsciousness"}
                label="Did the patient lose consciousness on the scene?"
                checked={formValues.lostConsciousness || false}
              />
            </>
          )}


        </WrapperBox>
      </FormFieldContainer>
      <FormFieldContainer direction="row">
        <SearchComboBox
        name="Gastrointenstinal_history"
        label="Gastrointestinal history"
        options={GastrointenstinalOptions}
        multiple={true}
        />
        </FormFieldContainer>
<FormFieldContainer direction="row">
      <SearchComboBox
        name="Cardiac/Respiratory history"
        label="Cardiac/Respiratory history"
        options={cardiacRespiratoryOptions}
        multiple={true}
        />
</FormFieldContainer>
<FormFieldContainer direction="row">
<SearchComboBox
        name="Nervous system history"
        label="Nervous system history"
        options={nervousSystemOptions}
        multiple={true}
        />
</FormFieldContainer>
<FormFieldContainer direction="row">

<SearchComboBox
        name="genitourinaryHistory"
        label="Genitourinary history"
        options={genitourinaryOptions}
        multiple={true}
        getValue={(values) => {const other = values.some((value:any) => value.label === genitourinaryOptions[12].label);
          if (other) {
            setGenitourinaryOther(true);
  
          }
        }}/>
        
        {genitourinaryOther &&(
          <TextInputField
          id="Other_Genitourinary_condition"
          name="Other_Genitourinary_condition"
          label="Specify condition"
           sx={{marginLeft:'2ch'}}
          />
        )}
      </FormFieldContainer>
      

        <FormFieldContainer direction="column">
        <LabelledCheckbox
                        name= "showSocialHistory"
                        label='Update social history?'
                        checked={formValues['showSocialHistory']||false}
                      />
        {updateSocial && (<>
        <h3 style={{marginTop:'2ch', marginBottom:'1ch'}}>Social History</h3>
        <RadioGroupInput
            row={true}
            name='occupation'
            label='Occupation'
            options={[
                { label: "Working", value: "working" },
                { label: "Business", value: "business" },
                { label: "Unemployed", value: "unemployed" },
                { label: "Self Employed", value: "selfemployed" },
                { label: "Student", value: "student" },
                { label: "House Wife", value: "housewife" },
                { label: "Unknown", value: "unknown" },
            ]}
            sx={{mb:'1ch'}}
        />
          <CheckboxesGroup getValue={
            (value: Array<any>) => {
              
            }
          } name='socialDetails' options={[
            { label: "Smoker", value: "smoking" },
            { label: "Drinker", value: "alcohol" },
          ]}
          />
               <RadioGroupInput
               sx={{mt:'1ch'}}
            row={true}
            name='maritalStatus'
            label='Marital Status'
            options={[
                { label: "Single", value: "single" },
                { label: "Married", value: "married" },
                { label: "Separated", value: "separated" },
                { label: "Widowed", value: "widow/widower" },
                { label: "Divorced", value: "divorced" },
                { label: "Unknown", value: "unknown" },

            ]}
        />
        <TextInputField
           id="travelDetails"
           name="travelDetails"
           label="Travel Details"
           multiline
           rows={4}
          /></>)}
                </FormFieldContainer>
      

      <WrapperBox>
          <MainButton variant="secondary" title="Previous" type="button" onClick={onSkip} sx={{ flex: 1, marginRight: '8px' }} />
          <MainButton onClick={handleSubmit} variant="primary" title="Next" type="submit" sx={{ flex: 1 }} />
      </WrapperBox>
    </FormikInit>
  );
};