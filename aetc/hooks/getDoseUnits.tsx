import { useEffect, useState } from "react";
import { getConceptSet } from "./getConceptSet";

export const getDoseUnits = () => {
    const[doseUnits, setDoseUnits] = useState<any[]>([]);
    const { data: doseUnitSet } = getConceptSet("Dose units");

    useEffect(() => {
        doseUnitSet?setDoseUnits(doseUnitSet):null;
    },[doseUnitSet])


return{
    doseUnits
}

}