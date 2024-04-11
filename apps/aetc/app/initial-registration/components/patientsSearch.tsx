
import { ViewPatient } from "@/app/patient/components/viewPatient";
import { GenericDialog } from "@/components";
import { OverlayLoader } from "@/components/backdrop";
import { useNavigation } from "@/hooks";
import { DDESearch, Person } from "@/interfaces";
import { useEffect, useState } from "react";
import { BaseTable, MainButton } from "shared-ui/src";



export const PatientSearchResults = ({ open, onClose, isLoading, patientResults }: { open: boolean, isLoading?: boolean, onClose: () => void, patientResults: DDESearch }) => {
    const { navigateTo } = useNavigation();
    const [selectedPatient, setSelectedPatient] = useState<Person | undefined>();


    const rows = [...patientResults.locals, ...patientResults.remotes]

    const columns = [
        { field: "given_name", headerName: "First Name", flex: 1 },
        { field: "family_name", headerName: "Last Name", flex: 1 },
        { field: "gender", headerName: "Gender", flex: 1 },
        { field: "birthdate", headerName: "Birthdate", flex: 1 },
        {
            field: "homeDistrict", headerName: "Home District", renderCell: (cell: any) => {
                return cell.row.addresses[0].address1
            }
        },
        {
            field: "homeTraditionalAuthority", headerName: "Home TA", renderCell: (cell: any) => {
                return cell.row.addresses[0].county_district
            }
        },
        {
            field: "homeVillage", headerName: "Home Village", renderCell: (cell: any) => {
                return cell.row.addresses[0].address2
            }
        },
        {
            field: "action",
            flex: 1,
            headerName: "Action",
            renderCell: (cell: any) => {
                return (
                    <>
                        <MainButton
                            sx={{ fontSize: "12px" }}
                            title={"screen"}
                            onClick={() => setSelectedPatient(cell.row)}
                        />
                    </>
                );
            },
        },
    ];


    return <GenericDialog maxWidth="sm" title={"Patient Search Results"} open={open} onClose={onClose}>
        {!selectedPatient && <BaseTable columns={columns} rows={rows} />}
        {selectedPatient && <>
            <ViewPatient patient={selectedPatient} />
        </>}

        <OverlayLoader open={Boolean(isLoading)} />
    </GenericDialog>
} 