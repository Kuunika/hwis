"use client";
import React from "react";
import { Header, MainCard, MainList } from "shared-ui/src";

export default function PreviousVisits({}: PreviousVisitsProps) {

  const visits = [
    {id:"1",label:"1st January 2023"},
    {id:"2",label:"5th January 2023"},
    {id:"3",label:"20th January 2023"},

  ];

  const handleClick = (id:number)=>{
    console.log({id})
  }

  return (
    <MainCard elevation={1} sx={{ marginBottom: 2, padding: 2}}>
    <Header variant="h2" title="Previous Visits"/>
      <MainList onClick={handleClick} listItems={visits} sx={{"&:hover": { fontWeight: "600" }, my: "1ch"}} />
    </MainCard>
   
  );
}
