
import { useParameters } from "@/hooks"
import { getPatientLabOrder } from "@/hooks/labOrder"
import { LabRequest } from "@/interfaces"
import { BaseTable, MainButton } from "shared-ui/src"
import { FaPrint } from "react-icons/fa6";
import { BarcodeComponent } from "@/components/barcode";
import { getPatientsWaitingForAssessment } from "@/hooks/patientReg";
export const LabOrderTable = () => {
    const { params } = useParameters();
    const { data: patients } = getPatientsWaitingForAssessment();
    const { data: labOrders, isPending, isSuccess } = getPatientLabOrder(params?.id as string);

    const patient = patients?.find(p => p.uuid == params.id);
    const columns = [
        { field: "name", headerName: "Test", flex: 1 },
        { field: "requesting_clinician", headerName: "Ordered By", flex: 1 },
        { field: "status", headerName: "status", flex: 1 },
        {
            field: "action", headerName: "Action", renderCell: (cell: any) => {
                const trigger = () => <MainButton variant="text" sx={{ color: "#000" }} title={<FaPrint />} onClick={() => { }} />

                return <BarcodeComponent trigger={trigger} value={cell.row.accession_number} display={`${patient?.given_name} ${patient?.family_name}`} />
            }
        }

    ]
    return <BaseTable rowHeight={25} rows={labOrders ? labOrders.map(lab => ({ ...lab, name: lab.tests[0].name, status: lab.tests[0].result ? "" : "waiting result..." })) : []} columns={columns} />
} 