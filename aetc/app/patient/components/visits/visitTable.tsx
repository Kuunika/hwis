import { useMemo } from "react";

//MRT Imports
import { type MRT_ColumnDef } from "material-react-table";

//Date Picker Imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { getHumanReadableDateTime } from "@/helpers/dateTime";
import { ReusableTable } from "@/components/tables/table";
import { ObjectRow } from "./interface";

export function VisitTable({
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
      name: item.names?.[0]?.name || "",
      value: item.value || "",
      date: getHumanReadableDateTime(item.obs_datetime) || "",
      managerId: item.managerId,
      id: item.obs_id,
    }));
  }, [data]);

  // Define columns for vitals
  const columns = useMemo<MRT_ColumnDef<ObjectRow>[]>(
      () => [
        {
          accessorKey: "name",
          id: "name",
          header: "Name",
          size: 100,
        },
        {
          accessorKey: "value",
          filterVariant: "autocomplete",
          header: "Value",
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

  const getSubRows = (row: ObjectRow) =>
      transformedData.filter((r: ObjectRow) => r.managerId === row.id);

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ReusableTable<ObjectRow>
            data={rootData}
            columns={columns}
            title={title}
            // enableRowActions={true}
            // enableRowSelection={true}
            enableExpanding={true}
            getSubRows={getSubRows}
            // onRowActionDelete={(row) => alert("voiding " + row.name)}
            // onRowActionEdit={(row) => alert("editing " + row.name)}
            // onBulkAction={handleVoid}
            // bulkActionLabel="Void"
        />
      </LocalizationProvider>
  );
}