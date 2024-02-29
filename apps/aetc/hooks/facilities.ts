import { useQuery } from "@tanstack/react-query";
import facilities from "../constants/facilities-latest.json"
import axios from "axios";
export const getFacilities = () => {
  const getMHFRFacilities = async () => {
    const response = await axios.get(
      "https://zipatala.health.gov.mw/api/facilities"
    );

    return response.data;
  };

  return useQuery({
    queryKey: ["facilities"],
    queryFn: getMHFRFacilities,
    enabled: true,
    initialData: facilities
  });
};
