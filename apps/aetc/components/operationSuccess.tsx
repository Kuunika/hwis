import { Box, Typography } from "@mui/material";
import { FaCircleCheck } from "react-icons/fa6";
import { MainButton } from "@/components";

export function OperationSuccess({
  title,
  primaryActionText,
  secondaryActionText,
  onPrimaryAction,
  onSecondaryAction,
  printButton,
}: {
  title: string;
  primaryActionText: string;
  secondaryActionText: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  printButton?: any
}) {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
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
          {title}
        </Typography>
        <Box mt={"2ch"} sx={{ display: "flex" }}>
          <MainButton onClick={onPrimaryAction} title={primaryActionText} />
          <MainButton
            variant="secondary"
            sx={{ ml: "0.5ch" }}
            onClick={onSecondaryAction}
            title={secondaryActionText}
          />
          {printButton}
        </Box>
      </Box>
    </Box>
  );
}
