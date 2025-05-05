import { useEffect, useState } from "react";
import { getConceptSet } from "./getConceptSet";

export const getDisabilityOptions = () => {
    const[disabilityOptions, setDisabilityOptions] = useState<any[]>([]);
    const { data: disabilityInterventionSet } = getConceptSet("Disability interventions");

    useEffect(() => {
          if(disabilityInterventionSet){
            const formattedOptions = disabilityInterventionSet.map((option: any) => ({
                id: option.uuid,
                label: option.name
              }));

              
              setDisabilityOptions(formattedOptions)
          }
    },[disabilityInterventionSet])


return{
    disabilityOptions
}

}