import {
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
} from "shared-ui/src";
import { Button, SxProps } from "@mui/material";
import {
  FaRegCalendarPlus,
  FaChevronLeft,
  FaChevronRight,
  FaCircle,
} from "react-icons/fa";
import { useNavigation, useParameters } from "@/hooks";
import { VisitDates } from "./visitDates";
import { getPatientsEncounters } from "@/hooks/encounter";

export const VisitsBar = () => {
  const { navigateTo } = useNavigation();
  const { params } = useParameters();

  const { data, isLoading } = getPatientsEncounters(params?.id as string);


  const uniqueArray: any = {};
  data?.forEach(item => {
    uniqueArray[item.visit_id] = false
  });


  return (
    <WrapperBox
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        px: "2ch",
        py: "1ch",
        // borderWidth: "1px",
        // borderBottomStyle: "solid",
        // borderColor: "#E6E6E6",
      }}
    >
      <VisitDates visits={Object.keys(uniqueArray)} />
      <WrapperBox sx={{ display: "flex", alignItems: "center", mx: "1ch" }}>
        <MainTypography sx={{ cursor: "pointer" }}>
          <FaChevronLeft />
        </MainTypography>
        <MainTypography sx={{ fontSize: "10px", mx: "1ch" }}>
          <FaCircle />
        </MainTypography>
        <MainTypography sx={{ cursor: "pointer" }}>
          <FaChevronRight />
        </MainTypography>
      </WrapperBox>
      <MainButton
        onClick={() => navigateTo(`/triage/${params?.id}/history`)}
        sx={{ ml: "1ch" }}
        variant="secondary"
        title={"Triage"}
      // size="small"
      />

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
