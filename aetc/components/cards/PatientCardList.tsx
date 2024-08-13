'use client'
import { isToday } from "@/helpers/dateTime";
import { Box, FormControlLabel, Paper, Skeleton, Stack, Switch, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";



type Prop = {
  id: string
  visitNumber: string;
  firstName: string;
  lastName: string;
  arrivalTime: string;
  actor: any;
  actionName: string;
  waitingTime: any;
  aggregate: any;
  action: any;
  age?: any
  gender: string
  arrivalDateTime: string
}
export const PatientCard = ({ gender, visitNumber, firstName, lastName, actor, actionName, arrivalTime, waitingTime, aggregate, action, age }: Prop) => {
  return <Paper sx={{ display: "flex", p: "1ch", m: "1ch" }}>
    <Box sx={{ flex: "0.2" }}>
      <Typography variant="h6">Visit No</Typography>
      <Typography variant="h4">{visitNumber}</Typography>
    </Box>
    <Box sx={{ flex: "0.6" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}><Typography variant="h4">{`${firstName} ${lastName}`}</Typography><Typography variant="h4">({`${gender[0]}`})</Typography></Box>
      <Typography variant="h5">Age: {age}</Typography>
      <Typography variant="body2">
        Arrival Time: {arrivalTime} ~
        Waiting time: {waitingTime}~
        Aggregate: {aggregate}
      </Typography>
      <br />
      <Typography variant="body2">{`${actionName}`}</Typography>
      <Typography>{actor}</Typography>
    </Box>
    <Box sx={{ flex: "0.2" }}>
      {action}
    </Box>
  </Paper>
}


export const PatientCardList = ({ dataList, loading }: { loading: boolean, dataList: Prop[] }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredRows, setFilteredRows] = useState(dataList);
  const [showTodayOnly, setShowTodayOnly] = useState(false)

  useEffect(() => {
    setFilteredRows(dataList)
  }, [dataList])

  useEffect(() => {
    requestSearch('')
  }, [showTodayOnly])


  const requestSearch = (searchValue: any) => {
    setSearchText(searchValue);
    let filteredRows = dataList.filter((row: any) => {
      return Object.keys(row).some((field) =>
        row[field]?.toString()?.toLowerCase()?.includes(searchValue.toLowerCase())
      );
    });

    console.log({ filteredRows })

    if (showTodayOnly) {
      filteredRows = filteredRows.filter(row => isToday(row?.arrivalDateTime))
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
    return <Typography variant="body1">No patients on this list</Typography>
  }

  const handleSwitchChange = (value: any) => {
    setShowTodayOnly(value.target.checked)
  }

  return <>
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
    {filteredRows.map(data => <PatientCard key={data.id} {...data} />)}
  </>
}