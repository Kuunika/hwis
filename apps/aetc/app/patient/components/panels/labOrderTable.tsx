
import { LabRequest } from "@/interfaces"
import { BaseTable } from "shared-ui/src"
export const LabOrderTable = ({ rows }: { rows: LabRequest[] }) => {
    const columns = [
        { field: "test", headerName: "Test", flex: 1 },
        { field: "status", headerName: "status", flex: 1 },
    ]
    return <BaseTable rowHeight={25} rows={rows.map(r => ({ test: r.test.name, id: r.test.concept_id, status: "pending..." }))} columns={columns} />
} 