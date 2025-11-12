"use client";

import { calculateAge } from "@/helpers/dateTime";
import { getActivePatientDetails, useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getObservationValue } from "@/helpers/emr";
import { concepts, encounters } from "@/constants";
import { Paper, Typography, Box } from "@mui/material";

// Helper to get National ID
function getNationalIdIdentifiers(data: any) {
  if (!data) return "";
  const nationalIdObjects = data.filter(
    (item: any) =>
      item.identifier_type && item.identifier_type.name === "National id"
  );
  const nationalIdValues = nationalIdObjects.map(
    (item: any) => item.identifier
  );
  return nationalIdValues[nationalIdValues.length - 1] || "";
}

export const PatientInfoTab = () => {
  const { params } = useParameters();
  const { patient, activeVisitId } = getActivePatientDetails();
  const { data } = getPatientsEncounters(
    params?.id as string,
    `encounter_type=${encounters.REFERRAL}&visit_id=${activeVisitId}`
  );

  const referredFrom =
    data && data.length > 0
      ? getObservationValue(data[0].obs, concepts.REFERRED_FROM)
      : undefined;
  const diagnosis =
    data && data.length > 0
      ? getObservationValue(data[0].obs, concepts.DIAGNOSIS)
      : undefined;
  const other =
    data && data.length > 0
      ? getObservationValue(data[0].obs, concepts.OTHER)
      : undefined;

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        overflowX: "auto",
        gap: { xs: 2, md: 4 },
        padding: { lg: "20px 60px", xs: "16px 12px" },
        backgroundColor: "#fff",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#d1d5db",
          borderRadius: "4px",
        },
        "@media print": {
          display: "flex !important",
          flexDirection: "row !important",
          flexWrap: "nowrap !important",
          justifyContent: "flex-start !important",
          alignItems: "center !important",
          gap: "12px !important",
          padding: "8px !important",
          overflow: "visible !important", // remove scroll
          width: "100% !important",
          boxShadow: "none !important",
          border: "none !important",
        },
      }}
    >
      <LabelValue
        label="MRN"
        value={getNationalIdIdentifiers(patient?.identifiers)}
      />
      <LabelValue
        label="Full Name"
        value={`${patient?.given_name || ""} ${patient?.family_name || ""}`}
      />
      <LabelValue label="Gender" value={patient?.gender || ""} />
      <LabelValue
        label="Age"
        value={
          patient?.birthdate
            ? `${calculateAge(patient?.birthdate)}yr (${patient?.birthdate})`
            : "-"
        }
      />
      <LabelValue
        label="Category"
        value={`Referral | ${referredFrom || "Unknown"} | ${diagnosis || other}`}
        wide
      />
    </Paper>
  );
};

const LabelValue = ({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // stacked on screen
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        flexShrink: 0,
        textAlign: "center",
        "@media print": {
          flexDirection: "row !important", // inline label-value
          alignItems: "baseline !important",
          justifyContent: "flex-start !important",
          textAlign: "left !important",
          gap: "4px !important",
          minWidth: "auto !important",
          maxWidth: "none !important",
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: { xs: "12px", md: "13px" },
          fontWeight: 500,
          color: "#6B7280",
          whiteSpace: "nowrap",
          mr: { print: 1 },
        }}
      >
        {label}:
      </Typography>

      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: { xs: "14px", md: "16px" },
          fontWeight: 600,
          color: "#111827",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          maxWidth: "100%",
          "@media print": {
            maxWidth: "none !important",
            overflow: "visible !important",
          },
        }}
        title={value}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
};
