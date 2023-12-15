import { MainTypography, WrapperBox } from "shared-ui/src";
import { Panel } from ".";
import { FaExpandAlt, FaRegChartBar } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";

export const ClinicalNotes = () => {
  const clinicalNotes = [
    "The patient presents today with concerns related to diabetes management and seeks guidance on optimizing their health",
    "The patient appears well-nourished and in no acute distress",
    "The patient appears well-nourished and in no acute distress",
  ];

  const expandIcon = (
    <WrapperBox
      sx={{
        padding: "0.5ch",
        ml: "5px",
        backgroundColor: "#DDEEDD",
        borderRadius: "0.5ch",
        color: (theme) => theme.palette.primary.main,
      }}
    >
      <FaExpandAlt />
    </WrapperBox>
  );
  return (
    <Panel title="Clinical Notes" icon={expandIcon}>
      <br />
      <WrapperBox display={"flex"} justifyContent={"space-between"}>
        <MainTypography color={"#636363"}>Vitals</MainTypography>
        <FaRegChartBar />
      </WrapperBox>
      <WrapperBox display={"flex"} justifyContent={"space-between"}>
        <VitalsPill
          textColor="#016302"
          backgroundColor="#DDEEDD"
          iconBackgroundColor="#BBDDBC"
          text="25.6 obese"
        />
        <VitalsPill
          textColor="#00190E"
          backgroundColor="#E6E6E6"
          iconBackgroundColor="#B3B3B3"
          text="110/70"
        />
      </WrapperBox>
      <WrapperBox sx={{ mt: "1ch", overflow: "scroll", maxHeight: "15ch" }}>
        <MainTypography color={"#636363"}>Notes</MainTypography>
        <WrapperBox pl={"1ch"}>
          {clinicalNotes.map((notes) => (
            <WrapperBox key={notes} display={"flex"} alignItems={"flex-start"}>
              {/* <WrapperBox
                sx={{
                  backgroundColor: "black",
                  borderRadius: "3px",
                  height: "6px",
                  width: "6px",
                }}
              ></WrapperBox> */}
              <MainTypography my={"0.5ch"} variant="subtitle1">
                {notes}
              </MainTypography>
            </WrapperBox>
          ))}
        </WrapperBox>
      </WrapperBox>
    </Panel>
  );
};

const VitalsPill = ({
  textColor,
  backgroundColor,
  iconBackgroundColor,
  text,
}: {
  textColor: string;
  backgroundColor: string;
  iconBackgroundColor: string;
  text: string;
}) => {
  return (
    <WrapperBox
      display={"flex"}
      alignItems={"center"}
      sx={{
        backgroundColor,
        px: "2ch",
        py: "1ch",
        width: "49%",
        borderRadius: "1ch",
        color: textColor,
      }}
    >
      <WrapperBox
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: iconBackgroundColor,
          p: "0.7ch",
          borderRadius: "0.7ch",
        }}
      >
        <FaRegSquare />
      </WrapperBox>
      <WrapperBox
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MainTypography>{text}</MainTypography>
      </WrapperBox>
    </WrapperBox>
  );
};
