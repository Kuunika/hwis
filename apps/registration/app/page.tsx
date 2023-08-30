"use client";
import { WelcomeMenu } from "@/components/welcome";
import { Box } from "@mui/material";

export default function Home() {
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
