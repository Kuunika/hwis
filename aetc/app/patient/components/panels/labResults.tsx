import { LabRequest } from "@/interfaces"
import { BaseTable } from "@/components"
import { GridValidRowModel } from "@mui/x-data-grid"
import { Typography } from "@mui/material"
export const LabResultsTable = ({ rows }: { rows: LabRequest[] }) => {


    const results: any= [
        // {
        //     id: "1",
        //     test: "Basic Metabolic Panel (BMP)",
        //     result: "positive"
        // }, {
        //     id: "2",
        //     test: "Lipid Panel",
        //     result: "negative"
        // }
    ]

    const columns = [
        { field: "test", headerName: "Test", flex: 1 },
        // { field: "sample", headerName: "Sample", flex: 1 },
        // { field: "specimen", headerName: "Specimen", flex: 1 },
        { field: "result", headerName: "result", flex: 1 },
    ]
    return results.length==0? <Typography>No results available</Typography>:<BaseTable rowHeight={25} rows={results} columns={columns} />
} 