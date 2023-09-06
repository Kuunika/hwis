"use client";
import { WelcomeMenu } from "@/components/welcome";
import { Box } from "@mui/material";

import yupSchema, { TestForm } from "@/components/forms/test";

export default function Home() {
  return <TestForm onSubmit={(values: any) => console.log({ values })} />;
  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <WelcomeMenu />
      </Box>
    </>
  );
}
