import { useEffect, useState } from "react";
import { getConceptSet } from "./getConceptSet";

export const getCirculationOptions = () => {
    const[circulationOptions, setCirculationOptions] = useState<any[]>([]);
    const { data: circulationInterventionSet } = getConceptSet("Type of circulation intervention");

    useEffect(() => {
          if(circulationInterventionSet){
            const formattedOptions = circulationInterventionSet.map((option: any) => ({
                id: option.uuid,
                label: option.name
              }));
              setCirculationOptions(formattedOptions)
          }
    },[circulationInterventionSet])


return{
    circulationOptions
}

}