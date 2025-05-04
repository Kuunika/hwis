import { useQuery } from "@tanstack/react-query";
import { searchICD11Diagnosis } from "@/services/diagnoses";
import { useDebounce } from "@/helpers/useDebounce";

interface ICD11Entity {
  code: string;
  diagnosis: string;
}

/**
 * Custom hook for searching ICD-11 diagnoses
 * Returns formatted results as ICD11Entity objects
 * 
 * @param searchString The search string
 * @param cacheTime Duration in ms to keep items in cache (default: 1 hour)
 */
export const useSearchDiagnoses = (
  searchString: string,
  cacheTime = 60 * 60 * 1000
) => {
  const debouncedSearch = useDebounce(searchString, 300);
  
  return useQuery({
    queryKey: ["icd11Search", debouncedSearch],
    queryFn: async () => {
      const response = await searchICD11Diagnosis(debouncedSearch);
      
      const formattedData: ICD11Entity[] = response.data.map((item: string) => {
        const lastHyphenIndex = item.lastIndexOf(" - ");
        if (lastHyphenIndex !== -1) {
          return {
            diagnosis: item.substring(0, lastHyphenIndex).trim(),
            code: item.substring(lastHyphenIndex + 3).trim()
          };
        }
        
        return {
          diagnosis: item,
          code: ""
        };
      });
      
      return formattedData;
    },
    enabled: !!debouncedSearch && debouncedSearch.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: cacheTime,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};