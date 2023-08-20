import { Input } from '@mui/material';
import React,{useState} from 'react'
import { BaseTable } from 'shared-ui/src'

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

  const initialRows = [
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
      lastName: "Doe",
      age: 20,
      sex: "Female",
      triageCategory: "YELLOW",
      serviceArea: "LL",
      waitingTime: "10:15",
    },
    {
      id: 3,
      firstName: "John",
      lastName: "Doe",
      age: 20,
      sex: "Male",
      triageCategory: "GREEN",
      serviceArea: "KK",
      waitingTime: "5:00",
    },
  ];

  return (
      <BaseTable columns={columns} rows={initialRows} />
  );
}

export default TriageTable