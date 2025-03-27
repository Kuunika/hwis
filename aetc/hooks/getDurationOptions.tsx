import { useEffect, useState } from "react";
import { getConceptSet } from "./getConceptSet";
import { all } from "axios";

export const getDurationOptions = () => {
    const[durationOptions, setDurationOptions] = useState<any[]>([]);
    const { data: durationSet } = getConceptSet("Duration");

    useEffect(() => {
          durationSet?setDurationOptions(durationSet):null;
    },[durationSet])


return{
    durationOptions
}

}