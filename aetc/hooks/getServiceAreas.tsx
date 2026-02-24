import { useEffect, useState } from "react";
import { getConceptSet } from "./getConceptSet";

export const getServiceAreas = () => {
  const { data: serviceAreas, isLoading: serviceAreaLoading } =
    getConceptSet("Service areas");
  const [serviceAreaOptions, setServiceAreaOptions] = useState<
    { label: string; id: string }[]
  >([]);

  useEffect(() => {
    if (serviceAreas) {
      const options = serviceAreas.map((serviceArea: any) => ({
        label: serviceArea.name,
        id: serviceArea.uuid,
      }));
      setServiceAreaOptions(options);

      // Find the "Other" option if it exists
      const otherOption = options.find(
        (option: { id: string; label: string }) => option.label === "Other"
      );
    }
  }, [serviceAreas]);

  return { serviceAreaOptions, serviceAreaLoading, serviceAreas };
};
