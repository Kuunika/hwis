"use client";
import { useEffect, useState } from "react";
import { useNavigation } from "@/hooks";
import { getPatientsWaitingForDispositionPaginated } from "@/hooks/patientReg";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  CalculateWaitingTime,
  MainButton,
  PatientTableListServer,
  WrapperBox,
} from "../../../components";
import { DisplayEncounterCreator } from "@/components";
import { encounters } from "@/constants";
import { Box, IconButton } from "@mui/material";
import { calculateAge } from "@/helpers/dateTime";
import { closeCurrentVisit } from "@/hooks/visit";
import { closeVisit } from "@/services/visit";
import { fetchPatientsTablePaginate } from "@/hooks/fetchPatientsTablePaginate";
import { CPRDialogForm } from "@/app/patient/[id]/primary-assessment/components";
import Tooltip from "@mui/material/Tooltip";
import {
  FaPlay,
  FaSignOutAlt,
  FaHeartbeat,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";
import { getActivePatientDetails } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";

export const ClientsAwaitingDisposition = () => {
  const [cpr, setCpr] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [visitUUID, setVisitUUID] = useState("");
  const [deleted, setDeleted] = useState("");
  const { navigateTo } = useNavigation();
  const { gender } = getActivePatientDetails();

  const { mutate: closeVisit, isSuccess: visitClosed } = closeCurrentVisit();
  const {
    paginationModel,
    patients: data,
    searchText,
    setSearchText,
    setPaginationModel,
    loading,
    totalPages,
    refetch, // Add refetch function from your hook
  } = fetchPatientsTablePaginate("disposition");
  const [inputText, setInputText] = useState("");
  const debouncedSearch = useDebounce(inputText, 500); // debounce for 500ms

  useEffect(() => {
    setSearchText(debouncedSearch);
  }, [debouncedSearch]);

  // Handle visit closure success
  useEffect(() => {
    if (visitClosed) {
      // Refresh the data after successful visit closure
      refetch();
      // Optional: Show success message
      console.log("Visit closed successfully, refreshing data...");
    }
  }, [visitClosed, refetch]);

  const columns = [
    // {
    //   field: "triage_result",
    //   headerName: "Triage Cat",
    //   renderCell: (cell: any) => {
    //     return (
    //       <Box
    //         sx={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           width: "100%",
    //           height: "100%",
    //         }}
    //       >
    //         <Box
    //           sx={{
    //             width: 20,
    //             height: 20,
    //             borderRadius: "50%",
    //             backgroundColor:
    //               cell.value == "red" || cell.value == "Emergency"
    //                 ? "#B42318"
    //                 : cell.value == "yellow" || cell.value == "Priority"
    //                   ? "#EDE207"
    //                   : cell.value == "green" || cell.value == "Queue"
    //                     ? "#016302"
    //                     : "transparent",
    //           }}
    //         />
    //       </Box>
    //     );
    //   },
    // },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "gender", headerName: "Gender" },
    {
      field: "waiting",
      headerName: "Aggregated Time",
      flex: 1,
      renderCell: (cell: any) => (
        <CalculateWaitingTime arrival_time={cell.row.arrival_time} />
      ),
    },
    {
      field: "last_encounter_creator",
      headerName: "Disposed By",
      flex: 1,
    },
    {
      field: "patient_care_area",
      flex: 1,
      headerName: "Patient Care Area",
    },
    {
      field: "disposition_type",
      headerName: "Disposition Type",
      flex: 1,
    },
    {
      field: "destination",
      headerName: "Destination",
      flex: 1,
    },

    {
      field: "action",
      headerName: "Actions",
      flex: 1.2,
      renderCell: (cell: any) => (
        <Box display="flex" gap={1}>
          <DispositionActions
            patient={cell.row}
            onVisitClosed={refetch} // Pass refetch function
          />
          {/* {cell.row.triage_result == "red" && (
            <Tooltip title="Initiate CPR" arrow>
              <IconButton
                onClick={() => {
                  setPatientId(cell.row.id);
                  setCpr(true);
                  setVisitUUID(cell.row.visit_uuid);
                }}
                aria-label="initiate CPR"
                color="error"
              >
                <FaHeartbeat />
              </IconButton>
            </Tooltip>
          )} */}
        </Box>
      ),
    },
  ];

  const formatForMobileView = data?.map((row: any) => {
    return {
      id: row.id,
      visitNumber: row.aetc_visit_number,
      firstName: row.given_name,
      lastName: row.family_name,
      gender: row.gender,
      arrivalTime: row.patient_arrival_time,
      arrivalDateTime: row.arrival_time,
      dispositionType: row.disposition_type,
      actor: (
        <DisplayEncounterCreator
          encounterType={encounters.DISPOSITION}
          patientId={row.id}
        />
      ),
      aggregate: <CalculateWaitingTime arrival_time={row.arrival_time} />,
      waitingTime: (
        <CalculateWaitingTime arrival_time={row?.latest_encounter_time} />
      ),
      actionName: "Disposed By",
      action: (
        <CardAction
          patient={row}
          setDeleted={(id: any) => setDeleted(id)}
          triage={row.triage_result}
          visitId={row.visit_uuid}
          id={row.uuid}
          // showCPR={row.triage_result === "red"}
          // onCPR={() => {
          //   setPatientId(row.id);
          //   setCpr(true);
          //   setVisitUUID(row.visit_uuid);
          // }}
          onVisitClosed={refetch} // Pass refetch function
        />
      ),
      age: `${calculateAge(row.birthdate)}yrs`,
      triageResult: row.triage_result,
    };
  });

  return (
    <>
      <PatientTableListServer
        columns={columns}
        data={
          data?.length
            ? {
              data: data.map((row: any) => ({ id: row.uuid, ...row })),
              page: paginationModel.page,
              per_page: paginationModel.pageSize,
              total_pages: totalPages,
            }
            : { data: [], page: 1, per_page: 10, total_pages: 0 }
        }
        searchText={inputText}
        setSearchString={setInputText}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
        loading={loading}
        formatForMobileView={formatForMobileView ? formatForMobileView : []}
      />
      {/* <CPRDialogForm
        patientuuid={patientId}
        visituuid={visitUUID}
        open={cpr}
        onClose={() => setCpr(false)}
      /> */}
    </>
  );
};

// Actions: Select form or close visit
const DispositionActions = ({
  patient,
  onVisitClosed,
}: {
  patient: any;
  onVisitClosed: () => void;
}) => {
  const { navigateTo } = useNavigation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { mutate: closeVisitMutation, isSuccess: visitClosed } =
    closeCurrentVisit();
  const { gender } = getActivePatientDetails();

  useEffect(() => {
    if (visitClosed) {
      // Call the refresh function passed from parent
      onVisitClosed();
    }
  }, [visitClosed, onVisitClosed]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseVisit = () => {
    if (patient.visit_uuid) {
      closeVisitMutation(patient.visit_uuid);
    } else {
      console.warn("No active visit UUID found for this patient.");
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title="View Profile" arrow>
        <IconButton
          onClick={() => navigateTo(`/patient/${patient.id}/profile`)}
          aria-label="view profile"
          sx={{ color: "green" }}
        >
          <FaPlay />
        </IconButton>
      </Tooltip>
      <Tooltip title="Close Visit" arrow>
        <IconButton
          onClick={handleCloseVisit}
          aria-label="close visit"
          sx={{ color: "grey" }}
        >
          <FaSignOutAlt />
        </IconButton>
      </Tooltip>
      <Tooltip title="Template Forms" arrow>
        <IconButton
          onClick={handleClick}
          aria-label="template forms"
          sx={{ color: "#015E85" }}
        >
          <FaFileAlt />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => navigateTo(`/patient/${patient.id}/medicalInpatient`)}
        >
          Medical Inpatient
        </MenuItem>
        <MenuItem
          onClick={() => navigateTo(`/patient/${patient.id}/surgicalNotes`)}
        >
          Surgical Notes
        </MenuItem>
        {patient.gender?.toLowerCase() === "female" && (
          <MenuItem
            onClick={() => navigateTo(`/patient/${patient.id}/gyneacology`)}
          >
            Gyneacology Ward Admission
          </MenuItem>
        )}

      </Menu>
    </Box>
  );
};

const CardAction = ({
  id,
  visitId,
  triage,
  setDeleted,
  patient,
  showCPR,
  onCPR,
  onVisitClosed,
}: {
  id: string;
  visitId: string;
  triage: string;
  setDeleted: (id: any) => void;
  patient: any;
  showCPR?: boolean;
  onCPR?: () => void;
  onVisitClosed: () => void;
}) => {
  const { navigateTo } = useNavigation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { mutate: closeVisitMutation, isSuccess: visitClosed } =
    closeCurrentVisit();

  useEffect(() => {
    if (visitClosed) {
      // Call the refresh function passed from parent
      onVisitClosed();
    }
  }, [visitClosed, onVisitClosed]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseVisit = () => {
    if (patient.visit_uuid) {
      closeVisitMutation(patient.visit_uuid);
    } else {
      console.warn("No active visit UUID found for this patient.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
      <WrapperBox
        sx={{
          borderRadius: "2px",
          width: "100%",
          height: "5ch",
          backgroundColor:
            triage == "red"
              ? "#B42318"
              : triage == "yellow"
                ? "#ede207"
                : triage == "green"
                  ? "#016302"
                  : "",
          marginY: 1,
        }}
      ></WrapperBox>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        <Tooltip title="Close Visit" arrow>
          <IconButton
            onClick={handleCloseVisit}
            aria-label="close visit"
            size="small"
            sx={{ color: "#015E85" }}
          >
            <FaSignOutAlt />
          </IconButton>
        </Tooltip>
        <Tooltip title="Template Forms" arrow>
          <IconButton
            onClick={handleClick}
            aria-label="template forms"
            size="small"
            sx={{ color: "#015E85" }}
          >
            <FaFileAlt />
          </IconButton>
        </Tooltip>
        <Tooltip title="View Profile" arrow>
          <IconButton
            onClick={() => navigateTo(`/patient/${patient.id}/profile`)}
            aria-label="view profile"
            size="small"
            sx={{ color: "#015E85" }}
          >
            <FaPlay />
          </IconButton>
        </Tooltip>
        {showCPR && (
          <Tooltip title="Initiate CPR" arrow>
            <IconButton
              onClick={onCPR}
              aria-label="initiate CPR"
              size="small"
              color="error"
            >
              <FaHeartbeat />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Menu
        id="card-action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            navigateTo(`/patient/${id}/medicalInpatient`);
            handleClose();
          }}
        >
          Medical Inpatient
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigateTo(`/patient/${id}/surgicalNotes`);
            handleClose();
          }}
        >
          Surgical Notes
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigateTo(`/patient/${id}/gyneacology`);
            handleClose();
          }}
        >
          Gyneacology Ward Admission
        </MenuItem>
      </Menu>
    </Box>
  );
};
