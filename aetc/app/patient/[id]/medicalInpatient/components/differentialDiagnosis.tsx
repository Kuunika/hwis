import ECTReactComponent from "@/components/form/ECTReactComponent"
import DiagnosisForm from "../../consultation/components/diagnosisForm"
import { useState } from "react";
import { MinimalTable } from "@/components/tables/minimalTable";
import { Button } from "@mui/material";

export const DifferentialDiagnosis = () => {
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
        <Button variant="contained" onClick={()=>{}}>Finish and Submit</Button>
    </>
}