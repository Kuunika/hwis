"use client";
import { Box, Typography } from "@mui/material";
import { FaCircleCheck } from "react-icons/fa6";
import { MainButton } from "shared-ui/src";

export default function Page() {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
    >
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography variant="h1" color={"green"}>
          <FaCircleCheck />
        </Typography>
        <Typography variant="h5" fontWeight={"500"}>
          Registration Complete
        </Typography>
        <Box mt={"2ch"}>
          <MainButton onClick={() => {}} title="Register More Patients" />
          <MainButton
            variant="secondary"
            sx={{ ml: "0.5ch" }}
            onClick={() => {}}
            title="Go To Triage"
          />
        </Box>
      </Box>
    </Box>
  );
}
