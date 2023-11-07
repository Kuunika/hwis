"use client";
import { Box, Typography } from "@mui/material";
import { FaCircleCheck } from "react-icons/fa6";
import { MainButton } from "shared-ui/src";

type Prop = {
  message: string;
  previousActionMessage: string;
  onPreviousClick: () => void;
  nextActionMessage: string;
  onNextClick: () => void;
};

export const ActionComplete = ({
  message,
  previousActionMessage,
  onPreviousClick,
  nextActionMessage,
  onNextClick,
}: Prop) => {
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
          {message}
        </Typography>
        <Box mt={"2ch"}>
          <MainButton onClick={onPreviousClick} title={previousActionMessage} />
          <MainButton
            variant="secondary"
            sx={{ ml: "0.5ch" }}
            onClick={onNextClick}
            title={nextActionMessage}
          />
        </Box>
      </Box>
    </Box>
  );
};
