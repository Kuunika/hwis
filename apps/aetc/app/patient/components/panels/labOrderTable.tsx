import { LabRequest } from "@/interfaces"
import { BaseTable } from "shared-ui/src"
export const LabOrderTable = ({rows}:{rows:LabRequest[]})=>{

     
    const columns = [
        { field: "test", headerName: "Test", flex: 1 },
        // { field: "sample", headerName: "Sample", flex: 1 },
        // { field: "specimen", headerName: "Specimen", flex: 1 },
        { field: "status", headerName: "status", flex: 1 },
    ]
    return <BaseTable rowHeight={25} rows={rows} columns={columns} />
} 