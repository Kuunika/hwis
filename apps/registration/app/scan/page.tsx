"use client";
import { useState } from "react";
import { ExistingRegistration } from "@/components/registration";
// import { QrReader } from "react-qr-reader";
import { Typography, Box } from "@mui/material";

export default function Page() {
  const [data, setData] = useState("");

  const handleScan = (result: any, error: any) => {
    setData(result);
  };

  return (
    <>
      {!Boolean(data) ? (
        <>
          <Typography width={"100%"} align="center" variant="h3">
            Scan ID
          </Typography>
          {/* <QrReader onResult={handleScan} constraints={{ width: 1 }} /> */}
        </>
      ) : (
        <ExistingRegistration title="Existing Patient with ID" />
      )}
    </>
  );
}
