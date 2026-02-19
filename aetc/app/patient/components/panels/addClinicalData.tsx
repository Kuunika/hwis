import MarkdownEditor from "@/components/markdownEditor";
import { getActivePatientDetails, useParameters } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getPatientVisitTypes } from "@/hooks/patientReg";

import { Box, Button, Popover, Tooltip } from "@mui/material";
import { useState } from "react";
import { encounters } from "@/constants";
import { FaPlus } from "react-icons/fa";

export const AddClinicalNotes = ({
  onAddNote,
  filterSoapierState,
  filterAETCState,
  filterSurgicalState, // New prop for surgical filter state
  filterGyneacologyState,
  filterMedicalInpatientState,
  setFilterSoapierState,
  setFilterAETCState,
  setFilterSurgicalState, // New prop for surgical filter setter
  setFilterGyneacologyState,
  setFilterMedicalInpatientState,
  onDownload,
  surgicalData, // ADD THIS NEW PROP
  gyneacologyData,
  medicalInpatientData,


  onClickFilterButton,
}: {
  onAddNote: (value: any) => any;
  filterSoapierState: boolean;
  filterAETCState: boolean;
  filterSurgicalState: boolean; // New prop type
  filterGyneacologyState: boolean;
  filterMedicalInpatientState: boolean;
  setFilterSoapierState: (value: boolean) => void;
  setFilterAETCState: (value: boolean) => void;
  setFilterSurgicalState: (value: boolean) => void; // New prop type
  setFilterGyneacologyState: (value: boolean) => void;
  setFilterMedicalInpatientState: (value: boolean) => void;
  onDownload: () => void;
  surgicalData?: any; // ADD THIS NEW PROP TYPE
  gyneacologyData?: any;
  medicalInpatientData?: any;


  onClickFilterButton: (value: string) => void;
}) => {
  const { hasActiveVisit } = getActivePatientDetails();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // Ref for printing
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (values: any) => {
    setAnchorEl(null);
    onAddNote(values);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const { gender } = getActivePatientDetails();

  const { params } = useParameters();
  const patientId = params.id;

  if (!patientId) {
    throw new Error("Patient ID is undefined");
  }

  const { data: allEncounters } = getPatientsEncounters(patientId as string);
  const { data: patientVisits } = getPatientVisitTypes(patientId as string);
  const activeVisit = patientVisits?.find((visit) => !Boolean(visit.date_stopped));


  const hasDisposition = () => {
    if (!allEncounters || allEncounters.length === 0) return false;
    if (!activeVisit) return false; // No active visit means no disposition for current visit

    // Check if there's a disposition encounter in the ACTIVE visit
    return allEncounters.some(
      (enc: any) => 
        enc?.encounter_type?.uuid === encounters.DISPOSITION &&
        enc?.visit_id === activeVisit?.visit_id
    );
  };



  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
          width: "100%",
        }}
      >
        {/* <Button
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          startIcon={<FaPlus />}
          disabled={!hasActiveVisit}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textTransform: "none",
            px: 3,
            py: 1,
            maxWidth: "calc(100% - 40px)",
            borderRadius: "8px",
            "& .MuiButton-startIcon": {
              marginRight: "8px",
              "& svg": {
                fontSize: "14px",
              },
            },
          }}
        >
          Add Notes
        </Button> */}

        <div>
          <Tooltip
            title={!hasDisposition() ? "Patient must be disposed before downloading PDF" : ""}
            arrow
            placement="top"
          >
            <span> {/* Wrap in span to handle disabled button tooltip */}
              <Button
                onClick={onDownload}
                disabled={!hasDisposition()}
                sx={{
                  color: "white",
                  backgroundColor: "primary.main",
                  border: "1px solid currentColor",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "14px",
                  marginRight: "10px",
                  flexGrow: 1,
                  textTransform: "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "110px",
                  "&.Mui-disabled": {
                    backgroundColor: "#9e9e9e",
                    color: "#e0e0e0",
                  },
                  "&:hover": {
                    backgroundColor: "rgb(0, 70, 0)",
                  },
                }}
              >
                Download PDF
              </Button>
            </span>
          </Tooltip>

          <span
            style={{
              width: "10px",
              borderRight: "1px solid #000",
              marginRight: "10px",
              height: "30px",
              paddingTop: "5px",
              paddingBottom: "5px",
            }}
          ></span>
          {/* <Button
            onClick={() => {
              setFilterSoapierState(true);
              setFilterAETCState(false);
              setFilterSurgicalState(false); // Reset surgical filter
              setFilterGyneacologyState(false);
              setFilterMedicalInpatientState(false);

              onClickFilterButton("SOAPIER");
            }}
            sx={{
              backgroundColor: filterSoapierState ? "rgb(221, 238, 221)" : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "120px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            SOAPIER Notes 
          </Button>
        <Button
            onClick={() => {
              setFilterAETCState(true);
              setFilterSoapierState(false);
              setFilterSurgicalState(false); // Reset surgical filter
              setFilterGyneacologyState(false);
              setFilterMedicalInpatientState(false);

              onClickFilterButton("AETC");
            }}
            sx={{
              backgroundColor: filterAETCState ? "rgb(221, 238, 221)" : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "110px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            AETC
          </Button> */}
          {/* New Surgical Notes Button */}
          <Button
            onClick={() => {
              setFilterSurgicalState(true);
              setFilterSoapierState(false);
              setFilterAETCState(false); // Reset other filters
              setFilterGyneacologyState(false);
              setFilterMedicalInpatientState(false);
            }}
            sx={{
              backgroundColor: filterSurgicalState ? "rgb(221, 238, 221)" : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "120px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            Surgical Notes
          </Button>
          {/* New Gyneacology Button */}
          {gender === "Female" && (
            <Button
              onClick={() => {
                setFilterGyneacologyState(true);
                setFilterSurgicalState(false);
                setFilterMedicalInpatientState(false);
                setFilterSoapierState(false);
                setFilterAETCState(false); // Reset other filters
              }}
              sx={{
                backgroundColor: filterGyneacologyState
                  ? "rgb(221, 238, 221)"
                  : "",
                color: "rgb(0, 70, 0)",
                border: "1px solid currentColor",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                marginRight: "10px",
                flexGrow: 1,
                textTransform: "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "120px",
                "&:hover": {
                  backgroundColor: "rgb(197, 231, 197)",
                },
              }}
            >
              Gyneacology{" "}
            </Button>
          )}
          {/* New Medical Inpatient Button */}
          <Button
            onClick={() => {
              setFilterMedicalInpatientState(true);
              setFilterGyneacologyState(false);
              setFilterSurgicalState(false);
              setFilterSoapierState(false);
              setFilterAETCState(false); // Reset other filters
            }}
            sx={{
              backgroundColor: filterMedicalInpatientState
                ? "rgb(221, 238, 221)"
                : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "120px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            Medical Inpatient{" "}
          </Button>
          <Button
            onClick={() => {
              setFilterSoapierState(false);
              setFilterAETCState(false);
              setFilterSurgicalState(false); // Reset surgical filter
              setFilterGyneacologyState(false);
              setFilterMedicalInpatientState(false);

              onClickFilterButton("All");
            }}
            sx={{
              backgroundColor:
                !filterSoapierState &&
                  !filterAETCState &&
                  !filterSurgicalState &&
                  !filterGyneacologyState &&
                  !filterMedicalInpatientState
                  ? "rgb(221, 238, 221)"
                  : "",
              color: "rgb(0, 70, 0)",
              border: "1px solid currentColor",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              marginRight: "10px",
              flexGrow: 1,
              textTransform: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "110px",
              "&:hover": {
                backgroundColor: "rgb(197, 231, 197)",
              },
            }}
          >
            All
          </Button>
        </div>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MarkdownEditor onSubmit={onSubmit} />
      </Popover>
    </>
  );
};