"use client";
import {
  GenericDialog,
  MainButton,
  MainPaper,
  MainTypography,
  WrapperBox,
} from "@/components";
import {
  Chip,
  FormControl,
  InputLabel,
  Paper,
  Select,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";
import { getOnePatient } from "@/hooks/patientReg";
import { getActivePatientDetails, useNavigation, useParameters } from "@/hooks";
import {
  calculateAge,
  getHumanReadableDate,
  getHumanReadableShortDate,
} from "@/helpers/dateTime";
import { ProfilePanelSkeletonLoader } from "@/components/loadingSkeletons";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, MouseEvent } from "react";
import { PatientInfoPrintDialog } from "../dialogs";
import { notify } from "@/helpers";
import { reOpenRecentClosedVisit } from "@/hooks/visit";
import { getRoles } from "@/helpers/localstorage";
import { roles } from "@/constants";
import {
  getAetcVisitListPatient,
  moveAetcVisitListPatient,
} from "@/services/aetcVisitList";
import { AetcVisitListRecord } from "@/interfaces";

export const PersonalDetailsCard = ({ sx }: { sx?: any }) => {
  const { params } = useParameters();
  const { navigateTo } = useNavigation();
  const { data: patient, isLoading } = getOnePatient(params.id as string);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [openPatientSummary, setOpenPatientSummary] = useState(false);
  const [reactivationDialogOpen, setReactivationDialogOpen] = useState(false);
  const [stageOptions, setStageOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [selectedStage, setSelectedStage] = useState("");
  const [reactivationLoading, setReactivationLoading] = useState(false);
  const [aetcCategory, setAetcCategory] = useState("");
  const { hasActiveVisit, closedVisitId } =
    getActivePatientDetails();
  const { mutateAsync } = reOpenRecentClosedVisit(params.id as string);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeReactivationDialog = (force = false) => {
    if (reactivationLoading && !force) return;

    setReactivationDialogOpen(false);
    setStageOptions([]);
    setSelectedStage("");
    setAetcCategory("");
  };

  const formatStageLabel = (stage: string) =>
    stage
      .split(/[_-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const parseRecentStages = (record: AetcVisitListRecord) => {
    let orderedStages =
      record.history
        ?.split(",")
        .map((entry) => entry.trim())
        .filter(Boolean) || [];

    if (!orderedStages.length && record.history?.includes("->")) {
      const legacyStages: string[] = [];

      record.history
        .split("\n")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .forEach((entry) => {
          const match = entry.match(/:\s*(.*?)\s*->\s*(.*?)\s*$/);
          if (!match) return;

          const [, fromCategory, toCategory] = match;
          if (!legacyStages.length) legacyStages.push(fromCategory);
          legacyStages.push(toCategory);
        });

      orderedStages = legacyStages;
    }

    if (
      record.category &&
      orderedStages[orderedStages.length - 1] !== record.category
    ) {
      orderedStages.push(record.category);
    }

    if (!orderedStages.length && record.category) {
      orderedStages.push(record.category);
    }

    const recentUniqueStages: string[] = [];
    for (let index = orderedStages.length - 1; index >= 0; index -= 1) {
      const stage = orderedStages[index];
      if (!stage || recentUniqueStages.includes(stage)) continue;

      recentUniqueStages.push(stage);
      if (recentUniqueStages.length === 3) break;
    }

    return recentUniqueStages;
  };

  function getNationalIdIdentifiers(data: any) {
    // Filter the data to only include objects where identifier_type.name is "National id"
    const nationalIdObjects = data.filter(
      (item: any) =>
        item.identifier_type && item.identifier_type.name === "National id",
    );

    // Extract just the identifier values from the filtered objects
    const nationalIdValues = nationalIdObjects.map(
      (item: any) => item.identifier,
    );

    return nationalIdValues[nationalIdValues.length - 1];
  }

  if (isLoading) {
    return <ProfilePanelSkeletonLoader />;
  }

  const handleCloseVisitMenu = () => {
    handleClose();
    void (async () => {
      if (!closedVisitId) {
        notify("error", "No recently closed visit was found for this patient.");
        return;
      }

      try {
        const { data: aetcVisitList } = await getAetcVisitListPatient(
          params.id as string,
          true,
        );
        const recentStages = parseRecentStages(aetcVisitList);

        if (!recentStages.length) {
          notify("error", "No previous stage history was found for this patient.");
          return;
        }

        setStageOptions(
          recentStages.map((stage) => ({
            value: stage,
            label: formatStageLabel(stage),
          })),
        );
        setSelectedStage(recentStages[0]);
        setAetcCategory(aetcVisitList.category);
        setReactivationDialogOpen(true);
      } catch (error) {
        notify("error", "Failed to reactivate the visit.");
      }
    })();
  };

  const handleStageChange = (event: SelectChangeEvent<string>) => {
    setSelectedStage(event.target.value);
  };

  const handleReactivateVisit = async () => {
    if (!selectedStage || !closedVisitId) {
      notify("error", "Select a stage to continue.");
      return;
    }

    try {
      setReactivationLoading(true);
      const response = await mutateAsync(closedVisitId as string);

      if (!response) {
        notify("error", "Visit reactivation failed.");
        return;
      }

      await moveAetcVisitListPatient(params.id as string, {
        category: selectedStage,
        from_category: aetcCategory,
      });

      closeReactivationDialog(true);
      notify(
        "success",
        `Visit reactivated and patient moved to ${formatStageLabel(selectedStage)}.`,
      );
    } catch (error) {
      notify("error", "Failed to reactivate the visit.");
    } finally {
      setReactivationLoading(false);
    }
  };

  // =========================
  // ✅ CONTACT (ONE LINE)
  // =========================
  const contactValues =
    patient?.person?.person_attributes
      ?.map((a: any) => a?.value)
      ?.filter((v: any) => typeof v === "string" && v.trim() !== "") || [];

  const contactText = contactValues.length ? contactValues.join(", ") : "-";

  return (
    <>
      <style>
        {`
          .first_letter {
              background-color: #e6e6e6;
              padding: 20px;
              margin-right: 20px;
              font-size: 24px;
              border-radius: 4px;
              color: #636363 !important;
          }
          .p_name_image {
              font-size: 24px;
              color: #00190e;
              display: flex;
              font-weight: 700;
              overflow: hidden;
          }
          .p_name {
              max-width: 210px;
              margin-left: 20px;
              height: 25px;
          }
          .p_dash_header {
              display: flex;
              justify-content: space-between;
              padding: 20px;
              border-bottom: solid #cccccc 1px;
          }
          .p_title {
              font-weight: 700;
              font-size: 24px;
              color: #00190e;
          }
              .initialsBox {
              min-width: 85px;
              height: 90px;
              left: 31px;
              top: 122px;
              align-items: center;
              border-radius: 10px;
              align-items: center;
              display: flex;
              justify-content: center;
              margin-top: 10px;
          }
          .maleColor {
              background: #5983ba;
          }
          .femaleColor {
              background: #876d9b;
          }
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
      <Paper
        style={{
          backgroundColor: "#ffffff", // Light grey background for placeholders
          padding: "1ch",
        }}
      >
        <GenericDialog
          open={reactivationDialogOpen}
          onClose={closeReactivationDialog}
          title="Reactivate Visit"
          maxWidth="sm"
        >
          <WrapperBox sx={{ pt: 1, pb: 1 }}>
            <WrapperBox
              sx={{
                border: "1px solid #DCE8DD",
                backgroundColor: "#F7FBF7",
                borderRadius: "8px",
                p: 2,
                mb: 3,
              }}
            >
              <MainTypography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#163020",
                  mb: 0.5,
                }}
              >
                Return patient to workflow
              </MainTypography>
              <MainTypography sx={{ fontSize: "14px", color: "#4B6351" }}>
                Select the stage where this patient should continue. The most recent
                stage is selected by default.
              </MainTypography>
            </WrapperBox>

            <FormControl fullWidth size="small">
              <InputLabel id="reactivate-visit-stage-label">
                Stage
              </InputLabel>
              <Select
                labelId="reactivate-visit-stage-label"
                id="reactivate-visit-stage"
                value={selectedStage}
                label="Stage"
                onChange={handleStageChange}
              >
                {stageOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <WrapperBox
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 3,
              }}
            >
              <MainButton
                title="Cancel"
                variant="secondary"
                onClick={closeReactivationDialog}
                disabled={reactivationLoading}
              />
              <MainButton
                title={reactivationLoading ? "Reactivating..." : "Reactivate Visit"}
                onClick={handleReactivateVisit}
                disabled={reactivationLoading || !selectedStage}
              />
            </WrapperBox>
          </WrapperBox>
        </GenericDialog>

        <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            size="small"
            style={{ minWidth: "30px" }}
          >
            <div className="vertical-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </Button>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigateTo(`/patient/${params.id}/view`);
              }}
              style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
            >
              Update demographics
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
            >
              Update outcome
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
            >
              Print visit summary
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
            >
              Print patient identifier
            </MenuItem>
            {!hasActiveVisit &&
              getRoles().some((role) =>
                [roles.ADMIN, roles.CLINICIAN].includes(role),
              ) && (
                <MenuItem
                  onClick={handleCloseVisitMenu}
                  style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
                >
                  Reactivate Most Recent Visit
                </MenuItem>
              )}

            <MenuItem
              onClick={() => {
                handleClose();
                setOpenPatientSummary(true);
              }}
              style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
            >
              Print patient summary
            </MenuItem>
            <MenuItem
              onClick={() => navigateTo(`/patient/${params.id}/view`)}
              sx={{ color: "blue", cursor: "pointer" }}
            >
              see more
            </MenuItem>
          </Menu>
        </div>

        <WrapperBox sx={{ display: "flex", alignItems: "center" }}>
          <WrapperBox
            sx={{
              background: "#E6E6E6",
              height: "5ch",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: "1ch",
              mt: "2ch",
              ml: "1ch",
            }}
          >
            <div className="p_name_image">
              <div
                className={
                  patient?.gender == "Male"
                    ? "initialsBox maleColor"
                    : "initialsBox femaleColor"
                }
              >
                <PersonIcon style={{ fontSize: "90px", color: "#fff" }} />
              </div>
            </div>
          </WrapperBox>
          <WrapperBox>
            <MainTypography variant="h5" fontWeight={"700"}>
              {patient?.given_name + " " + patient?.family_name}
            </MainTypography>
          </WrapperBox>
        </WrapperBox>
        <br />
        <div style={{ marginLeft: "1ch" }}>
          <LabelValue
            label="MRN:"
            value={getNationalIdIdentifiers(patient?.identifiers)}
          />
          <LabelValue
            label="Gender:"
            value={
              patient?.gender === "F"
                ? "Female"
                : patient?.gender === "M"
                  ? "Male"
                  : patient?.gender
            }
          />
          <LabelValue
            label="Age:"
            value={`  ${
              patient?.birthdate && calculateAge(patient?.birthdate)
            } yrs (${getHumanReadableShortDate(patient?.birthdate)})`}
          />
          <LabelValue
            label="Address:"
            value={
              patient?.addresses[0]?.address1 +
              " ," +
              patient?.addresses[0]?.address2 +
              ", " +
              patient?.addresses[0]?.city_village
            }
          />

          {/* ✅ ONLY ADDITION: Contact (one line) */}
          <LabelValue label="Contact:" value={contactText} />
        </div>
      </Paper>

      <PatientInfoPrintDialog
        onClose={() => setOpenPatientSummary(false)}
        open={openPatientSummary}
      />
    </>
  );
};

const LabelValue = ({ label, value }: { label: string; value: any }) => {
  return (
    <WrapperBox
      sx={{
        display: "flex",
        mb: "0.5ch",
        mt: "1ch",
        color: "#737373",
      }}
    >
      <div style={{ fontSize: "0.9rem", minWidth: "85px" }}>{label}</div>
      <div style={{ fontSize: "0.9rem", fontWeight: "700" }}>{value}</div>
    </WrapperBox>
  );
};
