import { useState, useEffect } from "react";
import { getAllDrugs } from "./drugs";

const useFetchMedications = () => {
  const { data, isPending: loadingDrugs } = getAllDrugs();
  const [medicationOptions, setMedicationOptions] = useState<
    { id: string; label: string }[]
  >([]);

  useEffect(() => {
    if (data) {
      const formatMedicationOptions = (data: any) => {
        return data.map((drug: { concept_uuid: string; name: string }) => ({
          id: drug.concept_uuid,
          label: drug.name,
        }));
      };
      setMedicationOptions(formatMedicationOptions(data));
    }
  }, [data]);

  return { medicationOptions, loadingDrugs };
};

export default useFetchMedications;
