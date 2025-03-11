import { useMemo } from "react";
import React from "react";

// MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

// Material UI Imports
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
} from "@mui/material";

// Icons Imports
import { Delete, Edit } from "@mui/icons-material";

// Date Picker Imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Generic type for any data row
export type DataRow = Record<string, any>;

// Props for the reusable table component
export interface ReusableTableProps<T extends DataRow> {
  data: T[];
  columns: MRT_ColumnDef<T>[];
  title?: string;
  enableRowActions?: boolean;
  enableRowSelection?: boolean;
  enableExpanding?: boolean;
  enableColumnFilterModes?: boolean;
  enableColumnOrdering?: boolean;
  enableGrouping?: boolean;
  enableColumnPinning?: boolean;
  enableFacetedValues?: boolean;
  getSubRows?: (row: T) => T[];
  onRowActionDelete?: (row: T) => void;
  onRowActionEdit?: (row: T) => void;
  onBulkAction?: (rows: T[]) => void;
  bulkActionLabel?: string;
  initialState?: any;
}

export const ReusableTable = <T extends DataRow>({
  data,
  columns,
  title = "Data Table",
  enableRowActions = false,
  enableRowSelection = false,
  enableExpanding = false,
  enableColumnFilterModes = true,
  enableColumnOrdering = true,
  enableGrouping = false,
  enableColumnPinning = true,
  enableFacetedValues = true,
  getSubRows,
  onRowActionDelete,
  onRowActionEdit,
  onBulkAction,
  bulkActionLabel = "Action",
  initialState = {
    showColumnFilters: false,
    showGlobalFilter: true,
    columnPinning: {
      left: ["mrt-row-expand", "mrt-row-select"],
      right: ["mrt-row-actions"],
    },
  },
}: ReusableTableProps<T>) => {
  const table = useMaterialReactTable({
    columns,
    data,
    enableExpanding,
    enableColumnFilterModes,
    enableColumnOrdering,
    enableGrouping,
    enableColumnPinning,
    enableFacetedValues,
    enableRowActions,
    enableRowSelection,
    initialState,
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
    getSubRows,
    ...(enableRowActions && {
      renderRowActionMenuItems: ({ row, closeMenu }) =>
        [
          onRowActionDelete && (
            <MenuItem
              key="delete"
              onClick={() => {
                onRowActionDelete(row.original);
                closeMenu();
              }}
              sx={{ m: 0 }}
            >
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              Delete
            </MenuItem>
          ),
          onRowActionEdit && (
            <MenuItem
              key="edit"
              onClick={() => {
                onRowActionEdit(row.original);
                closeMenu();
              }}
              sx={{ m: 0 }}
            >
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              Edit
            </MenuItem>
          ),
        ].filter(Boolean),
    }),
    renderTopToolbar: ({ table }) => {
      const handleBulkAction = () => {
        if (onBulkAction) {
          const selectedRows = table
            .getSelectedRowModel()
            .flatRows.map((row) => row.original);
          onBulkAction(selectedRows);
        }
      };

      return (
        <div>
          {title && (
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
              {title}
            </Typography>
          )}

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

            {onBulkAction && (
              <Box>
                <Box sx={{ display: "flex", gap: "0.5rem" }}>
                  <Button
                    color="primary"
                    disabled={!table.getIsSomeRowsSelected()}
                    onClick={handleBulkAction}
                    variant="contained"
                  >
                    {bulkActionLabel}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </div>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};
