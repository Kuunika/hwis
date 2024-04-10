
import { useParameters } from "@/hooks"
import { getPatientLabOrder } from "@/hooks/labOrder"
import { LabRequest } from "@/interfaces"
import { BaseTable, MainButton, MainTypography, WrapperBox } from "shared-ui/src"
import { FaPrint } from "react-icons/fa6";
import { BarcodeComponent } from "@/components/barcode";
import { getPatientsWaitingForAssessment } from "@/hooks/patientReg";
import { GenericDialog } from "@/components";
import { useState } from "react";
export const LabOrderTable = () => {
    const [triggerPrintFunc, setTriggerPrintFunc] = useState<() => any>(() => { })
    const { params } = useParameters();
    const { data: patients } = getPatientsWaitingForAssessment();
    const { data: labOrders, isPending, isSuccess } = getPatientLabOrder(params?.id as string);
    const patient = patients?.find(p => p.uuid == params.id);
    const [showDialog, setShowDialog] = useState(false)
    const [selectedTest, setSelectedTest] = useState({ test: "", ascension: "" })

    const columns = [
        { field: "name", headerName: "Test", flex: 1 },
        { field: "requesting_clinician", headerName: "Ordered By", flex: 1 },
        { field: "status", headerName: "status", flex: 1 },
        {
            field: "action", headerName: "Action", renderCell: (cell: any) => {
                const trigger = () => <MainButton variant="text" sx={{ color: "#000" }} title={<FaPrint />} onClick={() => { }} />
                return <MainButton title={"print"} variant="secondary" onClick={() => {
                    setShowDialog(true); setSelectedTest({
                        test: cell.row.name,
                        ascension: cell.row.accession_number
                    })
                }} />

            }
        }

    ]
    return <>
        <BaseTable rowHeight={25} rows={labOrders ? labOrders.map(lab => ({ ...lab, name: lab.tests[0].name, status: lab.tests[0].result ? "" : "waiting result..." })) : []} columns={columns} />
        <GenericDialog maxWidth="sm" open={showDialog} onClose={() => setShowDialog(false)} title={"Preview Barcode"}>
            <WrapperBox sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <BarcodeComponent setTriggerFunc={(test) => setTriggerPrintFunc(test)} value={selectedTest.ascension}>
                    <></>
                    {/* <MainTypography fontWeight="600" variant="h6">{`${patient?.names[0].given_name} ${patient?.names[0].family_name}`}</MainTypography> */}
                    <MainTypography fontWeight="600" variant="h6">{selectedTest.test}</MainTypography>
                    <MainTypography variant="body2">{`${patient?.given_name} ${patient?.family_name}`}</MainTypography>
                </BarcodeComponent>
                <MainButton title={"Print Barcode"} onClick={() => {
                    const func = triggerPrintFunc();
                    if (typeof func === 'function') {
                        func()
                    }
                }} />
            </WrapperBox>
        </GenericDialog>
    </>
}


