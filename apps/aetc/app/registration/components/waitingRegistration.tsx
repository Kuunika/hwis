import { useNavigation } from "@/hooks";
import { BaseTable, MainButton } from "shared-ui/src";

export const WaitingRegistrationList = () => {
  const { navigateTo } = useNavigation();
  const rows = [
    {
      id: "1",
      visitNumber: "13",
      firstName: "John",
      lastName: "Doe",
      arrivalTime: "07:00",
    },
    {
      id: "2",
      visitNumber: "14",
      firstName: "Jane",
      lastName: "Doe",
      arrivalTime: "09:00",
    },
  ];

  const columns = [
    { field: "visitNumber", headerName: "Visit Number", flex: 1 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "arrivalTime", headerName: "Arrival Time", flex: 1 },

    {
      field: "action",
      headerName: "Action",
      renderCell: (cell: any) => {
        return (
          <MainButton
            sx={{ fontSize: "12px" }}
            title={"prescreening"}
            onClick={() => navigateTo(`/prescreening/${cell.id}`)}
          />
        );
      },
    },
  ];

  return <BaseTable columns={columns} rows={rows} />;
};
