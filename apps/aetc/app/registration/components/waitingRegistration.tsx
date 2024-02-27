import { getTime } from "@/helpers/dateTime";
import { useNavigation } from "@/hooks";
import { getPatientsWaitingForRegistrations } from "@/hooks/patientReg";
import { BaseTable, MainButton } from "shared-ui/src";

export const WaitingRegistrationList = () => {
  const { navigateTo } = useNavigation();
  const {
    data: patients,
    isLoading,
  } = getPatientsWaitingForRegistrations();
  const rows = patients?.map((p) => ({ id: p?.uuid, ...p, arrival_time: getTime(p.arrival_time) }));

  const columns = [
    { field: "aetc_visit_number", headerName: "Visit Number", flex: 1 },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "arrival_time", headerName: "Arrival Time", flex: 1 },

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

  return (
    <BaseTable loading={isLoading} columns={columns} rows={rows ? rows : []} />
  );
};
