import React, { useState } from "react";
import { FormikInit, MainButton, WrapperBox, FormFieldContainer, TextInputField, FormDatePicker, FormValuesListener, RadioGroupInput, SearchComboBox } from "@/components";
import * as yup from "yup";
import LabelledCheckbox from "@/components/form/labelledCheckBox";
import { concepts } from "@/constants";

type Prop = {
  onSubmit: (values: any) => void;
  onSkip: () => void;
};

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
  ulcerWound: { name: "ulcerOrWound", label: "Ulcer/Wound", requiresSite: true },
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
  { id: 'YellowingOfEyesOrSkin', label: 'Yellowing of eyes or skin' },
  { id: 'Nausea', label: 'Nausea' },
  { id: 'Dyspepsia', label: 'Dyspepsia' },
  { id: 'AbdominalPains', label: 'Abdominal pains' },
  { id: 'Vomiting', label: 'Vomiting' },
  { id: 'Diarrhoea', label: 'Diarrhoea' },
  { id: 'DifficultyInSwallowing', label: 'Difficulty in swallowing' },
  { id: 'PainfulSwallowing', label: 'Painful in swallowing' },
  { id: 'AbdominalDistension', label: 'Abdominal distension' },
  { id: 'BloodyStool', label: 'Bloody stool' },
  { id: 'StoolIncontinence', label: 'Stool incontinence' },
  { id: 'AnalSwelling', label: 'Anal swelling' },
  { id: 'AnalDischarge', label: 'Anal discharge' }
];

const cardiacRespiratoryOptions = [
  { id: 'Cough', label: 'Cough' },
  { id: concepts.PAIN_CHEST, label: 'Chest pain' },
  { id: 'ShortnessOfBreath', label: 'Shortness of breath' },
  { id: 'HeartPalpitations', label: 'Heart palpitations' },
  { id: 'Wheezing', label: 'Wheezing' }
];

const nervousSystemOptions = [
  { id: concepts.HEADACHE, label: 'Headache' },
  { id: 'Convulsions', label: 'Convulsions' },
  { id: 'Confusions', label: 'Confusions' },
  { id: 'Hallucinations', label: 'Hallucinations' },
  { id: 'AbnormalBehaviour', label: 'Abnormal behaviour' },
  { id: 'Tremor', label: 'Tremor' },
  { id: 'AbnormalGait', label: 'Abnormal gait' },
  { id: 'Numbness', label: 'Numbness' },
  { id: 'NeckPain', label: 'Neck pain' },
  { id: 'NeckStiffness', label: 'Neck stiffness' },
  { id: 'Weakness', label: 'Weakness' }
];

const genitourinaryOptions = [
  { id: 'FrequentUrination', label: 'Frequent urination' },
  { id: 'PainfulUrination', label: 'Painful urination' },
  { id: 'BloodyUrine', label: 'Bloody urine' },
  { id: 'AbnormalVaginalDischarge', label: 'Abnormal vaginal discharge' },
  { id: 'VaginalBleeding', label: 'Vaginal bleeding' },
  { id: 'ScrotalSwelling', label: 'Scrotal swelling' },
  { id: 'GenitalUlcer', label: 'Genital ulcer' },
  { id: 'UrinaryRetention', label: 'Urinary retention' },
  { id: 'UrineIncontinence', label: 'Urine incontinence' },
  { id: 'ErectileDysfunction', label: 'Erectile dysfunction' },
  { id: 'Infertility', label: 'Infertility' },
  { id: 'Prolapse', label: 'Prolapse' },
  { id: 'Other', label: 'Other' }
];

