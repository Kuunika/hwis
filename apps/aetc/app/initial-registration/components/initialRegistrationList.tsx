import { useNavigation } from "@/hooks";
import { getInitialRegisteredPatients } from "@/hooks/patientReg";
import { getVisitNum } from "@/hooks/visitNumber";
import { useEffect } from "react";
import { BaseTable, MainButton } from "shared-ui/src";

export const InitialRegistrationList = () => {
  const { navigateTo } = useNavigation();
  const { data } = getVisitNum();
  const { data: patients, isLoading, refetch } = getInitialRegisteredPatients();

  const rows = patients?.map((p) => ({ id: p?.uuid, ...p }));

  // useEffect(() => {
  //   refetch();
  // }, []);

  const columns = [
    { field: "visitNumber", headerName: "Visit Number", flex: 1 },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "arrivalTime", headerName: "Arrival Time", flex: 1 },

    {
      field: "action",
      headerName: "Action",
      renderCell: (cell: any) => {
        return (
          <MainButton
            sx={{ fontSize: "12px" }}
            title={"screen"}
            onClick={() => navigateTo(`/prescreening/${cell.id}`)}
          />
        );
      },
    },
  ];

  return (
    <BaseTable loading={isLoading} columns={columns} rows={rows ? rows : []} />
  );
};
