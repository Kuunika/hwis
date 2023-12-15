import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

type IProp = {
  width?: string;
  height?: string;
  columns: GridColDef[];
  rows: GridRowsProp;
  hidePagination?: boolean;
  rowWidth?: number;
  style?: any;
  loading?: boolean;
};

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === "light"
      ? "rgba(0,0,0,.85)"
      : "rgba(255,255,255,0.85)",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  WebkitFontSmoothing: "auto",
  letterSpacing: "normal",
  "& .MuiDataGrid-columnsContainer": {
    backgroundColor: theme.palette.mode === "light" ? "#fafafa" : "#1d1d1d",
  },
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
    borderRight: `1px solid ${
      theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
    }`,
  },
  "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    borderBottom: `1px solid ${
      theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
    }`,
  },
  "& .MuiDataGrid-cell": {
    color:
      theme.palette.mode === "light"
        ? "rgba(0,0,0,.85)"
        : "rgba(255,255,255,0.65)",
  },
  "& .MuiPaginationItem-root": {
    borderRadius: 0,
  },
}));

const Table: React.FC<IProp> = ({
  rows,
  columns,
  hidePagination = false,
  height = "100%",
  width = "100%",

  style,
}) => {
  console.log({ columns });
  let columnVisibilityModel: any = {};

  // if (columns.length > 0) {
  //   // if (columns[i]) columnVisibilityModel[columns[i].field] = false;
  //   columns.reduce((cumulative, current) => {
  //     cumulative[`${current.field}`] = false;
  //     return;
  //   }, {});
  // }

  // if (columns.length > 4) {
  //   for (let i = 4; i < columns.length - 1, i++; ) {
  //     // if (columns[i]) columnVisibilityModel[columns[i].field] = false;
  //   }
  // }
  return (
    <div style={{ height, width, ...style }}>
      <DataGrid
        sx={{ my: "1ch", borderStyle: "none" }}
        rows={rows}
        columns={columns}
        hideFooterPagination={hidePagination}
        initialState={{
          columns: {
            columnVisibilityModel,
          },
        }}
      />
    </div>
  );
};

export const BaseTable = Table;
