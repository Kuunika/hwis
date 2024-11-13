import { FormDatePicker, MainButton, SearchComboBox, WrapperBox } from "@/components";
import React, { useState } from "react";
import {
    FormFieldContainer, FormValuesListener,
    FormikInit, TextInputField
} from "@/components";
import * as yup from "yup";


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
    const [formValues, setFormValues] = useState<any>({});
    const [pregnancies, setPregnancies] = useState<number>(0);
    const [liveBirthSelections, setLiveBirthSelections] = useState<boolean[]>(
        Array.from({ length: pregnancies }, () => false) // Initialize based on number of pregnancies
      );

    const contraceptiveOptions = [
        { id: 'Jadelle', label: 'Jadelle' },
        { id: 'Implanon', label: 'Implanon' },
        { id: 'Levoplant', label: 'Levoplant' },
        { id: 'DepoProvera', label: 'Depo Provera' },
        { id: 'IUCD', label: 'Intra Uterine Contraceptive Device (IUCD)' },
        { id: 'ProgestinOnlyPills', label: 'Progestin only pills' },
        { id: 'Vasectomy', label: 'Vasectomy' },
        { id: 'TubalLigation', label: 'Tubal ligation' },
        { id: 'CombinedOralPills', label: 'Combined oral contraceptive pills' },
        { id: 'MaleFemaleCondoms', label: 'Condoms (Male and female)' },
        { id: 'LactationAmenorrhea', label: 'Lactation amenorrhea' },
        { id: 'Natural', label: 'Natural' },
      ];

      const pregnancyOutcomeOptions = [
        { id: 'first_trimester_miscarriage', label: 'First trimester miscarriage' },
        { id: 'second_trimester_miscarriage', label: 'Second trimester miscarriage' },
        { id: 'stillbirth', label: 'Stillbirth' },
        { id: 'live_birth', label: 'Live birth' },
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
    console.log(formValues);
    //onSubmit(formValues);
  };

  const handleOutcomeChange = (index: number, value: string) => {
    const updatedSelections = [...liveBirthSelections];
    updatedSelections[index] = value === pregnancyOutcomeOptions[3].id; // Update the corresponding index
    setLiveBirthSelections(updatedSelections);
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
    <TextInputField
              id={obstetricsFormConfig.age_at_menarche.name}
              name={obstetricsFormConfig.age_at_menarche.name}
              label={obstetricsFormConfig.age_at_menarche.label}
            />
    <FormDatePicker
      name={obstetricsFormConfig.last_menstral.name}
      label={obstetricsFormConfig.last_menstral.label}
      sx={{ background: 'white', margin: '2ch'}}
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
        <SearchComboBox options={contraceptiveOptions} getValue={(value) => console.log(value)}  multiple={true} name={obstetricsFormConfig.contraceptive_history.name}label={obstetricsFormConfig.contraceptive_history.label} />

    <WrapperBox>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
 </WrapperBox>
</FormikInit>
);

}