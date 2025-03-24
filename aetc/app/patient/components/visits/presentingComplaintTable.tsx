import { useMemo } from "react";

//MRT Imports
import { type MRT_ColumnDef } from "material-react-table";

//Date Picker Imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { getHumanReadableDateTime } from "@/helpers/dateTime";
import { ReusableTable } from "@/components/tables/table";
import { ObjectRow } from "./interface";

export function PresentingComplaintTable({
  data,
  title = "",
}: {
  data: any;
  title?: string;
}) {
  // Transform data
  const transformedData = useMemo(() => {
    if (!data) return [];

    return data.map((item: any) => ({
      value: item.value || "",
      duration: item?.children[0]?.value || "",
      date: getHumanReadableDateTime(item.obs_datetime) || "",
      managerId: item.managerId,
      id: item.obs_id,
    }));
  }, [data]);

  // Define columns for vitals
  const columns = useMemo<MRT_ColumnDef<ObjectRow>[]>(
    () => [
      {
        accessorKey: "value",
        filterVariant: "autocomplete",
        header: "Presenting Complaint",
        size: 100,
      },
      {
        accessorKey: "duration",
        filterVariant: "autocomplete",
        header: "duration",
        size: 100,
      },
      {
        accessorKey: "date",
        filterVariant: "autocomplete",
        header: "Date",
        size: 100,
      },
    ],
    []
  );

  const rootData = useMemo(
    () => transformedData.filter((r: ObjectRow) => !r.managerId),
    [transformedData]
  );

  // const handleVoid = (rows: ObjectRow[]) => {
  //   rows.forEach((row) => {
  //     alert("voiding " + row.name);
  //   });
  // };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReusableTable<ObjectRow>
        data={rootData}
        columns={columns}
        title={title}
        // enableRowActions={true}
        // enableRowSelection={true}
        // onRowActionDelete={(row) => alert("voiding " + row.name)}
        // onRowActionEdit={(row) => alert("editing " + row.name)}
        // onBulkAction={handleVoid}
        // bulkActionLabel="Void"
      />
    </LocalizationProvider>
  );
}
