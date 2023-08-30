"use client";
import React from "react";
import { Header } from "shared-ui/src";

export default function PreviousVisits({}: PreviousVisitsProps) {
  const visits = [
    "1st January 2023",
    "5th January 2023",
    "20th January 2023",
    "1st February 2023",
  ];

  return (
    <>
      <Header variant="h1" title="Previous Visits" />
      <ul style={{ listStyleType: "circle" }}>
        {visits.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
}
