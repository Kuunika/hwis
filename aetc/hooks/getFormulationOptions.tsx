import { useEffect, useState } from "react";
import { getConceptSet } from "./getConceptSet";
import { all } from "axios";

export const getFormulationOptions = () => {
    const[formulationOptions, setFormulationOptions] = useState<any[]>([]);
    const { data: drugFormulationSet } = getConceptSet("Formulation");

    useEffect(() => {
          if(drugFormulationSet){
            const formattedOptions = drugFormulationSet.map((option: any) => ({
                id: option.uuid,
                label: option.name
              }));
            setFormulationOptions(formattedOptions)
          }
    },[drugFormulationSet])


return{
    formulationOptions
}

}