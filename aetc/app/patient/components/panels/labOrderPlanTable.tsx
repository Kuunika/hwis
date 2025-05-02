import { useParameters } from "@/hooks";
import { BaseTable } from "@/components";
import { Typography } from "@mui/material";
import { getHumanReadableDateTimeLab } from "@/helpers/dateTime";
import { getPatientsEncounters } from "@/hooks/encounter";
import { encounters } from "@/constants";

export const LabOrderPlanTable = () => {
  const { params } = useParameters();
  const { data: labOrdersPlan } = getPatientsEncounters(
    params?.id as string,
    `encounter_type=${encounters.LAB_ORDERS_PLAN}`
  );

  const columns = [
    {
      field: "specimen",
      headerName: "Specimen",
      flex: 1,
      renderCell: (cell: any) => {
        return cell.row.specimen.name;
      },
    },
    {
      field: "test",
      headerName: "Test(s)",
      flex: 1,
      renderCell: (cell: any) => {
        return cell.row.test.name;
      },
    },
    { field: "date", headerName: "Date", flex: 1 },
  ];

  let flattenedLabOrdersPlan = [];
  if (labOrdersPlan && labOrdersPlan?.length > 0) {
    flattenedLabOrdersPlan = labOrdersPlan[0]?.obs?.flatMap((obs: any) =>
      obs.children.map((test: any) => ({
        test: test.names[0].name,
        date: getHumanReadableDateTimeLab(obs.obs_datetime),
        specimen: obs.names[0].name,
        id: test.obs_id,
      }))
    );
  }

  return (
    <>
      {flattenedLabOrdersPlan.length === 0 ? (
        <Typography>No lab orders added</Typography>
      ) : (
        <BaseTable
          height="25ch"
          showTopBar={false}
          rowHeight={25}
          rows={flattenedLabOrdersPlan}
          columns={columns}
        />
      )}
    </>
  );
};
