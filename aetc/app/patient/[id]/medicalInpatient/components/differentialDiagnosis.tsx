import ECTReactComponent from "@/components/form/ECTReactComponent"
import { useState } from "react";
import { MinimalTable } from "@/components/tables/minimalTable";
import { Button } from "@mui/material";

export const DifferentialDiagnosis = ({onSubmit}:{onSubmit:()=>void}) => {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>([]);
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
        <Button variant="contained" onClick={onSubmit}>Finish and Submit</Button>
    </>
}