import { useNavigation } from "@/hooks";
import { getPatientsWaitingForPrescreening } from "@/hooks/patientReg";
import { getVisitNum } from "@/hooks/visitNumber";
import { useEffect } from "react";
import { BaseTable, MainButton } from "shared-ui/src";

export const InitialRegistrationList = () => {
  const { navigateTo } = useNavigation();
  const { data } = getVisitNum();
  const {
    data: patients,
    isLoading,
    refetch,
  } = getPatientsWaitingForPrescreening();

  const rows = patients?.map((p) => ({ id: p?.uuid, ...p }));

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
