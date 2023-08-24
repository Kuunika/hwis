import React from "react";
import { Header, MainCard } from "shared-ui/src";
import { Avatar } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";

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
    <div style={{ display: "flex", alignItems: "center" }}>
      <Avatar style={{ width: "60px", height: "60px" }}>
        <PersonIcon />
      </Avatar>
      <div style={{ marginLeft: "10px" }}>
        <Header title={name} variant="h1" />
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {data.map((e, index) => {
            return <li key={index}>{e}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};
