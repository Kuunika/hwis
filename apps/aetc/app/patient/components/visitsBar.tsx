import { MainPaper, MainTypography, WrapperBox } from "shared-ui/src";

export const VisitsBar = () => {
  const visits = [
    { visitDate: "4th July, 2023", visitId: "1" },
    { visitDate: "5th July, 2023", visitId: "2" },
    { visitDate: "6th July, 2023", visitId: "3" },
    { visitDate: "7th July, 2023", visitId: "4" },
    { visitDate: "8th July, 2023", visitId: "5" },
    { visitDate: "9th July, 2023", visitId: "6" },
    { visitDate: "9th July, 2023", visitId: "7" },
    { visitDate: "9th July, 2023", visitId: "8" },
    { visitDate: "9th July, 2023", visitId: "9" },
    { visitDate: "9th July, 2023", visitId: "10" },
    { visitDate: "9th July, 2023", visitId: "11" },
    { visitDate: "9th July, 2023", visitId: "11" },
    { visitDate: "9th July, 2023", visitId: "11" },
    { visitDate: "9th July, 2023", visitId: "11" },
    { visitDate: "9th July, 2023", visitId: "11" },
    { visitDate: "9th July, 2023", visitId: "11" },
    { visitDate: "9th July, 2023", visitId: "11" },
    { visitDate: "9th July, 2023", visitId: "11" },
    { visitDate: "9th July, 2023", visitId: "11" },
  ];
  return (
    <MainPaper elevation={1} sx={{ width: "100%", px: "2ch" }}>
      <WrapperBox
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          py: "2ch",
          width: "100%",
          overflowX: "scroll",
          overflowY: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {visits.map((visit) => (
          <Pill {...visit} />
        ))}
      </WrapperBox>
    </MainPaper>
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
