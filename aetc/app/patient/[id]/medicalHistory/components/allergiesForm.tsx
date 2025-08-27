import { MainButton, TextInputField, WrapperBox } from "@/components";
import { useEffect, useState } from "react";
import { FormValuesListener, FormikInit } from "@/components";
import * as yup from "yup";
import { concepts } from "@/constants";
import { GroupedSearchComboBox } from "@/components/form/groupedSearchCombo";
import AllergiesPanel from "../../medicalInpatient-/components/allergies";
import { useAllergyFormat } from "@/hooks/useAllergyFormat";

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
  onPrevious: () => void;
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
  allergyDetails: {
    name: concepts.DESCRIPTION,
    label: "Allergy Details",
  },
  otherMedication: {
    name: concepts.OTHER_MEDICATION_ALLERGY,
    label: "Specify other medication allergen",
  },
  otherMedicalSubstance: {
    name: concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGY,
    label: "Specify other medical substance allergen",
  },
  otherFood: {
    name: concepts.OTHER_FOOD_ALLERGY,
    label: "Specify other food allergen",
  },
  otherSubstance: {
    name: concepts.OTHER_SUBSTANCE_ALLERGY,
    label: "Specify other substance allergen",
  },
};

export const AllergiesForm = ({ onSubmit, onSkip, onPrevious }: Prop) => {
  const [formValues, setFormValues] = useState<any>({});
  const [allergySelected, setAllergySelected] = useState<Allergy[]>([]);
  const [showFoodOther, setShowFoodOther] = useState<boolean | null>(null);
  const [showMedicalSubstanceOther, setShowMedicalSubstanceOther] = useState<
    boolean | null
  >(null);
  const [showMedicationOther, setShowMedicationOther] = useState<
    boolean | null
  >(null);
  const [showSubstanceOther, setShowSubstanceOther] = useState<boolean | null>(
    null
  );

  const {
    foodAllergens,
    medicalSubstanceAllergens,
    medicationAllergens,
    substanceAllergens,
    allergyOptions,
    allergenCats,
  } = useAllergyFormat();

  useEffect(() => {
    if (allergySelected.length > 0) {
      setShowFoodOther(
        allergySelected.some(
          (allergy) => allergy.value === foodAllergens[4].uuid
        )
      );
      setShowMedicalSubstanceOther(
        allergySelected.some(
          (allergy) => allergy.value === medicalSubstanceAllergens[2].uuid
        )
      );
      setShowMedicationOther(
        allergySelected.some(
          (allergy) => allergy.value === medicationAllergens[10].uuid
        )
      );
      setShowSubstanceOther(
        allergySelected.some(
          (allergy) => allergy.value === substanceAllergens[3].uuid
        )
      );
    } else {
      setShowFoodOther(null);
      setShowMedicalSubstanceOther(null);
      setShowMedicationOther(null);
      setShowSubstanceOther(null);
    }
  }, [
    allergenCats,
    medicationAllergens,
    foodAllergens,
    substanceAllergens,
    medicalSubstanceAllergens,
    allergySelected,
  ]);

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
          (allergy: any) => allergy.label === concepts.OTHER_FOOD_ALLERGEN
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
          (allergy: any) => allergy.label === concepts.OTHER_MEDICATION_ALLERGEN
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
          (allergy: any) =>
            allergy.label === concepts.OTHER_MEDICAL_SUBSTANCE_ALLERGEN
        );

        return hasOtherMedicalSubstanceAllergy
          ? schema.required(
              "Please specify the other medical substance allergy"
            )
          : schema.notRequired();
      }),

    [concepts.OTHER_SUBSTANCE_ALLERGY]: yup
      .string()
      .when(allergiesFormConfig.allergy.name, (allergies, schema) => {
        const flatAllergies = allergies?.flat() || [];
        const hasOtherSubstanceAllergy = flatAllergies.some(
          (allergy: any) => allergy.label === concepts.OTHER_SUBSTANCE_ALLERGEN
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
          formValues[allergyListKey] = formValues[allergyListKey].map(
            (allergy: { value: string }) => {
              if (allergy.value === key) {
                return {
                  ...allergy,
                  value: replacementValue,
                };
              }
              return allergy;
            }
          );

          delete formValues[key];
        }
      }
    });

    
    onSubmit(formValues);
  };

  useEffect(() => {
      const isNone = allergySelected.find((allergy: any) => allergy.value === "None");
      
      if(isNone) onSkip();
  }, [allergySelected]);

  return (
    <>
      <AllergiesPanel />

      <FormikInit
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        submitButton={false}
      >
        <FormValuesListener getValues={setFormValues} />

        <GroupedSearchComboBox
          options={allergyOptions}
          getValue={(value) => {
            setAllergySelected(value);
          }}
          multiple={true}
          name={allergiesFormConfig.allergy.name}
          label={allergiesFormConfig.allergy.label}
        />

        {showFoodOther && (
          <TextInputField
            id={allergiesFormConfig.otherFood.name}
            name={allergiesFormConfig.otherFood.name}
            label={allergiesFormConfig.otherFood.label}
            sx={{ width: "100%", mt: "2ch" }}
          />
        )}

        {showMedicalSubstanceOther && (
          <TextInputField
            id={allergiesFormConfig.otherMedicalSubstance.name}
            name={allergiesFormConfig.otherMedicalSubstance.name}
            label={allergiesFormConfig.otherMedicalSubstance.label}
            sx={{ width: "100%", mt: "2ch" }}
          />
        )}

        {showMedicationOther && (
          <TextInputField
            id={allergiesFormConfig.otherMedication.name}
            name={allergiesFormConfig.otherMedication.name}
            label={allergiesFormConfig.otherMedication.label}
            sx={{ width: "100%", mt: "2ch" }}
          />
        )}

        {showSubstanceOther && (
          <TextInputField
            id={allergiesFormConfig.otherSubstance.name}
            name={allergiesFormConfig.otherSubstance.name}
            label={allergiesFormConfig.otherSubstance.label}
            sx={{ width: "100%", mt: "2ch" }}
          />
        )}

        {allergySelected.some(
          (item) => item.group === allergenCats[0].uuid
        ) && (
          <TextInputField
            id="medication_Allergy_Details"
            name={"medication_Allergy_Details"}
            label="Medication allergy details"
            sx={{ width: "100%", mt: "2ch" }}
          />
        )}

        {allergySelected.some(
          (item) => item.group === allergenCats[1].uuid
        ) && (
          <TextInputField
            id="medical_Substance_Allergy_Details"
            name={"medical_Substance_Allergy_Details"}
            label="Medical substance allergy details"
            sx={{ width: "100%", mt: "2ch" }}
          />
        )}

        {allergySelected.some(
          (item) => item.group === allergenCats[3].uuid
        ) && (
          <TextInputField
            id="food_Allergy_Details"
            name={"food_Allergy_Details"}
            label="Food allergy details"
            sx={{ width: "100%", mt: "2ch" }}
          />
        )}

        {allergySelected.some(
          (item) => item.group === allergenCats[2].uuid
        ) && (
          <TextInputField
            id="substance_Allergy_Details"
            name={"substance_Allergy_Details"}
            label="Substance allergy details"
            sx={{ width: "100%", mt: "2ch" }}
          />
        )}

        <WrapperBox sx={{ mt: "2ch" }}>
          <MainButton
            variant="secondary"
            title="Previous"
            type="button"
            onClick={onPrevious}
            sx={{ flex: 1, marginRight: "8px" }}
          />
          <MainButton
            onClick={() => {}}
            variant="primary"
            title="Next"
            type="submit"
            sx={{ flex: 1 }}
          />
        </WrapperBox>
      </FormikInit>
    </>
  );
};
