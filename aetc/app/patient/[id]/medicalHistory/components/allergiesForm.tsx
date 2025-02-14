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
    name:concepts.ALLERGY_COMMENT,
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

    const allergiesEncounters = data?.filter(
      (item) => 
        item.encounter_type?.name === "Allergies"
    
    );
  

const allergyOptions = [
  {
    label:'MEDICATIONS' , value:concepts.MEDICATION_ALLERGY,
    options: [
      { value: concepts.ASPIRIN_ALLERGY, label: "Aspirin" },
      { value: concepts.IBUPROFEN_ALLERGY, label: "Ibuprofen" },
      { value: concepts.INDOMETHACIN_ALLERGY, label: "Indomethacin" },
      { value: concepts.DICLOFENAC_ALLERGY, label: "Diclofenac" },
      { value: concepts.AMOXICILLIN_ALLERGY, label: "Amoxicillin" },
      { value: concepts.PENICILLIN_V_ALLERGY, label: "Penicillin V" },
      { value: concepts.AMOXICILLIN_CLAVULANIC_ACID_ALLERGY, label: "Amoxicillin - clavulanic acid" },
      { value: concepts.COTRIMOXAZOLE_ALLERGY, label: "Cotrimoxazole" },
      { value: concepts.SULFADOXIME_PYRIMETHAMINE_ALLERGY, label: "Sulfadoxime Pyrimethamine (SP)" },
      { value: concepts.SULPHUR_CONTAINING_MEDICATION_ALLERGY, label: "Sulphur containing medication" },
      { value: concepts.OTHER_MEDICATION_ALLERGY, label: "Other medication allergy" },
    ],
  },
  {
    label:'MEDICAL SUBSTANCE' ,value:concepts.MEDICAL_SUBSTANCE_ALLERGY,
    options: [
      { value: concepts.RADIOCONTRAST_ALLERGY, label: "Radiocontrast" },
      { value: concepts.LATEX_ALLERGY, label: "Latex" },
      { value: concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGY, label: "Other medical substance allergy" },
    ],
  },
  {
    label: 'SUBSTANCE', value: concepts.SUBSTANCE_ALLERGY,
    options: [
      { value: concepts.POLLEN_ALLERGY, label: "Pollen" },
      { value: concepts.BEES_ALLERGY, label: "Bees" },
      { value: concepts.WASPS_ALLERGY, label: "Wasps" },
      { value: concepts.OTHER_SUBSTANCE_ALLERGY, label: "Other substance allergy" },
    ],
  },
  {
    label: 'FOOD', value: concepts.FOOD_ALLERGY,
    options: [
      { value: concepts.SEAFOOD_ALLERGY, label: "Seafood: Shellfish, prawns, calamari" },
      { value: concepts.OTHER_FISH_ALLERGY, label: "Other fish" },
      { value: concepts.EGGS_ALLERGY, label: "Eggs" },
      { value: concepts.PEANUT_ALLERGY, label: "Peanut butter" },
      { value: concepts.OTHER_FOOD_ALLERGY, label: "Other food allergy" },
    ],
  },
];


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
    if (allergySelected.length > 0) {
      // Check for each allergy type and set the corresponding state
      setShowFoodOther(allergySelected.some((allergy) => allergy.value === concepts.OTHER_FOOD_ALLERGY));
      setShowMedicalSubstanceOther(allergySelected.some((allergy) => allergy.value === concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGY));
      setShowMedicationOther(allergySelected.some((allergy) => allergy.value === concepts.OTHER_MEDICATION_ALLERGY));
      setShowSubstanceOther(allergySelected.some((allergy) => allergy.value === concepts.OTHER_SUBSTANCE_ALLERGY));
    } else {
      // Reset states if no allergies are selected
      setShowFoodOther(null);
      setShowMedicalSubstanceOther(null);
      setShowMedicationOther(null);
      setShowSubstanceOther(null);
    }


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
{allergySelected.length>0 &&(
  <TextInputField 
  id={allergiesFormConfig.allergyDetails.name}
  name={allergiesFormConfig.allergyDetails.name}
  label={allergiesFormConfig.allergyDetails.label}
  sx={{ width: '100%', mt:'2ch' }}
  multiline={true}
  rows={3}
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