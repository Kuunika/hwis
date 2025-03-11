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

export type Employee = {
  name: string;
  value: string;
  date: string;
};

// Move this to be a proper component with memo
const Table = React.memo(({ data }: { data: any }) => {
  // Transform data only once using useMemo
  const transformedData = useMemo(() => {
    console.log("Transforming data");
    if (!data || !data.data) return [];

    return data.data.map((item: any) => ({
      name: item.names?.[0]?.name || "Unknown",
      value: item.value || "",
      date: getHumanReadableDateTime(item.obs_datetime) || "",
      managerId: item.managerId,
      id: item.obs_id,
    }));
  }, [data]);
  console.log("🚀 ~ transformedData ~ transformedData:", transformedData);

  // Define columns outside of render
  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
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

  const table = useMaterialReactTable({
    columns,
    data: transformedData,
    enableExpanding: true,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: true,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
    getSubRows: (row: any) =>
      transformedData.filter((r: any) => r.managerId === row.id),
    renderRowActionMenuItems: ({ closeMenu }) => [
      <MenuItem
        key="void"
        onClick={() => {
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        Void
      </MenuItem>,
      <MenuItem
        key="edit"
        onClick={() => {
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        Edit
      </MenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("activating " + row.getValue("name"));
        });
      };

      return (
        <div>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              padding: "8px",
              justifyContent: "center",
              width: "100%",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
            }}
          >
            Vitals
          </Typography>

          <Box
            sx={(theme) => ({
              backgroundColor: lighten(theme.palette.background.default, 0.05),
              display: "flex",
              gap: "0.5rem",
              p: "8px",
              justifyContent: "space-between",
            })}
          >
            <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <MRT_GlobalFilterTextField table={table} />
              <MRT_ToggleFiltersButton table={table} />
            </Box>

            <Box>
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  color="error"
                  disabled={!table.getIsSomeRowsSelected()}
                  onClick={handleActivate}
                  variant="contained"
                >
                  Void
                </Button>
              </Box>
            </Box>
          </Box>
        </div>
      );
    },
  });

  return <MaterialReactTable table={table} />;
});

export function Vitals({ data }: { data: any }) {
  // Create a stable reference to data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => ({ data }), [data]);

  console.log("Rendering Vitals component");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Table data={memoizedData} />
    </LocalizationProvider>
  );
}

// Required for React.memo to work with TypeScript
import React from "react";
