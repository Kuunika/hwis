"use client";
import { FormStepper } from "@/components/forms";
import { WelcomeMenu } from "@/components/welcome";
import { Box } from "@mui/material";

export default function Home() {
  return <FormStepper />;
  // return <FormFragment />;
  // return <TestForm onSubmit={(values: any) => console.log({ values })} />;
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
