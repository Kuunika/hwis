import { MainTypography, WrapperBox } from "@/components";
import { Panel } from ".";
import { FaExpandAlt, FaRegChartBar } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import { useState, useEffect } from "react";

export const ClinicalNotes = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }
  const clinicalNotes = [
    "The patient presents today with concerns related to diabetes The patient presents today with concerns related to diabetes",
    "The patient appears well-nourished and in no acute distress The patient presents today with concerns related to diabetes",
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
        <MainTypography color={"#636363"}></MainTypography>
        <FaRegChartBar />
      </WrapperBox>
      <MainTypography color={"#636363"}>Notes</MainTypography>
      <WrapperBox sx={{ mt: "1ch", overflow: "scroll", maxHeight: "10ch" }}>
        <WrapperBox ml={"2ch"}>
          {clinicalNotes.map((notes) => (
            <WrapperBox
              key={notes}
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <WrapperBox
                sx={{
                  backgroundColor: "black",
                  borderRadius: "4px",
                  height: "8px",
                  width: "8px",
                  mr: "1ch",
                  mt: "5px",
                }}
              ></WrapperBox>
              <MainTypography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "21px",
                  letterSpacing: "0em",
                  textAlign: "left",
                }}
                width={"80%"}
                variant="body1"
              >
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
