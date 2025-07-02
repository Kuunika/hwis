import { useEffect, useState } from "react";
import { getConceptSet } from "./getConceptSet";

export const getExposureOptions = () => {
    const[exposureOptions, setExposureOptions] = useState<any[]>([]);
    const { data: exposureInterventionSet } = getConceptSet("Exposure interventions");

    useEffect(() => {
          if(exposureInterventionSet){
            const formattedOptions = exposureInterventionSet.map((option: any) => ({
                id: option.uuid,
                label: option.name
              }));

              
              setExposureOptions(formattedOptions)
          }
    },[exposureInterventionSet])


return{
    exposureOptions
}

}