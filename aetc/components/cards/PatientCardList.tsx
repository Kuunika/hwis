"use client";
import { isToday } from "@/helpers/dateTime";
import { PaginationModel } from "@/interfaces";
import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";

type Prop = {
  id: string;
  visitNumber: string;
  firstName: string;
  lastName: string;
  arrivalTime: string;
  actor: any;
  actionName: string;
  waitingTime: any;
  aggregate: any;
  action: any;
  age?: any;
  gender: string;
  arrivalDateTime: string;
};
export const PatientCard = ({
  gender,
  visitNumber,
  firstName,
  lastName,
  actor,
  actionName,
  arrivalTime,
  waitingTime,
  aggregate,
  action,
  age,
}: Prop) => {
  return (
    <Paper sx={{ display: "flex", p: "1ch", m: "1ch" }}>
      <Box sx={{ flex: "0.2" }}>
        <Typography variant="h6">Visit No</Typography>
        <Typography variant="h4">{visitNumber}</Typography>
      </Box>
      <Box sx={{ flex: "0.6" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4">{`${firstName} ${lastName}`}</Typography>
          <Typography variant="h4">({`${gender[0]}`})</Typography>
        </Box>
        <Typography variant="h5">Age: {age}</Typography>
        <Typography variant="body2">
          Arrival Time: {arrivalTime} ~ Waiting time: {waitingTime}~ Aggregate:{" "}
          {aggregate}
        </Typography>
        <br />
        <Typography variant="body2">{`${actionName}`}</Typography>
        <Typography>{actor}</Typography>
      </Box>
      <Box sx={{ flex: "0.2" }}>{action}</Box>
    </Paper>
  );
};

export const PatientCardList = ({
  dataList,
  loading,
}: {
  loading: boolean;
  dataList: Prop[];
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState(dataList);
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  useEffect(() => {
    setFilteredRows(dataList);
  }, [dataList]);

  useEffect(() => {
    requestSearch("");
  }, [showTodayOnly]);

  const requestSearch = (searchValue: any) => {
    setSearchText(searchValue);
    let filteredRows = dataList.filter((row: any) => {
      return Object.keys(row).some((field) =>
        row[field]
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchValue.toLowerCase())
      );
    });

    if (showTodayOnly) {
      filteredRows = filteredRows.filter((row) =>
        isToday(row?.arrivalDateTime)
      );
    }
    setFilteredRows(filteredRows);
  };

  if (loading) {
    return (
      <Stack sx={{ m: "1ch" }} spacing={1}>
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
        <Skeleton variant="rounded" width={"100%"} height={200} />
      </Stack>
    );
  }

  if (dataList.length == 0) {
    return <Typography variant="body1">No patients on this list</Typography>;
  }

  const handleSwitchChange = (value: any) => {
    setShowTodayOnly(value.target.checked);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", px: "1ch" }}>
        <FormControlLabel
          control={
            <Switch onChange={handleSwitchChange} name="" size="medium" />
          }
          label="Show only patients registered today"
        />
        <TextField
          sx={{ m: 1 }}
          variant="outlined"
          placeholder="Search…"
          value={searchText}
          onChange={(e) => requestSearch(e.target.value)}
        />
      </Box>
      {filteredRows.map((data) => (
        <PatientCard key={data.id} {...data} />
      ))}
    </>
  );
};

interface PatientListProp {
  loading: boolean;
  dataList: Prop[];
  searchText: string;
  setSearchString: (search: string) => void;
  rowCount: number;
  setPaginationModel: (pagination: any) => void;
  pagination: PaginationModel;
  totalPages:number
}

export const PatientCardListServer = ({
  dataList,
  loading,
  searchText,
  setSearchString,
  rowCount,
  setPaginationModel,
  pagination,
  totalPages
}: PatientListProp) => {
  

  const SkeletonLoader = () => (
    <Stack sx={{ m: "1ch" }} spacing={1}>
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
      <Skeleton variant="rounded" width={"100%"} height={200} />
    </Stack>
  );

  const handlePaginationClick = (page:number)=>{
    setPaginationModel((pagination:PaginationModel)=>{
      return {page:pagination.page+page, pageSize:pagination.pageSize }
    })
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", px: "1ch" }}>
        <TextField
          sx={{ m: 1 }}
          variant="outlined"
          placeholder="Search…"
          value={searchText}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </Box>
      {loading? <SkeletonLoader /> : dataList.length>0 ?dataList.map((data) => (
        <PatientCard key={data.id} {...data} />
      )): <Typography variant="body1">No patients on this list</Typography>}
      <Box>
        <Button disabled={pagination.page-1==0} onClick={()=>handlePaginationClick(-1)}>Previous</Button>
        <Button disabled={pagination.page+1>totalPages} onClick={()=>handlePaginationClick(1)}>Next</Button>
      </Box>
    </>
  );
};
