import ECTReactComponent from "@/components/form/ECTReactComponent"
import { useState } from "react";
import { MinimalTable } from "@/components/tables/minimalTable";
import { Button } from "@mui/material";
import { concepts } from "@/constants";
import { getDateTime } from "@/helpers/dateTime";

export const DifferentialDiagnosis = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>([]);


    const handleClick = () => {
        const obsDatetime=getDateTime()
        const diagnosisObs =selectedDiagnosis.map((diagnosis:any)=>{
            return {
                concept: concepts.DIFFERENTIAL_DIAGNOSIS,
                value: `${diagnosis.code}-${diagnosis.bestMatchText}`,
                obsDatetime
            }
        })

        onSubmit([{
            concept: concepts.DIFFERENTIAL_DIAGNOSIS,
            value: concepts.DIFFERENTIAL_DIAGNOSIS,
            obsDatetime,
            groupMembers: diagnosisObs
        }])

    }
    const handleAddDiagnosis = (selectedCondition: any) => {
        setSelectedDiagnosis((prevDiagnosis: any) => [
            ...prevDiagnosis,
            selectedCondition,
        ]);
    }

    return <>
        <MinimalTable columns={[{ label: "Code", field: "code" }, { label: "Diagnosis", field: "selectedText" }]} data={selectedDiagnosis} />
        <br />
        <ECTReactComponent iNo={0} label={"Diagnosis"} onICD11Selection={handleAddDiagnosis} />
        <br />
        <Button variant="contained" onClick={handleClick}>Finish and Submit</Button>
    </>
}