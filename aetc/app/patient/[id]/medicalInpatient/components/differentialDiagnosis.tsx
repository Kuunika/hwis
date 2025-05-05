import ECTReactComponent from "@/components/form/ECTReactComponent"
import { useState } from "react";
import { MinimalTable } from "@/components/tables/minimalTable";
import { Button } from "@mui/material";
import { concepts } from "@/constants";
import { getDateTime } from "@/helpers/dateTime";
import OfflineICD11Selection from "@/components/form/offLineICD11Diagnosis";

export const DifferentialDiagnosis = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>([]);


    const handleClick = () => {
        const obsDatetime=getDateTime()
        const diagnosisObs =selectedDiagnosis.map((diagnosis:any)=>{
            return {
                concept: concepts.DIFFERENTIAL_DIAGNOSIS,
                value: `${diagnosis.code}-${diagnosis.diagnosis}`,
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
        console.log({selectedCondition});
        setSelectedDiagnosis((prevDiagnosis: any) => [
            ...prevDiagnosis,
            selectedCondition,
        ]);
    }

    return <>
        <MinimalTable columns={[{ label: "Code", field: "code" }, { label: "Diagnosis", field: "diagnosis" }]} data={selectedDiagnosis} />
        <br />
        <OfflineICD11Selection width="100%" label={"Diagnosis"} onSelection={handleAddDiagnosis} />
        <br />
        <Button variant="contained" onClick={handleClick}>Finish and Submit</Button>
    </>
}