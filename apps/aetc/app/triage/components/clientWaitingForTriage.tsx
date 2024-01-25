import { useNavigation } from "@/hooks";
import { BaseTable, MainButton } from "shared-ui/src";

export const ClientWaitingForTriage = () => {
  const { navigateTo } = useNavigation();
  const rows = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      dob: "08 January 1995",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Doe",
      gender: "Female",
      dob: "08 January 1995",
    },
  ];

  const columns = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "dob", headerName: "Date Of Birth", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      renderCell: (cell: any) => {
        return (
          <MainButton
            sx={{ fontSize: "12px" }}
            title={"start Triage"}
            onClick={() => navigateTo(`/triage/${cell.id}/start`)}
          />
        );
      },
    },
  ];

  return <BaseTable columns={columns} rows={rows} />;
};
