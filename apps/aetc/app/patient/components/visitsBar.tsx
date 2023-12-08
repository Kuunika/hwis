import {
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
} from "shared-ui/src";
import { Button, SxProps } from "@mui/material";
import { FaRegCalendarPlus } from "react-icons/fa";
import { useNavigation } from "@/hooks";

export const VisitsBar = () => {
  const { navigateTo } = useNavigation();
  return (
    <WrapperBox
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        px: "2ch",
        py: "2ch",
        borderWidth: "1px",
        borderBottomStyle: "solid",
        borderColor: "#E6E6E6",
        mb: "5ch",
      }}
    >
      <Button variant="outlined" size="small" endIcon={<FaRegCalendarPlus />}>
        Add Today
      </Button>
      <Button
        onClick={() => navigateTo("/triage/12/history")}
        sx={{ ml: "1ch" }}
        variant="contained"
        size="small"
      >
        Triage
      </Button>
    </WrapperBox>
  );
};

const Pill = ({
  visitDate,
  visitId,
}: {
  visitDate: string;
  visitId: string;
}) => {
  return (
    <WrapperBox sx={{ cursor: "pointer", mx: "2ch" }}>
      <MainTypography fontWeight={"700"}>{visitDate}</MainTypography>
    </WrapperBox>
  );
};
