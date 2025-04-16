import { useNavigation } from "@/hooks";
import { BaseTable, MainButton } from "@/components";
import { getAllDeathReports } from "@/hooks/patientReg";

export const BroughtInDeadList = () => {
  const { navigateTo } = useNavigation();
  const { data, isLoading } = getAllDeathReports();

  const columns = [
    { field: "first_name", headerName: "First name", flex: 1 },
    { field: "surname", headerName: "Surname", flex: 1 },
    { field: "date_of_birth", headerName: "Date Of Birth", flex: 1 },
    { field: "surname", headerName: "Surname", flex: 1 },
    { field: "age", headerName: "Age", flex: 1 },
    { field: "national_id", headerName: "National ID", flex: 1 },
    { field: "religion", headerName: "Religion", flex: 1 },
    { field: "place_of_residence", headerName: "Place Of Residence", flex: 1 },
    { field: "place_of_death", headerName: "Place Of Death", flex: 1 },
    { field: "date_of_death", headerName: "Date Of Death", flex: 1 },
    { field: "time_of_death", headerName: "Time Of Death" },
    { field: "gender_deceased", headerName: "Gender" },
    { field: "brought_by", headerName: "Brought By", flex: 1 },
    { field: "name_of_confirming_death", headerName: "Confirmed By", flex: 1 },
    {
      field: "date_confirming_death",
      headerName: "Date Of Confirmation",
      flex: 1,
    },
    {
      field: "time_of_death",
      headerName: "Time Of confirming Death",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (cell: any) => {
        return (
          <MainButton
            sx={{ fontSize: "12px" }}
            title={"view"}
            onClick={() =>
              navigateTo(`/registration/death/${cell.row.id}/view`)
            }
          />
        );
      },
    },
  ];

  return (
    <BaseTable
      loading={isLoading}
      showTopBar={false}
      columns={columns}
      rows={data ? data : []}
    />
  );
};
