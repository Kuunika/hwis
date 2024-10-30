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
    name:'AllergyDetails',
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
      { value: "Aspirin", label: "Aspirin" },
      { value: "Ibuprofen", label: "Ibuprofen" },
      { value: "Indomethacin", label: "Indomethacin" },
      { value: "Diclofenac", label: "Diclofenac" },
      { value: "Amoxicillin", label: "Amoxicillin" },
      { value: "Penicillin V", label: "Penicillin V" },
      { value: "Amoxicillin - clavulanic acid", label: "Amoxicillin - clavulanic acid" },
      { value: "Cotrimoxazole", label: "Cotrimoxazole" },
      { value: "Sulfadoxime Pyrimethamine (SP)", label: "Sulfadoxime Pyrimethamine (SP)" },
      { value: "Sulphur containing medication", label: "Sulphur containing medication" },
    ],
  },
  {
    label: 'Medical Substances',
    options: [
      { value: "Radiocontrast", label: "Radiocontrast" },
      { value: "Latex", label: "Latex" },
    ],
  },
  {
    label: 'Other Substances',
    options: [
      { value: "Pollen", label: "Pollen" },
      { value: "Bees", label: "Bees" },
      { value: "Wasps", label: "Wasps" },
    ],
  },
  {
    label: 'Food',
    options: [
      { value: "Seafood: Shellfish, prawns, calamari", label: "Seafood: Shellfish, prawns, calamari" },
      { value: "Other fish", label: "Other fish" },
      { value: "Eggs", label: "Eggs" },
      { value: "Peanut butter", label: "Peanut butter" },
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
    console.log(formValues);
    //onSubmit(formValues);
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