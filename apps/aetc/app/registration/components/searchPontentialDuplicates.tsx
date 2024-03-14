import { GenericDialog } from "@/components";
import { useNavigation } from "@/hooks";
import { searchByDemographics } from "@/hooks/patientReg";
import { DDEScore } from "@/interfaces";
import { BaseTable, MainButton, MainTypography } from "shared-ui/src";

type Prop = {
    open: boolean
    ddePatients: DDEScore[]
}

export const SearchPotentialDuplicates = ({ open, ddePatients }: Prop) => {
    const { navigateTo } = useNavigation()
    const columns = [
        { field: "given_name", headerName: "First Name", flex: 1 },
        { field: "family_name", headerName: "Last Name", flex: 1 },
        { field: "birthdate", headerName: "Birth date", flex: 1 },
        { field: "gender", headerName: "Gender", },
        { field: "home_village", headerName: "Home Village", flex: 1 },
        { field: "home_traditional_authority", headerName: "Home Traditional Authority", flex: 1 },
        { field: "home_district", headerName: "Home District", flex: 1 },
        { field: "score", headerName: "Score" },
        {
            field: "action",
            headerName: "Action",
            renderCell: (cell: any) => {
                return (
                    <MainButton
                        sx={{ fontSize: "12px" }}
                        title={"start"}
                        onClick={() => navigateTo(`/registration/${cell.id}/search`)}
                    />
                );
            },
        },
    ];

    const rows = ddePatients.map(d => ({ ...d.person, score: d.score }))

    return <GenericDialog title="Check Potential Duplicates" open={open} onClose={() => { }}>
        <BaseTable columns={columns} rows={rows} />
    </GenericDialog>
}

