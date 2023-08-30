import React from "react";
import { Header, defaultTheme } from "shared-ui/src";
import { Avatar, Box } from "@mui/material";

interface PatientDetailsProps {
  name: string;
}

const data = [
  "Gender: Male",
  "Date of Birth: 08 June, 1996",
  "Allergies: abc, abc, abc and abc",
];
export const PatientDetails: React.FC<PatientDetailsProps> = ({ name }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "column",
      }}
    >
      <Avatar sx={{ width: "80px", height: "80px" }} alt="Person" src="" />
      <Box sx={{ display: "flex", flexDirection: "column", marginLeft: 5 }}>
        <Header title={name} variant="h1" />
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {data.map((e, index) => {
            return <li key={index}>{e}</li>;
          })}
        </ul>
      </Box>
    </Box>
  );
};
