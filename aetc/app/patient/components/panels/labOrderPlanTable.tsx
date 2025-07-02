import { useParameters } from "@/hooks";
import { BaseTable } from "@/components";
import { Typography } from "@mui/material";
import { getHumanReadableDateTimeLab } from "@/helpers/dateTime";
import { getPatientsEncounters } from "@/hooks/encounter";
import { encounters } from "@/constants";

function getAvailableFlags(obs: any) {
  const flags = [];

  if (Array.isArray(obs.children)) {
    for (const child of obs.children) {
      const name = child.names?.[0]?.name;
      if (name === "Emergency" || name === "Urgent") {
        flags.push(name);
      }
    }
  }

  return flags.join(", ");
}
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
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      renderCell: (cell: any) => {
        return cell.row.test.priority;
      },
    },
    { field: "date", headerName: "Date", flex: 1 },
  ];

  let flattenedLabOrdersPlan = [];
  if (labOrdersPlan && labOrdersPlan?.length > 0) {
    flattenedLabOrdersPlan = labOrdersPlan[0]?.obs?.flatMap((obs: any) =>
      obs.children.map((test: any) => {
        return {
          test: test.names[0].name,
          date: getHumanReadableDateTimeLab(obs.obs_datetime),
          specimen: obs.names[0].name,
          priority: getAvailableFlags(test),
          id: test.obs_id,
        };
      })
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
