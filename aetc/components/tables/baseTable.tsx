"use client";
import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import {
  Box,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
} from "@mui/material";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { isToday } from "@/helpers/dateTime";
import { PaginationModel } from "@/interfaces";

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
  checkboxSelection?: boolean;
  paginationMode?: "client" | "server";
  getSelectedItems?: (items: any) => void;
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
  getSelectedItems = (items: any) => {},
}) => {
  const [searchText, setSearchText] = React.useState("");
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const [showTodayOnly, setShowTodayOnly] = React.useState(false);

  let columnVisibilityModel: any = {};

  React.useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  React.useEffect(() => {
    requestSearch("");
  }, [showTodayOnly]);

  const requestSearch = (searchValue: any) => {
    setSearchText(searchValue);
    let filteredRows = rows.filter((row) => {
      return Object.keys(row).some((field) =>
        row[field]
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchValue.toLowerCase())
      );
    });

    if (showTodayOnly) {
      filteredRows = filteredRows.filter((row) => isToday(row.arrival_time));
    }

    setFilteredRows(filteredRows);
  };

  // if (loading) {
  //   return (
  //     <Stack sx={{ m: "1ch" }} spacing={1}>
  //       <Stack direction={"row"} spacing={1}>
  //         <Skeleton variant="rounded" width={"100%"} height={40} />
  //         <Skeleton variant="rounded" width={"100%"} height={40} />
  //         <Skeleton variant="rounded" width={"100%"} height={40} />
  //         <Skeleton variant="rounded" width={"100%"} height={40} />
  //         <Skeleton variant="rounded" width={"100%"} height={40} />
  //       </Stack>
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //       <Skeleton variant="rounded" width={"100%"} height={20} />
  //     </Stack>
  //   );
  // }

  const handleSwitchChange = (value: any) => {
    setShowTodayOnly(value.target.checked);
  };

  return (
    <div style={{ height, width, ...style }}>
      <TopBarComponents
        searchText={searchText}
        handleSwitchChange={handleSwitchChange}
        requestSearch={requestSearch}
      />
      <DataGrid
        onRowSelectionModelChange={getSelectedItems}
        checkboxSelection={checkboxSelection}
        rowHeight={rowHeight}
        sx={{ my: "1ch", borderStyle: "none" }}
        loading={loading}
        rows={filteredRows}
        columns={columns}
        hideFooterPagination={hidePagination}
        paginationModel={{ page: 0, pageSize: 10 }}
        paginationMode="server"
        onPaginationModelChange={(pagination) => console.log({ pagination })}
        initialState={{
          columns: {
            columnVisibilityModel,
          },
        }}
      />
    </div>
  );
};

interface ServerPaginationTableProp {
  columns: any;
  rows: Array<any>;
  loading: boolean;
  paginationModel: PaginationModel;
  setPaginationModel: (values: any) => void;
  rowCount: number;
  searchText?:string;
  setSearchString: (values:any)=>void
}

export const ServerPaginationTable = ({
  columns,
  rows,
  loading,
  setPaginationModel,
  paginationModel,
  rowCount,
  searchText,
  setSearchString
}: ServerPaginationTableProp) => {
  
  return (
    <>
    <TopBarComponents searchText={searchText ?? ""} requestSearch={setSearchString} />
      <DataGrid
        sx={{ my: "1ch", borderStyle: "none" }}
        initialState={{
          pagination: { paginationModel: { page: 1, pageSize: 10 } },
        }}
        loading={loading}
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        rowCount={rowCount}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        autoHeight
      />
    </>
  );
};

const TopBarComponents = ({
  searchText,
  requestSearch,
  handleSwitchChange,
}: {
  searchText: string;
  requestSearch: (value: any) => void;
  handleSwitchChange?: (values: any) => void;
}) => {
  return (
    <Box>
      <TextField
        sx={{ m: 1, width: "30%" }}
        variant="outlined"
        placeholder="Search Patient"
        value={searchText}
        onChange={(e) => requestSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaMagnifyingGlass />
            </InputAdornment>
          ),
        }}
      />

    { handleSwitchChange && <FormControlLabel
        control={<Switch onChange={handleSwitchChange} name="" size="medium" />}
        label="Show only patients registered today"
      />}
    </Box>
  );
};

export const BaseTable = Table;
