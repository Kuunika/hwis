import React from "react";
import { MainCard, Header, MainList } from "shared-ui/src";
import { Avatar, Box } from "@mui/material";


interface PatientDetailsProps {
  name: string;
}

const data = [
  {id: 1, label: "Gender: Male"},
  {id: 2, label: "Date of Birth: 08 June, 1996"},
  {id: 3, label: "Allergies: abc, abc, abc and abc"},
];

export const PatientDetails: React.FC<PatientDetailsProps> = ({ name }) => {
  return (
    <MainCard elevation={1} sx={{ marginBottom: 2 }}>
       <Box
      sx={{
        display: "flex",
        alignItems: "column",
        padding: 2
      }}
    >
      <Avatar sx={{ width: "80px", height: "80px" }} alt="Person" src="" />
      <Box sx={{ display: "flex", flexDirection: "column", marginLeft: 5 }}>
        <Header title={name} variant="h2" />
        <MainList listItems={data}/>
      </Box>
    </Box>
  </MainCard>
   
  );
};
