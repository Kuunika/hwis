"use client";

import { useState } from "react";
import { ExistingRegistration } from "@/components/registration";
import { PatientSearchForm } from "@/components/forms";
import { Typography } from "@mui/material";

export default function Page() {
  const [search, setSearch] = useState("");

  return (
    <>
      {!Boolean(search) ? (
        <>
          <Typography variant="h3" align="center">
            Search Patient
          </Typography>
          <PatientSearchForm onSubmit={(value) => setSearch(value.search)} />
        </>
      ) : (
        <ExistingRegistration title="Existing Patient without ID" />
      )}
    </>
  );
}
