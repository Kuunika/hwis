import { useEffect, useState } from "react";
import { getConceptSet } from "./getConceptSet";

export const useAllergyFormat = () => {
  const { data: allergenCats } = getConceptSet("Allergen Category");
  const [allergyOptions, setAllergyOptions] = useState<any[]>([]);
  const { data: medicationAllergens } = getConceptSet("Medication Allergens");
  const { data: medicalSubstanceAllergens } = getConceptSet(
    "Medical Substance Allergens"
  );
  const { data: substanceAllergens } = getConceptSet("Substance Allergens");
  const { data: foodAllergens } = getConceptSet("Food Allergens");

  useEffect(() => {
    let medicationOptions: { value: string; label: string }[] = [];
    let foodOptions: { value: string; label: string }[] = [];
    let substanceOptions: { value: string; label: string }[] = [];
    let medicalSubstanceOptions: { value: string; label: string }[] = [];

    if (
      medicationAllergens &&
      foodAllergens &&
      substanceAllergens &&
      medicalSubstanceAllergens
    ) {
      foodOptions = foodAllergens.map(
        ({ name, uuid }: { name: string; uuid: string }) => ({
          value: uuid,
          label: name,
        })
      );

      substanceOptions = substanceAllergens.map(
        ({ name, uuid }: { name: string; uuid: string }) => ({
          value: uuid,
          label: name,
        })
      );

      medicalSubstanceOptions = medicalSubstanceAllergens.map(
        ({ name, uuid }: { name: string; uuid: string }) => ({
          value: uuid,
          label: name,
        })
      );

      medicationOptions = medicationAllergens.map(
        ({ name, uuid }: { name: string; uuid: string }) => ({
          value: uuid,
          label: name,
        })
      );
    }

    if (allergenCats) {
      const allergyOptions = [
        {
          label: allergenCats[0].name,
          value: allergenCats[0].uuid,
          options: medicationOptions,
        },
        {
          label: allergenCats[1].name,
          value: allergenCats[1].uuid,
          options: medicalSubstanceOptions,
        },
        {
          label: allergenCats[2].name,
          value: allergenCats[2].uuid,
          options: substanceOptions,
        },
        {
          label: allergenCats[3].name,
          value: allergenCats[3].uuid,
          options: foodOptions,
        },
      ];

      setAllergyOptions(allergyOptions);
    }
  }, [
    allergenCats,
    medicationAllergens,
    foodAllergens,
    substanceAllergens,
    medicalSubstanceAllergens,
  ]);

  return {
    allergyOptions,
    medicationAllergens,
    foodAllergens,
    medicalSubstanceAllergens,
    substanceAllergens,
    allergenCats,
  };
};
