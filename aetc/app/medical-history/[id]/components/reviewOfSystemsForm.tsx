import React, { useState } from "react";
import { FormikInit, MainButton, WrapperBox, FormFieldContainer, TextInputField, FormDatePicker } from "@/components";
import * as yup from "yup";
import LabelledCheckbox from "@/components/form/labelledCheckBox";

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
  intentional: { name: "intentional", label: "Intentional Poisoning", requiresSite: false },
  ulcerWound: { name: "ulcerOrWound", label: "Ulcer/Wound", requiresSite: true },
};

const injuryMechanismList = {
    assaultPhysical: { name: "assaultPhysical", label: "Physical" },
    assaultSexual: { name: "assaultSexual", label: "Sexual" },
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

export const ReviewOfSystemsForm = ({ onSubmit, onSkip }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [showExtraFields, setShowExtraFields] = useState<any>({});
  const [showTraumaFields, setShowTraumaFields] = useState(false);

  const schema = yup.object().shape({
    // Define your validation rules here
    pain: yup.boolean(),
    duration: yup.string().when("pain", (pain, schema) =>
      pain ? schema.required("Please specify the duration of pain") : schema
    ),
    specifySite: yup.string().when("pain", (pain, schema) =>
      pain ? schema.required("Please specify the site of pain") : schema
    ),
    // Continue defining for other symptoms
  });

  const initialValues = {
    pain: false,
    duration: "",
    specifySite: "",
    assaultPhysical: false
    // Initialize other symptoms
  };

  const handleSymptomChange = (e: any, symptom: string) => {
    const isChecked = e.target.checked;
    setShowExtraFields((prev: any) => ({
      ...prev,
      [symptom]: isChecked,
    }));
    setFormValues((prev: any) => ({
      ...prev,
      [symptom]: isChecked,
    }));


    // Show trauma fields if the patient was injured
    if (symptom === 'wasInjured') {
        setShowTraumaFields(isChecked);
      }
  };

 

  const handleSubmit = () => {
    onSubmit(formValues);
  };

    function handleTraumaMechanismChange(e: React.ChangeEvent<HTMLInputElement>, name: string): void {
        throw new Error("Function not implemented.");
    }

  return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={false}
    >
     <FormFieldContainer direction="row">
     <FormDatePicker
        label={symptomList.lastMeal.label}
        name={symptomList.lastMeal.name}
        sx={{ background: 'white'}}
    />
     </FormFieldContainer>

        <TextInputField
            id={symptomList.events.name}
            label={symptomList.events.label}
            name={symptomList.events.name}
            placeholder="e.g. Started with mild abdominal pain 3 days ago, gradually worsened..."
            multiline={true}
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
                {typedKey !== "intentional" && typedKey !== "lastMeal" && typedKey !== "events" &&(
                <LabelledCheckbox
                    label={symptomList[typedKey].label}
                    checked={formValues[typedKey] || false}
                    onChange={(e) => handleSymptomChange(e, typedKey)}
                  />
           
          )}
                {/* Show extra fields if the smptom is selected */}
                {showExtraFields[typedKey]&& typedKey !== "intentional" && (
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
                        id="specifySite"
                        label="Specify Site"
                        name="specifySite"
                        placeholder="Specify the site"
                      />
                    )}

                    {typedKey == "poisoning" && (
                     <LabelledCheckbox
                     label={symptomList["intentional"].label}
                     checked={formValues["intentional"] || false}
                     onChange={(e) => handleSymptomChange(e, "intentional")}
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
    <TextInputField
      id="timeOfInjury"
      label="Time of Injury"
      name="timeOfInjury"
      placeholder="e.g., 10:30 AM"
    />
    <FormDatePicker
      label="Date of Injury"
      name="dateOfInjury"
    />
    <div>
      <h4>Mechanism of Injury</h4>
  
     
          <LabelledCheckbox
            label={injuryMechanismList.assaultPhysical.label}
            checked={formValues[injuryMechanismList.assaultPhysical.name]}
            onChange={(e) => handleTraumaMechanismChange(e, injuryMechanismList.assaultPhysical.name)}
          />
        
    </div>
    <LabelledCheckbox
      label="Occupational Injury"
      checked={formValues.occupationalInjury || false}
      onChange={(e) => handleSymptomChange(e, "occupationalInjury")}
    />
    <LabelledCheckbox
      label="Did the patient lose consciousness on the scene?"
      checked={formValues.lostConsciousness || false}
      onChange={(e) => handleSymptomChange(e, "lostConsciousness")}
    />
  </>
)}
        </WrapperBox>
      </FormFieldContainer>

      <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
      </WrapperBox>
    </FormikInit>
  );
};