export const ReviewOfSystemsForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showExtraFields, setShowExtraFields] = useState<any>({});
  const [showTraumaFields, setShowTraumaFields] = useState(false);
  const [showAssaultOptions, setShowAssaultOptions] = useState(false);
  const [selectedMechanism, setSelectedMechanism] = useState<string | null>(null);
  const [genitourinaryOther, setGenitourinaryOther] = useState(false); 

  const schema = yup.object().shape({
    pain: yup.boolean(),
    duration: yup.string().when("pain", (pain, schema) =>
      pain ? schema.required("Please specify the duration of pain") : schema
    ),
    specifySite: yup.string().when("pain", (pain, schema) =>
      pain ? schema.required("Please specify the site of pain") : schema
    ),
  });

  const initialValues = {
    pain: false,
    duration: "",
    specifySite: "",
    genitourinaryHistory:"",
  };

  const handleSymptomChange = (e: any, symptom: string) => {
    const isChecked = e.target.checked;
    
    // Update visibility for extra fields based on checkbox state
    setShowExtraFields((prev: any) => ({
      ...prev,
      [symptom]: isChecked,
    }));
  
    // Update form values only for the checkbox state, preserving other fields
    setFormValues((prev: any) => ({
      ...prev,
      [symptom]: isChecked,
      ...(isChecked ? {} : { [`${symptom}Date`]: "", [`${symptom}_site`]: "" }) // Clear extra fields if unchecked
    }));
  
    // Special handling for trauma section
    if (symptom === 'wasInjured') setShowTraumaFields(isChecked);
  };

  const handleTraumaMechanismChange = (e: React.ChangeEvent<HTMLInputElement>, mechanism: string) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedMechanism(mechanism); // Set the selected mechanism
      setShowAssaultOptions(mechanism === "assault"); // Show assault options if "assault" is selected
    } else {
      setSelectedMechanism(null); // Clear if unchecked
      setShowAssaultOptions(false); // Hide assault options if deselected
    }
    setFormValues((prev: any) => ({
      ...prev,
      [mechanism]: isChecked,
    }));
  };


  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={false}
    >
      <FormValuesListener getValues={setFormValues} />
      <FormFieldContainer direction="row">
        <FormDatePicker
          label={symptomList.lastMeal.label}
          name={symptomList.lastMeal.name}
          sx={{ background: 'white' }}
        />
      </FormFieldContainer>

      <TextInputField
        id={symptomList.events.name}
        label={symptomList.events.label}
        name={symptomList.events.name}
        placeholder="e.g., Started with mild abdominal pain 3 days ago..."
        multiline
        rows={4}
      />

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
                    label={symptomList[typedKey].label}
                    checked={formValues[typedKey] || false}
                    onChange={(e) => handleSymptomChange(e, typedKey)}
                  />
           
          )}
                {/* Show extra fields if the smptom is selected */}
                {showExtraFields[typedKey]&& typedKey !== "poisoningIntentional" && (
                  <>
               
                      <>
                        <FormDatePicker
                        label={`${symptom.label} Date`}
                        name={`${typedKey}Date`}
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
                     label={symptomList["poisoningIntentional"].label}
                     checked={formValues["poisoningIntentional"] || false}
                     onChange={(e) => handleSymptomChange(e, "poisoningIntentional")}
                   />
                    )}
                  </>
                )}

                
              </div>
            );
          })}

<h3>Trauma/Injury History</h3>
          <LabelledCheckbox
            label="Was the patient injured?"
            checked={formValues.wasInjured || false}
            onChange={(e) => handleSymptomChange(e, "wasInjured")}
          />
          {showTraumaFields && (
            <>
              <TextInputField id="timeOfInjury" label="Time of Injury" name="timeOfInjury" placeholder="e.g., 10:30 AM" />
              <FormDatePicker label="Date of Injury" name="dateOfInjury" />

              <div>
                <h4>Mechanism of Injury</h4>
                {Object.keys(injuryMechanismList).map((key) => {
                  const mechanism = injuryMechanismList[key as keyof typeof injuryMechanismList];
                  
                  // Conditionally display only the selected mechanism or all if none is selected
                  if (!selectedMechanism || selectedMechanism === key) {
                    return (
                      <LabelledCheckbox
                        key={key}
                        label={mechanism.label}
                        checked={formValues[mechanism.name] || false}
                        onChange={(e) => handleTraumaMechanismChange(e, key)}
                      />
                    );
                  }
                  return null;
                })}

                {/* Show assault sub-options if "assault" is selected */}
                {selectedMechanism === "assault" && showAssaultOptions && (
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

              {/* Show additional fields regardless of mechanism selection */}
              <LabelledCheckbox
                label="Did the patient lose consciousness on the scene?"
                checked={formValues.lostConsciousness || false}
                onChange={(e) => handleSymptomChange(e, "lostConsciousness")}
              />
            </>
          )}


        </WrapperBox>
      </FormFieldContainer>
      <FormFieldContainer direction="row">
        <SearchComboBox
        name="Gastrointenstinal history"
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
{!genitourinaryOther ?(
<SearchComboBox
        name="genitourinaryHistory"
        label="Genitourinary history"
        options={genitourinaryOptions}
        multiple={true}
        getValue={(values) => {const other = values.some((value:any) => value.label === genitourinaryOptions[12].label);
          if (other) {
            setGenitourinaryOther(true);
  
          }
        }}
        />):
        (
          <TextInputField
          id="Genitourinary history"
          name="Genitourinary history"
          label="Specify Genitourinary history"

          />
        )}
      </FormFieldContainer>
      <FormFieldContainer direction="row">
          <TextInputField
           id="socialHistory"
           name="socialHistory"
           label="Social History"
           multiline
           rows={4}
          />
      </FormFieldContainer>
      <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title="Submit" type="submit" onClick={() => {console.log(formValues)}} />
        <MainButton variant="secondary" title="Skip" type="button" onClick={onSkip} />
      </WrapperBox>
    </FormikInit>
  );
};