"use client";
import { calculateAge } from "@/helpers/dateTime";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";

import { MainPaper, MainTypography, WrapperBox } from "@/components";

export const PatientInfoTab = () => {
  const { params } = useParameters()
  const { data: patient, isLoading } = getOnePatient(params?.id as string)
  return (
    <MainPaper
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        padding: { lg: "24px 108px", xs: "24px 20px" },// padding: 24px, 108px, 24px, 108px
        backgroundColor: "#fff",
        borderBottom: "1px solid #B3B3B3",
        boxShadow: "0px 8px 24px 0px #084A231A",
      }}
    >
      <LabelValue label="Full name" value={`${patient?.given_name} ${patient?.family_name}`} />
      <LabelValue label="ID" value="123J-01923-NOJSX" />
      <LabelValue label="Age" value={`${calculateAge(patient?.birthdate)}yr (${patient?.birthdate})`} />
      <LabelValue label="Category" value="Referral" />
      <LabelValue label="Gender" value={patient ? patient?.gender : ""} />
    </MainPaper>
  );
};

const LabelValue = ({ label, value, sx }: { label: string; value: string, sx?: any }) => {
  return (
    <WrapperBox sx={{ display: "flex", alignItems: "center", ...sx }}>
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
