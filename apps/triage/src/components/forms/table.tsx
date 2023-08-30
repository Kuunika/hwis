import { TextField } from '@mui/material';
import React,{useState} from 'react'
import { BaseTable, TextInputField } from 'shared-ui/src'

const TriageTable = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    { field: "age", headerName: "Age", width: 200 },
    { field: "sex", headerName: "Sex", width: 200 },
    { field: "triageCategory", headerName: "Traige Category", width: 200 },
    { field: "serviceArea", headerName: "Servise Area", width: 200 },
    { field: "waitingTime", headerName: "Waiting Time", width: 200 },
  ];

  const rows = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      age: 20,
      sex: "Male",
      triageCategory: "RED",
      serviceArea: "KU",
      waitingTime: "0:45",
    },
    {
      id: 2,
      firstName: "Mary",
      lastName: "Smith",
      age: 20,
      sex: "Female",
      triageCategory: "YELLOW",
      serviceArea: "LL",
      waitingTime: "10:15",
    },
    {
      id: 3, 
      firstName: "John",
      lastName: "Ryan",
      age: 20,
      sex: "Male",
      triageCategory: "GREEN",
      serviceArea: "KK",
      waitingTime: "5:00",
    },
  ];

    const [searchQuery, setSearchQuery] = useState("");
    const filteredRows = rows.filter((row) => {
    const values = Object.values(row).join(" ").toLowerCase();
    return values.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <h1>Patients Awaiting Assessment</h1>
      <TextField
        label="Search Patient"
        value={searchQuery}
        onChange={(event: any) => setSearchQuery(event.target.value)}
        variant="outlined"
        style={{ marginBottom: "16px", width: "300px" }}
      />
      <BaseTable columns={columns} rows={filteredRows} />
    </>
  );
}

export default TriageTable