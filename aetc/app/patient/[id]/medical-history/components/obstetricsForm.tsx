import { FormDatePicker, MainButton, SearchComboBox, WrapperBox } from "@/components";
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


  type Obstetrics = {
    age_at_menarche: number;
    last_menstral: string;
    gestational_age: number;
    number_of_previous_pregnancies: number;
    previous_pregnancy_outcomes: string[]; // Array for pregnancy outcomes
    number_of_births: string[]; // Array for the number of births per pregnancy
    contraceptive_history: { id: string; label: string }[]; // Array for contraceptive history
  };
  
  // Define the obstetricsTemplate with initial values
  const obstetricsTemplate: Obstetrics = {
    age_at_menarche: 0,
    last_menstral: "",
    gestational_age: 0,
    number_of_previous_pregnancies: 0,
    previous_pregnancy_outcomes: [],
    number_of_births: [],
    contraceptive_history: [],
  };
  
  const initialValues = {
    obstetrics: obstetricsTemplate,
  };

  const obstetricsFormConfig = {
    age_at_menarche: {
      name: "obstetrics.age_at_menarche",
      label: "Age at Menarche",
    },
    last_menstral: {
      name: "obstetrics.last_menstral",
      label: "Last normal menstrual period",
    },
    gestational_age: {
      name: "obstetrics.gestational_age",
      label: "Gestational age (weeks)",
    },
    number_of_previous_pregnancies: {
      name: "obstetrics.number_of_previous_pregnancies",
      label: "Number of previous pregnancies",
    },
    previous_pregnancy_outcomes: (index: number) => ({
      name: `obstetrics.previous_pregnancy_outcomes[${index}]`,
      label: `Outcome of Pregnancy ${index + 1}`,
    }),
    number_of_births: (index: number) => ({
      name: `obstetrics.number_of_births[${index}]`,
      label: `Number of births (Pregnancy ${index + 1})`,
    }),
    contraceptive_history: {
      name: "obstetrics.contraceptive_history",
      label: "Contraceptive history",
    },
  };

export const ObstetricsForm = ({ onSubmit, onSkip }: Prop) => {
  const { params } = useParameters();
  const { data, isLoading } = getPatientsEncounters(params?.id as string);
  const [formValues, setFormValues] = useState<any>({});
  const [pregnancies, setPregnancies] = useState<number>(0);
  const [liveBirthSelections, setLiveBirthSelections] = useState<boolean[]>(
        Array.from({ length: pregnancies }, () => false) // Initialize based on number of pregnancies
      );
  const [observations, setObservations] = useState<ProcessedObservation[]>([]);

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
    [obstetricsFormConfig.previous_pregnancy_outcomes.name]: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().required(),
        })
      )
      .required("At least one allergy must be selected"),
  });


  const handleSubmit = () => {
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
        (item) => item.encounter_type.name === "OBSTETRIC HISTORY"
        &&
        item.obs?.length !== 4
      )
      
      
      const observations: ProcessedObservation[] = [];
      
      obstetricsEncounters?.forEach((encounter: { obs: Observation[] }) => {
        encounter.obs.forEach((observation) => {
          console.log(observation)
          const value = observation.value;
      
          // Format the observation data
          const obsData: ProcessedObservation = {
            obs_id: observation.obs_id,
            name: observation.names?.[0]?.name,
            value,
            children: [],
          };
      
          if (observation.obs_group_id) {
            // Find the parent observation and group it
            const parent = observations.find((o) => o.obs_id === observation.obs_group_id);
            if (parent) {
              parent.children.push(obsData);
            }
          } else {
            // Add it to the top-level observations
            observations.push(obsData);
          }
        });
      });
      

      setObservations(observations);
    }
  }, [ data]);






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
      onSubmit={onSubmit}
      submitButton={false} >
    <FormValuesListener getValues={setFormValues} />
    <FormFieldContainer direction="row">
    <TextInputField
              id={obstetricsFormConfig.age_at_menarche.name}
              name={obstetricsFormConfig.age_at_menarche.name}
              label={obstetricsFormConfig.age_at_menarche.label}
            />
    <FormDatePicker
      name={obstetricsFormConfig.last_menstral.name}
      label={obstetricsFormConfig.last_menstral.label}
      sx={{ background: 'white', marginRight:'2ch', marginLeft:'2ch', width:'150px'}}
    />
    <TextInputField
              id={obstetricsFormConfig.gestational_age.name}
              name={obstetricsFormConfig.gestational_age.name}
              label={obstetricsFormConfig.gestational_age.label}
              sx={{ marginRight: '2ch'}}
            />
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
          <React.Fragment key={`pregnancy_outcome_${index}`}>
            <SearchComboBox
              options={pregnancyOutcomeOptions}
              name={obstetricsFormConfig.previous_pregnancy_outcomes(index).name}
              label={obstetricsFormConfig.previous_pregnancy_outcomes(index).label}
              multiple={false}
              getValue={(value) => handleOutcomeChange(index, value)} // Handle change with index
            />
            
            {liveBirthSelections[index] && (
              <TextInputField
                id={obstetricsFormConfig.number_of_births(index).name}
                name={obstetricsFormConfig.number_of_births(index).name}
                label= {obstetricsFormConfig.number_of_births(index).label}
                sx={{ marginRight: '2ch', mt:'1ch' }}
              />
            )}
          </React.Fragment>
        ))}
    </FormFieldContainer>
        <SearchComboBox options={contraceptiveOptions}  multiple={true} name={obstetricsFormConfig.contraceptive_history.name}label={obstetricsFormConfig.contraceptive_history.label} />

    <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
 </WrapperBox>
</FormikInit>
</>
);

}