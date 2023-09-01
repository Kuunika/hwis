"use client";
import { useState } from "react";

// import { QrReader } from "react-qr-reader";
import { Typography, Box } from "@mui/material";
import { PrescreeningForm } from "@/components/forms";
import { MainCard } from "shared-ui/src";

export default function Page() {
  const [data, setData] = useState("day");

  const handleScan = (result: any, error: any) => {
    setData(result);
  };

  return (
    <MainCard elevation={1} sx={{ width: "50%" }}>
      <Typography width={"100%"} align="center" variant="h3">
        Prescreening
      </Typography>
      {!Boolean(data) ? (
        <>
          {/* <QrReader onResult={handleScan} constraints={{ width: 1 }} /> */}
        </>
      ) : (
        <PrescreeningForm onSubmit={() => {}} />
      )}
    </MainCard>
  );
}
