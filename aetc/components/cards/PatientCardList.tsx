import { Box, Paper, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";



type Prop = {
    id:string
    visitNumber: string;
    firstName: string;
    lastName:string;
    arrivalTime: string;
    actor:any;
    actionName:string;
    waitingTime:any;
    aggregate:any;
    action:any
}
export const PatientCard = ({visitNumber, firstName, lastName,actor, actionName, arrivalTime, waitingTime, aggregate, action}:Prop) => {
    return <Paper sx={{ display: "flex", p: "1ch", m: "1ch" }}>
        <Box sx={{ flex: "0.1" }}>
            <Typography variant="h6">Visit No</Typography>
            <Typography variant="h4">{visitNumber}</Typography>
        </Box>
        <Box sx={{ flex: "0.7" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}><Typography variant="h3">{`${firstName} ${lastName}`}</Typography><Typography variant="h3">(M)</Typography></Box>
            <Typography variant="h5">Age: 20yrs</Typography>
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


export const PatientCardList = ({dataList}:{dataList:Prop[]})=>{
    const [searchText, setSearchText] = useState('');
    const [filteredRows, setFilteredRows] =useState(dataList);

    useEffect(()=>{
        setFilteredRows(dataList)
      },[dataList])

      const requestSearch = (searchValue:any) => {
        setSearchText(searchValue);
        const filteredRows = dataList.filter((row:any) => {
          return Object.keys(row).some((field) =>
            row[field]?.toString()?.toLowerCase()?.includes(searchValue.toLowerCase())
          );
        });
        setFilteredRows(filteredRows);
      };
    

    return <>
       <TextField
        sx={{m:1}}
          variant="outlined"
          placeholder="Search…"
          value={searchText}
          onChange={(e) => requestSearch(e.target.value)}
        />
    {filteredRows.map(data=> <PatientCard key={data.id} {...data} />)}
    </>
}