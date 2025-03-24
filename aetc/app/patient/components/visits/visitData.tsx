import { useMemo } from "react";

//MRT Imports
import { type MRT_ColumnDef } from "material-react-table";

//Date Picker Imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { getHumanReadableDateTime } from "@/helpers/dateTime";
import { ReusableTable } from "@/components/tables/table";
import { ObjectRow } from "./interface";
import {Box, Typography} from "@mui/material";
import {VisitForm} from "@/app/patient/components/visits/visitForm";

export function VisitData({
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
      names: item.names?.[0]?.name || "Unknown",
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
      <Box sx={{ padding: 2 }}>
        {title && (
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {title}
            </Typography>
        )}
        <VisitForm data={transformedData} />
      </Box>
  );
}
