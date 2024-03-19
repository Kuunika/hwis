
import { useParameters } from "@/hooks"
import { getPatientLabOrder } from "@/hooks/labOrder"
import { LabRequest } from "@/interfaces"
import { BaseTable } from "shared-ui/src"
export const LabOrderTable = () => {
    const { params } = useParameters()
    const { data: labOrders, isPending, isSuccess } = getPatientLabOrder(params?.id as string);
    const columns = [
        { field: "name", headerName: "Test", flex: 1 },
        { field: "status", headerName: "status", flex: 1 },
    ]
    return <BaseTable rowHeight={25} rows={labOrders ? labOrders.map(lab => ({ ...lab, status: lab.result ? "" : "waiting result..." })) : []} columns={columns} />
} 