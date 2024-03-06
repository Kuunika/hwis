
import { useNavigation } from "@/hooks";
import { getAllUsers } from "@/hooks/users";


import { BaseTable, MainButton, MainPaper } from "shared-ui/src";

export const UsersList = () => {
    const { navigateTo } = useNavigation();
    const {
        data: users,
        isLoading,

    } = getAllUsers();

    const rows = users?.map(user => {
        return {
            id: user.uuid,
            userName: user.username,
            firstName: user.person.names[0].given_name,
            lastName: user.person.names[0].family_name,
            roles: user.user_roles.reduce((acc, current) => { return acc + current.role.role + "," }, '')
        }
    })

    const columns = [
        { field: "userName", headerName: "User Name", flex: 1 },
        { field: "firstName", headerName: "First Name", flex: 1 },
        { field: "lastName", headerName: "Last Name", flex: 1 },
        { field: "roles", headerName: "Roles", flex: 1 },

        {
            field: "action",
            headerName: "Action",
            renderCell: (cell: any) => {
                return (
                    <MainButton
                        variant="secondary"
                        sx={{ fontSize: "12px" }}
                        title={"view"}
                        onClick={() => { }}
                    />
                );
            },
        },
    ];

    return (
        <BaseTable loading={isLoading} columns={columns} rows={rows ? rows : []} />

    );
};
