import { useMemo } from "react";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

//Material UI Imports
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
} from "@mui/material";

//Icons Imports
import { Delete, Edit } from "@mui/icons-material";

//Date Picker Imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { getHumanReadableDateTime } from "@/helpers/dateTime";
import { ReusableTable } from "@/components/tables/table";

export type VitalRow = {
  name: string;
  value: string;
  date: string;
  managerId?: string;
  id: string;
};

export function Vitals({ data }: { data: any }) {
  // Transform data
  const transformedData = useMemo(() => {
    if (!data) return [];

    return data.map((item: any) => ({
      name: item.names?.[0]?.name || "Unknown",
      value: item.value || "",
      date: getHumanReadableDateTime(item.obs_datetime) || "",
      managerId: item.managerId,
      id: item.obs_id,
    }));
  }, [data]);

  // Define columns for vitals
  const columns = useMemo<MRT_ColumnDef<VitalRow>[]>(
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
    () => transformedData.filter((r: VitalRow) => !r.managerId),
    [transformedData]
  );

  const handleVoid = (rows: VitalRow[]) => {
    rows.forEach((row) => {
      alert("voiding " + row.name);
    });
  };

  const getSubRows = (row: VitalRow) =>
    transformedData.filter((r: VitalRow) => r.managerId === row.id);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReusableTable<VitalRow>
        data={rootData}
        columns={columns}
        title="Vitals"
        enableRowActions={true}
        enableRowSelection={true}
        enableExpanding={true}
        getSubRows={getSubRows}
        onRowActionDelete={(row) => alert("voiding " + row.name)}
        onRowActionEdit={(row) => alert("editing " + row.name)}
        onBulkAction={handleVoid}
        bulkActionLabel="Void"
      />
    </LocalizationProvider>
  );
}
