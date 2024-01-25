"use client";
import { MainPaper, MainTypography, WrapperBox } from "shared-ui/src";

export const PatientInfoTab = () => {
  return (
    <MainPaper
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        padding: "24px 108px", // padding: 24px, 108px, 24px, 108px
        backgroundColor: "#fff",
        borderBottom: "1px solid #B3B3B3",
        boxShadow: "0px 8px 24px 0px #084A231A",
      }}
    >
      <LabelValue label="Full name" value="John Doe" />
      <LabelValue label="ID" value="123J-01923-NOJSX" />
      <LabelValue label="Age" value="21yr (08 June 1996)" />
      <LabelValue label="Category" value="Referral" />
      <LabelValue label="Gender" value="Male" />
    </MainPaper>
  );
};

const LabelValue = ({ label, value }: { label: string; value: string }) => {
  return (
    <WrapperBox sx={{ display: "flex", alignItems: "center" }}>
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "21px",
          letterSpacing: "0em",
          textAlign: "left",
          color: "#00190E",
        }}
      >
        {label}:
      </MainTypography>
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "17px",
          letterSpacing: "0em",
          textAlign: "left",
          color: "#00190E",
          ml: "5px",
        }}
      >
        {value}
      </MainTypography>
    </WrapperBox>
  );
};
