'use client'
import { FormDatePicker, MainButton, RadioGroupInput, SearchComboBox, WrapperBox } from "@/components";
import React, { useEffect, useState } from "react";
import {
    FormFieldContainer, FormValuesListener,
    FormikInit, TextInputField
} from "@/components";
import * as yup from "yup";
import { concepts } from "@/constants";
import { useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary } from "@mui/material";
import { Field, getIn } from "formik";


interface Observation {
  obs_id: number | null;
  obs_group_id: number | null;
  value: any;
  names: { name: string }[];
  children?: Observation[]; // To support nested children
}

interface ProcessedObservation {
  obs_id: number | null;
  name: string | undefined;
  value: any;
  children: ProcessedObservation[];
}
type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };


  
  
  const initialValues = {
    age_at_menarche: 0,
    last_menstrual: "",
    pregnant:"No",
    gestational_age: "Select a date of last menstrual",
    number_of_previous_pregnancies: 0,
    previous_pregnancy_outcomes: [],
    number_of_births: [],
    contraceptive_history: [],
  };

  const obstetricsFormConfig = {
    age_at_menarche: {
      name: "age_at_menarche",
      label: "Age at Menarche",
    },
    last_menstrual: {
      name: "last_menstrual",
      label: "Last normal menstrual period",
    },
    pregnant: {
      name: "pregnant",
      label: "Is the patient pregnant?",
    },
    gestational_age: {
      name: "gestational_age",
      label: "Gestational age (weeks)",
    },
    number_of_previous_pregnancies: {
      name: "number_of_previous_pregnancies",
      label: "Parity",
    },
    previous_pregnancy_outcomes: (index: number) => ({
      name: `previous_pregnancy_outcomes[${index}]`,
      label: `Outcome of Pregnancy ${index + 1}`,
    }),
    number_of_births: (index: number) => ({
      name: `number_of_births[${index}]`,
      label: `Number of births (Pregnancy ${index + 1})`,
    }),
    contraceptive_history: {
      name: "contraceptive_history",
      label: "Contraceptive history",
    },
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

export const ObstetricsForm = ({ onSubmit, onSkip }: Prop) => {
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  const [formValues, setFormValues] = useState<any>({});
  const [pregnancies, setPregnancies] = useState<number>(0);
  const [liveBirthSelections, setLiveBirthSelections] = useState<boolean[]>(
        Array.from({ length: pregnancies }, () => false) // Initialize based on number of pregnancies
      );
  const [observations, setObservations] = useState<ProcessedObservation[]>([]);
  const [showGestation, setShowGestation] = useState(false);

    const contraceptiveOptions = [
      { id: concepts.JADELLE, label: 'Jadelle' },
      { id: concepts.IMPLANON, label: 'Implanon' },
      { id: concepts.LEVOPLANT, label: 'Levoplant' },
      { id: concepts.DEPO_PROVERA, label: 'Depo Provera' },
      { id: concepts.INTRAUTERINE_CONTRACEPTIVE_DEVICE, label: 'Intra Uterine Contraceptive Device (IUCD)' },
      { id: concepts.PROGESTIN_ONLY_PILLS, label: 'Progestin only pills' },
      { id: concepts.VASECTOMY, label: 'Vasectomy' },
      { id: concepts.TUBAL_LIGATION, label: 'Tubal ligation' },
      { id: concepts.COMBINED_ORAL_PILLS, label: 'Combined oral contraceptive pills' },
      { id: concepts.MALE_FEMALE_CONDOMS, label: 'Condoms (Male and female)' },
      { id: concepts.LACTATION_AMENORRHEA, label: 'Lactation amenorrhea' },
      { id: concepts.NATURAL, label: 'Natural' },
      ];

      const pregnancyOutcomeOptions = [
        { id: concepts.FIRST_TRIMESTER_MISCARRIAGE, label: 'First trimester miscarriage' },
        { id: concepts.SECOND_TRIMESTER_MISCARRIAGE, label: 'Second trimester miscarriage' },
        { id: concepts.STILL_BIRTH, label: 'Stillbirth' },
        { id: concepts.LIVE_BIRTH, label: 'Live birth' },
      ];

      const schema = yup.object().shape({

        [obstetricsFormConfig.age_at_menarche.name]: yup.number()
        .required("Age at menarche is required")
        .positive("Age at menarche  must be a positive number"),

        // [obstetricsFormConfig.gestational_age.name]: yup
        // .number()
        // .when(obstetricsFormConfig.pregnant.name, (pregnant: any, schema) => {
        //   if (pregnant === "Yes") {
        //     return schema.required("Gestational age is required").positive("Gestational age must be a positive number");
        //   }
        //   return schema;
        // }),

          number_of_previous_pregnancies: yup
            .number()
            .required("Number of previous pregnancies is required")
            .min(0, "Number of pregnancies cannot be negative"),
        
            [obstetricsFormConfig.previous_pregnancy_outcomes.name]: yup
            .array()
            .of(yup.string().required("Each pregnancy outcome is required"))
            .when("number_of_previous_pregnancies", {
              is: (val: number) => val > 0,
              then: (schema) =>
                schema.test(
                  "length-match",
                  "The number of outcomes must match the number of previous pregnancies",
                  (value, context) => {
                    const numberOfPregnancies = context.parent.number_of_previous_pregnancies;
                    return Array.isArray(value) && value.length === numberOfPregnancies;
                  }
                ),
              otherwise: (schema) => schema.notRequired(),
            }),
        
    
            [obstetricsFormConfig.number_of_births.name]: yup
            .array()
            .of(yup.number().nullable().notRequired()) 
            .when([obstetricsFormConfig.previous_pregnancy_outcomes.name, "number_of_previous_pregnancies"], {
              is: (outcomes: string[], pregnancies: number) =>
                pregnancies > 0 && Array.isArray(outcomes),
              then: (schema) =>
                schema.test(
                  "match-live-births",
                  "Each live birth outcome must have a corresponding number of births specified",
                  (value, context) => {
                    const outcomes = context.parent[obstetricsFormConfig.previous_pregnancy_outcomes.name];
                    const numberOfPregnancies = context.parent.number_of_previous_pregnancies;
          
                    if (!Array.isArray(value) || !Array.isArray(outcomes)) {
                      return false; 
                    }
          
  
                    return outcomes.every((outcome, index) => {

                      if (outcome === "Live Birth" && value[index]) {
                        return value && value[index] !== undefined && value[index] > 0;
                      }
                      return true; 
                    });
                  }
                ),
              otherwise: (schema) => schema.notRequired(),
            }),

          [obstetricsFormConfig.last_menstrual.name]: yup.date()
            .required("Last menstrual date is required")
            .nullable()
            .max(new Date(), "Date cannot be in the future"),

              [obstetricsFormConfig.number_of_previous_pregnancies.name]: yup.number()
            .required("Number of previous pregnancies is required")
            .min(0, "Number of previous pregnancies cannot be negative")
            .integer("Number of pregnancies must be an integer"),
          
    

      });


  const handleSubmit = async () => {
    await schema.validate(formValues);
    onSubmit(formValues);
  };

  const handleOutcomeChange = (index: number, value: string) => {
    const updatedSelections = [...liveBirthSelections];
    updatedSelections[index] = value === pregnancyOutcomeOptions[3].id; // Update the corresponding index
    setLiveBirthSelections(updatedSelections);
  };

  useEffect(() => {
    if(!isLoading){
      const obstetricsEncounters = data?.filter(
        (item) => item.encounter_type?.name === "OBSTETRIC HISTORY"
      )
      
      
      const observations: ProcessedObservation[] = [];
      
      obstetricsEncounters?.forEach((encounter: { obs: Observation[] }) => {
        encounter.obs.forEach((observation) => {
          const value = observation.value;
      
          const obsData: ProcessedObservation = {
            obs_id: observation.obs_id,
            name: observation.names?.[0]?.name,
            value,
            children: [],
          };
      
          if (observation.obs_group_id) {
            const parent = observations.find((o) => o.obs_id === observation.obs_group_id);
            if (parent) {
              parent.children.push(obsData);
            }
          } else {
            observations.push(obsData);
          }
        });
      });
      

      setObservations(observations);
    }

    formValues["pregnant"]=="Yes"? setShowGestation(true): setShowGestation(false);
    
   
    const currentDate = new Date();
    const unixNow = Math.floor(currentDate.getTime() / 1000);
    const lastMenstrual = new Date(formValues[obstetricsFormConfig.last_menstrual.name]);
    const unixLast = Math.floor(lastMenstrual.getTime() / 1000);

    if (!isNaN(unixLast)) { 
        const gestationalAgeInSeconds = unixNow - unixLast;
        const Gestational_age = Math.floor(gestationalAgeInSeconds / 604800);
        const remainingDays = Math.floor((gestationalAgeInSeconds % 604800) / 86400);
        const ageText = `${Gestational_age} weeks and ${remainingDays} days`;
        formValues[obstetricsFormConfig.gestational_age.name] = ageText;
    }
    

  }, [ data, formValues]);






return (
  <>
  <Accordion sx={{mb:'2ch'}}>
    <AccordionSummary><h4>Existing Obstetrics History</h4></AccordionSummary>
    <AccordionDetails >
  <div>
  {observations.map((obs) => (
    <div key={obs.obs_id} style={{ marginBottom: "10px", color: 'rgba(0, 0, 0, 0.6)' }}>
      {obs.children.length === 0 ? (
        // Display items with no children
        <div>
          <strong>{obs.name}:</strong> {obs.value}
        </div>
      ) : (
        // Display parent item and its children
        <div>
          <h4 style={{ marginBottom: "10px" }}>{obs.name}</h4>
          {obs.children.map((child) => (
            <div key={child.obs_id} style={{ paddingLeft: "20px" }}>
              <strong>{child.name}:</strong> {child.value}
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</div>
</AccordionDetails>
</Accordion>
<div style={{marginBottom:'4ch'}}></div>
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      submitButton={false} 
      enableReinitialize={true}>
    <FormValuesListener getValues={setFormValues} />
    <FormFieldContainer direction="column">
    <TextInputField
              id={obstetricsFormConfig.age_at_menarche.name}
              name={obstetricsFormConfig.age_at_menarche.name}
              label={obstetricsFormConfig.age_at_menarche.label}
            />

    <FormDatePicker
      name={obstetricsFormConfig.last_menstrual.name}
      label={obstetricsFormConfig.last_menstrual.label}
      sx={{ background: 'white', marginRight:'2ch', width:'150px'}}
    />                               
    <div style={{ color: "red", fontSize: "0.875rem" }}>
    <ErrorMessage
          name={`obstetrics.last_menstrual`}
      />
    </div>
        <RadioGroupInput
          row
          name={obstetricsFormConfig.pregnant.name}
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          label={obstetricsFormConfig.pregnant.label}
          sx={{marginTop:"2ch", marginBottom:"2ch"}}
        />
{showGestation&&(
   <TextInputField
              id={obstetricsFormConfig.gestational_age.name}
              name={obstetricsFormConfig.gestational_age.name}
              label={obstetricsFormConfig.gestational_age.label}
              sx={{ marginRight: '2ch'}}
              disabled
            />

            )}

<TextInputField
              id={obstetricsFormConfig.number_of_previous_pregnancies.name}
              name={obstetricsFormConfig.number_of_previous_pregnancies.name}
              label={obstetricsFormConfig.number_of_previous_pregnancies.label}
              handleBlurEvent={(value) => {
                   setPregnancies(Number(value))
                }}
              sx={{ marginRight: '2ch'}}
            />

            </FormFieldContainer>
            <FormFieldContainer direction="column">
      {pregnancies!=0 &&
        Array.from({ length: pregnancies }).map((_, index) => (
          <>
            <SearchComboBox
              options={pregnancyOutcomeOptions}
              name={obstetricsFormConfig.previous_pregnancy_outcomes(index).name}
              label={obstetricsFormConfig.previous_pregnancy_outcomes(index).label}
              multiple={false}
              getValue={(value) => handleOutcomeChange(index, value)} 
            />
            
            {liveBirthSelections[index] && (
              <TextInputField
                id={obstetricsFormConfig.number_of_births(index).name}
                name={obstetricsFormConfig.number_of_births(index).name}
                label= {obstetricsFormConfig.number_of_births(index).label}
                sx={{ marginRight: '2ch', mt:'1ch' }}
              />
            )}
                        <div style={{ color: "red", fontSize: "0.875rem" }}>
    <ErrorMessage
name={'previous_pregnancy_outcomes'}
/></div>
          </>
        ))}
    </FormFieldContainer>
        <SearchComboBox options={contraceptiveOptions}  multiple={true} name={obstetricsFormConfig.contraceptive_history.name}label={obstetricsFormConfig.contraceptive_history.label} />
                   <WrapperBox sx={{mt: '2ch' }}>
    <MainButton variant="secondary" title="Previous" type="button" onClick={onSkip} sx={{ flex: 1, marginRight: '8px' }} />
    <MainButton onClick={handleSubmit} variant="primary" title="Next" type="submit" sx={{ flex: 1 }} />
  </WrapperBox>
</FormikInit>
</>
);

}