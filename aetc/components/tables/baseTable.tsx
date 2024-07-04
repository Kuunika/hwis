'use client'
import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { TextField, Toolbar } from '@mui/material';

type IProp = {
  width?: string;
  height?: string;
  columns: GridColDef[];
  rows: GridRowsProp;
  hidePagination?: boolean;
  rowWidth?: number;
  style?: any;
  rowHeight?: number;
  loading?: boolean;
  checkboxSelection?: boolean

  getSelectedItems?: (items: any) => void
};

const Table: React.FC<IProp> = ({
  rows,
  columns,
  hidePagination = false,
  height = "100%",
  width = "100%",
  loading,
  style,
  rowHeight,
  checkboxSelection = false,
  getSelectedItems = (items: any) => { console.log(items) }
}) => {
  const [searchText, setSearchText] = React.useState('');
  const [filteredRows, setFilteredRows] = React.useState(rows);
  let columnVisibilityModel: any = {};


  React.useEffect(()=>{
    setFilteredRows(rows)
  },[rows])


  const requestSearch = (searchValue:any) => {
    setSearchText(searchValue);
    const filteredRows = rows.filter((row) => {
      return Object.keys(row).some((field) =>
        row[field]?.toString()?.toLowerCase()?.includes(searchValue.toLowerCase())
      );
    });
    setFilteredRows(filteredRows);
  };

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

  if (loading) {
    return (
      <Stack sx={{ m: "1ch" }} spacing={1}>
        <Stack direction={"row"} spacing={1}>
          <Skeleton variant="rounded" width={"100%"} height={40} />
          <Skeleton variant="rounded" width={"100%"} height={40} />
          <Skeleton variant="rounded" width={"100%"} height={40} />
          <Skeleton variant="rounded" width={"100%"} height={40} />
          <Skeleton variant="rounded" width={"100%"} height={40} />
        </Stack>
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
        <Skeleton variant="rounded" width={"100%"} height={20} />
      </Stack>
    );
  }

  return (
    <div style={{ height, width, ...style }}>
    
        <TextField
        sx={{m:1}}
          variant="outlined"
          placeholder="Search…"
          value={searchText}
          onChange={(e) => requestSearch(e.target.value)}
        />
    

      <DataGrid
        // getRowClassName={(test: any) => {
        //   console.log({ test })
        //   return 'triage-red'
        // }}
        onRowSelectionModelChange={getSelectedItems}
        checkboxSelection={checkboxSelection}
        rowHeight={rowHeight}
        sx={{ my: "1ch", borderStyle: "none" }}
        rows={filteredRows}
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
