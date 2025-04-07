import { useState, useEffect } from "react";
import { getAllDrugs } from "./drugs";

const PRIORITY_DRUGS = [
  "Adrenaline 1/1000, 1ml",
  "Amiodarone",
  "Dextrose (glucose) 5%",
  "Calcium gluconate 10%",
];

const useFetchMedications = () => {
  const { data, isPending: loadingDrugs } = getAllDrugs();
  const [medicationOptions, setMedicationOptions] = useState<
    { id: string; label: string }[]
  >([]);

  useEffect(() => {
    if (data) {
      const formatMedicationOptions = (data: any) => {
        // Separate priority and non-priority drugs
        const priorityDrugOptions: { id: string; label: string }[] = [];
        const otherDrugOptions: { id: string; label: string }[] = [];

        // Create a mapping of drug names to their full drug objects
        const drugMap = new Map(
          data.map((drug: { concept_uuid: string; name: string }) => [
            drug.name,
            { id: drug.concept_uuid, label: drug.name },
          ])
        );

        // First, add priority drugs in the specified order
        PRIORITY_DRUGS.forEach((drugName) => {
          const drugOption: any = drugMap.get(drugName);
          if (drugOption) {
            priorityDrugOptions.push(drugOption);
            drugMap.delete(drugName);
          }
        });

        // Then add remaining drugs
        drugMap.forEach((drugOption: any) => {
          otherDrugOptions.push(drugOption);
        });

        // Combine priority drugs with other drugs
        return [...priorityDrugOptions, ...otherDrugOptions];
      };

      setMedicationOptions(formatMedicationOptions(data));
    }
  }, [data]);

  return { medicationOptions, loadingDrugs };
};

export default useFetchMedications;
