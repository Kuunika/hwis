import { MainButton, TextInputField, WrapperBox } from "@/components";
import { useEffect, useState } from "react";
import {
  FormValuesListener,
  FormikInit
} from "@/components";
import * as yup from "yup";
import { concepts } from "@/constants";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import { getPatientsEncounters } from "@/hooks/encounter";
import { useParameters } from "@/hooks";
import AllergiesPanel from "../../medicalInpatient/components/allergies";
import { getConceptSet } from "@/hooks/getConceptSet";

interface Observation {
  obs_id: number | null;
  obs_group_id: number | null;
  value: any;
  names: { name: string }[];
  children?: Observation[]; 
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

  type Allergy = {
    group: string;
    value: string;
    label: string;
  };



const allergiesFormConfig = {
allergy: {
    name: concepts.ALLERGY,
    label: "Allergies",
  },
  allergyDetails:{
    name:concepts.DESCRIPTION,
    label:'Allergy Details'
  },
  otherMedication:{
    name:concepts.OTHER_MEDICATION_ALLERGY,
    label:'Specify other medication allergy'
  },
  otherMedicalSubstance:{
    name:concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGY,
    label:'Specify other medical substance allergy'
  },
  otherFood:{
    name: concepts.OTHER_FOOD_ALLERGY,
    label: 'Specify other food allergy'
  },
  otherSubstance:{
    name: concepts.OTHER_SUBSTANCE_ALLERGY,
    label: 'Specify other substance allergy'
  }
}

export const AllergiesForm = ({ onSubmit, onSkip }: Prop) => {
  const { params } = useParameters();
    const [formValues, setFormValues] = useState<any>({});
    const [allergySelected,  setAllergySelected] = useState<Allergy[]>([]);
    const [showFoodOther, setShowFoodOther] = useState<boolean | null>(null);
    const [showMedicalSubstanceOther, setShowMedicalSubstanceOther] = useState<boolean | null>(null);
    const [showMedicationOther, setShowMedicationOther] = useState<boolean | null>(null);
    const [showSubstanceOther, setShowSubstanceOther] = useState<boolean | null>(null);
    const { data, isLoading } = getPatientsEncounters(params?.id as string);
    const [observations, setObservations] = useState<ProcessedObservation[]>([]);
    const{data: allergenCats} = getConceptSet("Allergen Category");
    const {data: medicationAllergens} = getConceptSet("Medication Allergens");
    const {data: medicalSubstanceAllergens} = getConceptSet("Medical Substance Allergens");
    const {data: substanceAllergens} = getConceptSet("Substance Allergens");
    const {data: foodAllergens} = getConceptSet("Food Allergens");
    const [allergyOptions, setAllergyOptions] = useState<any[]>([]);
    const allergiesEncounters = data?.filter(
      (item) => 
        item.encounter_type?.name === "Allergies"
    
    );
  

useEffect(() => {

  let medicationOptions: { value: string; label: string }[] = [];
  let foodOptions: { value: string; label: string }[] = [];
  let substanceOptions: { value: string; label: string }[] = [];
  let medicalSubstanceOptions: { value: string; label: string }[] = [];

if (medicationAllergens && foodAllergens && substanceAllergens && medicalSubstanceAllergens) {
  
  foodOptions = foodAllergens.map(({ name, uuid }: { name: string; uuid: string }) => ({
    value: uuid,
    label: name,
  }));

  substanceOptions = substanceAllergens.map(({ name, uuid }: { name: string; uuid: string }) => ({
    value: uuid,
    label: name,
  }));

  medicalSubstanceOptions = medicalSubstanceAllergens.map(({ name, uuid }: { name: string; uuid: string }) => ({
    value: uuid,
    label: name,
  }));

  medicationOptions = medicationAllergens.map(({ name, uuid }: { name: string; uuid: string }) => ({
    value: uuid,
    label: name,
  }));

}

if(allergenCats){
const allergyOptions = [
  {
    label:allergenCats[0].name , value:allergenCats[0].uuid,
    options: medicationOptions,
  },
  {
    label:allergenCats[1].name ,value:allergenCats[1].uuid,
    options: medicalSubstanceOptions,
  },
  {
    label:allergenCats[2].name ,value:allergenCats[2].uuid,
    options: substanceOptions,
  },
  {
    label:allergenCats[3].name ,value:allergenCats[3].uuid,
    options: foodOptions,
  },
];

setAllergyOptions(allergyOptions);
}


if (allergySelected.length > 0) {
  console.log(allergySelected, foodAllergens, allergenCats);
  setShowFoodOther(allergySelected.some((allergy) => allergy.value === foodAllergens[4].uuid));
  setShowMedicalSubstanceOther(allergySelected.some((allergy) => allergy.value === concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGY));
  setShowMedicationOther(allergySelected.some((allergy) => allergy.value === concepts.OTHER_MEDICATION_ALLERGY));
  setShowSubstanceOther(allergySelected.some((allergy) => allergy.value === concepts.OTHER_SUBSTANCE_ALLERGY));
} else {
  setShowFoodOther(null);
  setShowMedicalSubstanceOther(null);
  setShowMedicationOther(null);
  setShowSubstanceOther(null);
}
}, [allergenCats, medicationAllergens, foodAllergens, substanceAllergens, medicalSubstanceAllergens, allergySelected]);

const schema = yup.object().shape({

  [allergiesFormConfig.allergy.name]: yup
    .array()
    .min(1, "At least one allergy must be selected")
    .of(
      yup.object().shape({
        group: yup.string().required("Group is required"),
        value: yup.string().required("Value is required"),
        label: yup.string().required("Label is required"),
      })
    )
    .required("Allergy field is required"),


  [allergiesFormConfig.otherFood.name]: yup
    .string()
    .when(allergiesFormConfig.allergy.name, (allergies, schema) => {
      const flatAllergies = allergies?.flat() || [];
      const hasOtherFoodAllergy = flatAllergies.some(
        (allergy: any) => allergy.value === allergiesFormConfig.otherFood.name
      );

      return hasOtherFoodAllergy
        ? schema
            .required("Please specify the other food allergy")
            .min(1, "The other food allergy must not be empty")
        : schema.notRequired();
    }),


  [concepts.OTHER_MEDICATION_ALLERGY]: yup
    .string()
    .when(allergiesFormConfig.allergy.name, (allergies, schema) => {
      const flatAllergies = allergies?.flat() || [];
      const hasOtherMedicationAllergy = flatAllergies.some(
        (allergy: any) => allergy.value === concepts.OTHER_MEDICATION_ALLERGY
      );

      return hasOtherMedicationAllergy
        ? schema.required("Please specify the other medication allergy")
        : schema.notRequired();
    }),

  [concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGY]: yup
    .string()
    .when(allergiesFormConfig.allergy.name, (allergies, schema) => {
      const flatAllergies = allergies?.flat() || [];
      const hasOtherMedicalSubstanceAllergy = flatAllergies.some(
        (allergy: any) => allergy.value === concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGY
      );

      return hasOtherMedicalSubstanceAllergy
        ? schema.required("Please specify the other medical substance allergy")
        : schema.notRequired();
    }),

 
  [concepts.OTHER_SUBSTANCE_ALLERGY]: yup
    .string()
    .when(allergiesFormConfig.allergy.name, (allergies, schema) => {
      const flatAllergies = allergies?.flat() || [];
      const hasOtherSubstanceAllergy = flatAllergies.some(
        (allergy: any) => allergy.value === concepts.OTHER_SUBSTANCE_ALLERGY
      );

      return hasOtherSubstanceAllergy
        ? schema.required("Please specify the other substance allergy")
        : schema.notRequired();
    }),


});

const initialValues = {
  [allergiesFormConfig.allergy.name]: [], 
  [allergiesFormConfig.otherFood.name]: "",
  [allergiesFormConfig.otherMedication.name]: "",
  [allergiesFormConfig.otherMedicalSubstance.name]: "",
  [allergiesFormConfig.otherSubstance.name]: "",
  [allergiesFormConfig.allergyDetails.name]: "",
};

  const handleSubmit = async () => {

    await schema.validate(formValues);
    
    const allergyListKey = concepts.ALLERGY;

      Object.keys(formValues).forEach((key) => {
        if (key.startsWith("OTHER_") && key.endsWith("_ALLERGY")) {
          const replacementValue = formValues[key];

          if (replacementValue) {
            formValues[allergyListKey] = formValues[allergyListKey].map((allergy: { value: string; }) => {
              if (allergy.value === key) {
                return {
                  ...allergy,
                  value: replacementValue
                };
              }
              return allergy;
            });

            delete formValues[key];
          }
        }
      });

    onSubmit(formValues);
  };


  useEffect(() => {



  }, [allergySelected]);

return (<>

<AllergiesPanel/>

    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      submitButton={false}
    >
    <FormValuesListener getValues={setFormValues} />

        <GroupedSearchComboBox options={allergyOptions} getValue={(value) => { setAllergySelected(value);}}  multiple={true} name={allergiesFormConfig.allergy.name}label={allergiesFormConfig.allergy.label} />

        {showFoodOther &&(
  <TextInputField 
  id={allergiesFormConfig.otherFood.name}
  name={allergiesFormConfig.otherFood.name}
  label={allergiesFormConfig.otherFood.label}
  sx={{ width: '100%', mt:'2ch' }}
/>
 
)}

{showMedicalSubstanceOther && (
    <TextInputField
      id={allergiesFormConfig.otherMedicalSubstance.name}
      name={allergiesFormConfig.otherMedicalSubstance.name}
      label={allergiesFormConfig.otherMedicalSubstance.label}
      sx={{ width: '100%', mt: '2ch' }}
    />
  )}

  {showMedicationOther && (
    <TextInputField
      id={allergiesFormConfig.otherMedication.name}
      name={allergiesFormConfig.otherMedication.name}
      label={allergiesFormConfig.otherMedication.label}
      sx={{ width: '100%', mt: '2ch' }}
    />
  )}

  {showSubstanceOther && (
    <TextInputField
      id={allergiesFormConfig.otherSubstance.name}
      name={allergiesFormConfig.otherSubstance.name}
      label={allergiesFormConfig.otherSubstance.label}
      sx={{ width: '100%', mt: '2ch' }}
    />
    
  )}


{allergySelected.some(item => item.group === allergenCats[0].uuid) && (
  <TextInputField
    id="medication_Allergy_Details"
    name={"medication_Allergy_Details"}
    label="Medication allergy details"
    sx={{ width: '100%', mt: '2ch' }}
  />
)}

{allergySelected.some(item => item.group === allergenCats[1].uuid) && (
  <TextInputField
    id="medical_Substance_Allergy_Details"
    name={"medical_Substance_Allergy_Details"}
    label="Medical substance allergy details"
    sx={{ width: '100%', mt: '2ch' }}
  />
)}

{allergySelected.some(item => item.group === allergenCats[3].uuid) && (
  <TextInputField
    id="food_Allergy_Details"
    name={"food_Allergy_Details"}
    label="Food allergy details"
    sx={{ width: '100%', mt: '2ch' }}
  />
)}

{allergySelected.some(item => item.group === allergenCats[2].uuid) && (
  <TextInputField
    id="substance_Allergy_Details"
    name={"substance_Allergy_Details"}
    label="Substance allergy details"
    sx={{ width: '100%', mt: '2ch' }}
  />
)}


<WrapperBox sx={{mt: '2ch' }}>
    <MainButton variant="secondary" title="Previous" type="button" onClick={onSkip} sx={{ flex: 1, marginRight: '8px' }} />
    <MainButton onClick={handleSubmit} variant="primary" title="Next" type="submit" sx={{ flex: 1 }} />
  </WrapperBox>
</FormikInit>
</>
);

}