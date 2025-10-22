"use client";

import { calculateAge } from "@/helpers/dateTime";
import { useParameters } from "@/hooks";
import { getOnePatient } from "@/hooks/patientReg";

import { MainPaper, MainTypography, WrapperBox } from "@/components";


  function getNationalIdIdentifiers(data: any) {
    // Filter the data to only include objects where identifier_type.name is "National id"
    const nationalIdObjects = data.filter(
      (item: any) =>
        item.identifier_type && item.identifier_type.name === "National id"
    );

    // Extract just the identifier values from the filtered objects
    const nationalIdValues = nationalIdObjects.map(
      (item: any) => item.identifier
    );

    return nationalIdValues[nationalIdValues.length - 1];
  }

export const PatientInfoTab = () => {
  const { params } = useParameters();
  const { data: patient, isLoading } = getOnePatient(params?.id as string);

  return (
    <MainPaper
      sx={{
        display: "flex",
        flexWrap: "wrap", // Ensure items wrap on smaller screens
        justifyContent: { xs: "center", md: "space-evenly" },
        gap: "16px", // Add spacing between items
        padding: { lg: "24px 108px", xs: "24px 20px" },
        backgroundColor: "#fff",
        borderBottom: "1px solid #B3B3B3",
        boxShadow: "0px 8px 24px 0px #084A231A",
        borderRadius: "8px",
      }}
    >
      <LabelValue
        label="Full Name"
        value={`${patient?.given_name} ${patient?.family_name}`}
      />
      <LabelValue
        label="MRN"
        value={getNationalIdIdentifiers(patient?.identifiers)}
      />
      <LabelValue
        label="Age"
        value={`${calculateAge(patient?.birthdate)}yr (${patient?.birthdate})`}
      />
      <LabelValue label="Category" value="Referral" />
      <LabelValue label="Gender" value={patient ? patient?.gender : ""} />
    </MainPaper>
  );
};

const LabelValue = ({
  label,
  value,
  sx,
}: {
  label: string;
  value: string;
  sx?: any;
}) => {
  return (
    <WrapperBox
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "4px",
        ...sx,
      }}
    >
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: { xs: "12px", md: "14px" },
          fontWeight: 400,
          lineHeight: "21px",
          letterSpacing: "0em",
          textAlign: "left",
          color: "#6B7280",
        }}
      >
        {label}:
      </MainTypography>
      <MainTypography
        sx={{
          fontFamily: "Inter",
          fontSize: { xs: "14px", md: "16px" },
          fontWeight: 500,
          lineHeight: "20px",
          letterSpacing: "0em",
          textAlign: "left",
          color: "#111827",
        }}
      >
        {value}
      </MainTypography>
    </WrapperBox>
  );
};
