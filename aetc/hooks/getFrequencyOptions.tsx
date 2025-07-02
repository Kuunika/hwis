import { useEffect, useState } from "react";
import { getConceptSet } from "./getConceptSet";
import { all } from "axios";

export const getFrequencyOptions = () => {
    const[frequencyOptions, setFrequencyOptions] = useState<any[]>([]);
    const { data: drugFrequencySet } = getConceptSet("General drug frequency");

    useEffect(() => {
          if(drugFrequencySet){
            const formattedOptions = drugFrequencySet.map((option: any) => ({
                id: option.uuid,
                label: option.name
              }));
            setFrequencyOptions(formattedOptions)
          }
    },[drugFrequencySet])


return{
    frequencyOptions
}

}