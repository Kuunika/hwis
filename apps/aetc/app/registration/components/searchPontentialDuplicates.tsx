import { GenericDialog } from "@/components";
import { useNavigation } from "@/hooks";
import { searchByDemographics } from "@/hooks/patientReg";
import { DDEScore } from "@/interfaces";
import { BaseTable, MainButton, MainTypography, WrapperBox } from "shared-ui/src";
import { FaCodeMerge } from "react-icons/fa6";
import { useState } from "react";


type Prop = {
    open: boolean
    ddePatients: DDEScore[],
    close: () => void
}

export const SearchPotentialDuplicates = ({ open, ddePatients, close }: Prop) => {
    const { navigateTo } = useNavigation()
    const [selectedRows, setSelectedRows] = useState([])

    const columns = [
        { field: "given_name", headerName: "First Name", flex: 1 },
        { field: "family_name", headerName: "Last Name", flex: 1 },
        { field: "birthdate", headerName: "Birth date", flex: 1 },
        { field: "gender", headerName: "Gender", },
        { field: "home_village", headerName: "Home Village", flex: 1 },
        { field: "home_traditional_authority", headerName: "Home Traditional Authority", flex: 1 },
        { field: "home_district", headerName: "Home District", flex: 1 },
        { field: "score", headerName: "Score" },
    ];

    const getSelectedItems = (patients: any) => {
        setSelectedRows(patients)
    }
    const rows = ddePatients.map(d => ({ ...d.person, score: d.score }))
    return <GenericDialog title="Check Potential Duplicates" open={open} onClose={() => { }}>
        <MainButton disabled={selectedRows.length == 0} title={"merge patients and continue"} sx={{ mr: 0.5 }} variant="primary" onClick={() => { }} />
        <MainButton title={"cancel"} variant="secondary" onClick={close} />
        {rows.length > 0 ? <BaseTable getSelectedItems={getSelectedItems} checkboxSelection={true} columns={columns} rows={rows} /> : <>
            <WrapperBox>
                <MainTypography variant="subtitle1">There are no patients matching the search criteria</MainTypography>
            </WrapperBox>
        </>}
    </GenericDialog>
}


