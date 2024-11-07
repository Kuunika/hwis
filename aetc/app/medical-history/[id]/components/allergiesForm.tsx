import { MainButton, TextInputField, WrapperBox } from "@/components";
import { useState } from "react";
import {
    FormValuesListener,
    FormikInit
} from "@/components";
import * as yup from "yup";
import { concepts } from "@/constants";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";


type Prop = {
    onSubmit: (values: any) => void;
    onSkip: () => void;
  };


const allergiesFormConfig = {
allergy: {
    name: concepts.ALLERGY,
    label: "Allergies",
  },
  allergyDetails:{
    name:concepts.ALLERGY_COMMENT,
    label:'Allergy Details'
  }
}

export const AllergiesForm = ({ onSubmit, onSkip }: Prop) => {
    const [formValues, setFormValues] = useState<any>({});
    const [allergySelected,  setAllergySelected] = useState<boolean>(false);

const allergyOptions = [
  {
    label: 'Medications',
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
    ],
  },
  {
    label: 'Medical Substances',
    options: [
      { value: concepts.RADIOCONTRAST_ALLERGY, label: "Radiocontrast" },
      { value: concepts.LATEX_ALLERGY, label: "Latex" },
    ],
  },
  {
    label: 'Other Substances',
    options: [
      { value: concepts.POLLEN_ALLERGY, label: "Pollen" },
      { value: concepts.BEES_ALLERGY, label: "Bees" },
      { value: concepts.WASPS_ALLERGY, label: "Wasps" },
    ],
  },
  {
    label: 'Food',
    options: [
      { value: concepts.SEAFOOD_ALLERGY, label: "Seafood: Shellfish, prawns, calamari" },
      { value: concepts.OTHER_FISH_ALLERGY, label: "Other fish" },
      { value: concepts.EGGS_ALLERGY, label: "Eggs" },
      { value: concepts.PEANUT_ALLERGY, label: "Peanut butter" },
    ],
  },
];

const schema = yup.object().shape({
    [allergiesFormConfig.allergy.name]: yup
      .array()
      .of(
        yup.object().shape({
          group: yup.string().required(),
          value: yup.string().required(),
          label: yup.string().required(),
        })
      )
      .required("At least one allergy must be selected"),
  });

const initialValues = {
    [allergiesFormConfig.allergy.name]: [],
  };

  const handleSubmit = () => {
    onSubmit(formValues);
  };

return (
    <FormikInit
      validationSchema={schema}
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitButton={false}
    >
    <FormValuesListener getValues={setFormValues} />

        <GroupedSearchComboBox options={allergyOptions} getValue={(value) => { setAllergySelected(true); console.log(value)}}  multiple={true} name={allergiesFormConfig.allergy.name}label={allergiesFormConfig.allergy.label} />
{allergySelected &&(
  <TextInputField 
  id={allergiesFormConfig.allergyDetails.name}
  name={allergiesFormConfig.allergyDetails.name}
  label={allergiesFormConfig.allergyDetails.label}
  sx={{ width: '100%', mt:'2ch' }}
  multiline={true}
  rows={3}
/>
 
)}
    <WrapperBox sx={{mt:'2ch'}}>
        <MainButton sx={{ m: 0.5 }} title={"Submit"} type="submit" onClick={handleSubmit} />
        <MainButton variant={"secondary"} title="Skip" type="button" onClick={onSkip} />
 </WrapperBox>
</FormikInit>
);

}