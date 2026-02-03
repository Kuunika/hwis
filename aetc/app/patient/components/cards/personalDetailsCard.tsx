"use client";

import React, { MouseEvent, useState } from "react";
import { WrapperBox, MainTypography } from "@/components";
import { Paper } from "@mui/material";
import { getOnePatient } from "@/hooks/patientReg";
import { getActivePatientDetails, useNavigation, useParameters } from "@/hooks";
import { calculateAge, getHumanReadableShortDate } from "@/helpers/dateTime";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { PatientInfoPrintDialog } from "../dialogs";
import { confirmationDialog } from "@/helpers";
import { reOpenRecentClosedVisit } from "@/hooks/visit";
import { getRoles } from "@/helpers/localstorage";
import { roles } from "@/constants";

type PersonAttribute = {
  person_attribute_id?: number;
  value?: string | null;
};

export const PersonalDetailsCard = ({ sx }: { sx?: any }) => {
  const { params } = useParameters();
  const { navigateTo } = useNavigation();
  const { data: patient, isLoading } = getOnePatient(params.id as string);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [openPatientSummary, setOpenPatientSummary] = useState(false);

  const { hasActiveVisit, closedVisitId, openClosedVisit } =
    getActivePatientDetails();
  const { mutateAsync } = reOpenRecentClosedVisit(params.id as string);

  function getNationalIdIdentifiers(data: any) {
    const nationalIdObjects = (data || []).filter(
      (item: any) =>
        item?.identifier_type && item.identifier_type.name === "National id",
    );
    const values = nationalIdObjects.map((item: any) => item.identifier);
    return values[values.length - 1];
  }

  const handleCloseVisitMenu = () => {
    handleClose();
    confirmationDialog({
      title: "Visit reactivation",
      text: "Are you sure you want to reactive the most recent closed visit for this patient?",
      icon: "warning",
      confirmButtonText: "Yes",
      onConfirm: async () => {
        const response = await mutateAsync(closedVisitId as string);
        if (response) openClosedVisit();
      },
    });
  };

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }

  // ✅ Collect all contact values into ONE line
  const contactValues =
    (patient?.person?.person_attributes as PersonAttribute[] | undefined)
      ?.map((attr) => attr.value)
      .filter(
        (value): value is string =>
          typeof value === "string" && value.trim() !== "",
      ) ?? [];

  const contactText = contactValues.length ? contactValues.join(", ") : "-";

  return (
    <>
      <style>
        {`
          .initialsBox {
            min-width: 85px;
            height: 90px;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
          }
          .maleColor { background: #5983ba; }
          .femaleColor { background: #876d9b; }

          .vertical-dots {
            display: flex;
            flex-direction: column;
            align-items: end;
            gap: 3px;
          }
          .dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #333;
          }
        `}
      </style>

      <Paper sx={{ backgroundColor: "#fff", p: "1ch", ...sx }}>
        {/* Menu */}
        <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button size="small" onClick={handleClick}>
            <div className="vertical-dots">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              onClick={() => {
                handleClose();
                navigateTo(`/patient/${params.id}/view`);
              }}
            >
              Update demographics
            </MenuItem>

            {!hasActiveVisit &&
              getRoles().some((role) =>
                [roles.ADMIN, roles.CLINICIAN].includes(role),
              ) && (
                <MenuItem onClick={handleCloseVisitMenu}>
                  Reactivate Most Recent Visit
                </MenuItem>
              )}

            <MenuItem
              onClick={() => {
                handleClose();
                setOpenPatientSummary(true);
              }}
            >
              Print patient summary
            </MenuItem>
          </Menu>
        </div>

        {/* Header */}
        <WrapperBox sx={{ display: "flex", alignItems: "center" }}>
          <WrapperBox sx={{ mr: "1ch", mt: "2ch", ml: "1ch" }}>
            <div
              className={
                patient?.gender === "Male"
                  ? "initialsBox maleColor"
                  : "initialsBox femaleColor"
              }
            >
              <PersonIcon sx={{ fontSize: 90, color: "#fff" }} />
            </div>
          </WrapperBox>

          <MainTypography variant="h5" fontWeight={700}>
            {patient?.given_name} {patient?.family_name}
          </MainTypography>
        </WrapperBox>

        <br />

        {/* Details */}
        <div style={{ marginLeft: "1ch" }}>
          <LabelValue
            label="MRN:"
            value={getNationalIdIdentifiers(patient?.identifiers) ?? "-"}
          />
          <LabelValue label="Gender:" value={patient?.gender ?? "-"} />
          <LabelValue
            label="Age:"
            value={`${
              patient?.birthdate ? calculateAge(patient.birthdate) : "-"
            } yrs (${patient?.birthdate ? getHumanReadableShortDate(patient.birthdate) : "-"})`}
          />
          <LabelValue
            label="Address:"
            value={
              patient?.addresses?.length
                ? `${patient.addresses[0]?.address1 ?? ""}, ${
                    patient.addresses[0]?.address2 ?? ""
                  }, ${patient.addresses[0]?.city_village ?? ""}`
                : "-"
            }
          />

          {/* ✅ CONTACT – ONE LINE */}
          <LabelValue label="Contact:" value={contactText} />
        </div>
      </Paper>

      <PatientInfoPrintDialog
        open={openPatientSummary}
        onClose={() => setOpenPatientSummary(false)}
      />
    </>
  );
};

const LabelValue = ({ label, value }: { label: string; value: any }) => (
  <WrapperBox
    sx={{
      display: "flex",
      mb: "0.5ch",
      mt: "1ch",
      color: "#737373",
    }}
  >
    <div style={{ fontSize: "0.9rem", minWidth: "120px" }}>{label}</div>
    <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{value}</div>
  </WrapperBox>
);
