"use client";
import { calculateAge } from "@/helpers/dateTime";
import { useEffect, useState } from "react";
import { useNavigation } from "@/hooks";
import * as React from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import { FaPlay, FaHeartbeat } from "react-icons/fa";

import {
  CalculateWaitingTime,
  MainButton,
  PatientTableListServer,
  WrapperBox,
} from "../../../components";

import { AbscondButton } from "@/components/abscondButton";
import { DisplayEncounterCreator } from "@/components";
import { encounters } from "@/constants";
import { Box, IconButton } from "@mui/material";
import {
  FetchAndDisplayTriageBarcode,
  PrinterBarcodeButton,
} from "@/components/barcodePrinterDialogs";
import { CPRDialogForm } from "@/app/patient/[id]/primary-assessment/components";
import { HiPrinter } from "react-icons/hi2";
import { fetchPatientsTablePaginate } from "@/hooks/fetchPatientsTablePaginate";
import { useDebounce } from "@/hooks/useDebounce";

export const ClientWaitingForAssessment = () => {
  const [cpr, setCpr] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [visitUUID, setVisitUUID] = useState("");
  const [deleted, setDeleted] = useState("");
  const { navigateTo } = useNavigation();
  const {
    paginationModel,
    patients: data,
    searchText,
    setSearchText,
    setPaginationModel,
    loading,
    totalPages,
    setOnSwitch,
  } = fetchPatientsTablePaginate("assessment");
  const [inputText, setInputText] = useState("");
  const debouncedSearch = useDebounce(inputText, 500); // debounce for 500ms

  useEffect(() => {
    setSearchText(debouncedSearch);
  }, [debouncedSearch]);
  const [patientsData, setPatientsData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setPatientsData(data);
    }
  }, [data]);

  const handleDelete = (deletedId: string) => {
    const updatedData = patientsData.filter(
      (item: any) => item.uuid !== deletedId
    );
    setPatientsData(updatedData);
    setDeleted(deletedId);
  };

  const columns = [
    // { field: "aetc_visit_number", headerName: "Visit" },
    {
      field: "triage_result",
      headerName: "Triage Cat",
      renderCell: (cell: any) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor:
                  cell.value == "red" || cell.value == "Emergency"
                    ? "#B42318"
                    : cell.value == "yellow" || cell.value == "Priority"
                      ? "#EDE207"
                      : cell.value == "green" || cell.value == "Queue"
                        ? "#016302"
                        : "transparent",
              }}
            />
          </Box>
        );
      },
    },

    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "gender", headerName: "Gender" },
    {
      field: "waiting",
      headerName: "WaitingTime",
      flex: 1,
      renderCell: (cell: any) => {
        return (
          <CalculateWaitingTime arrival_time={cell.row.latest_encounter_time} />
        );
      },
    },
    {
      field: "aggreg",
      headerName: "Aggregate",
      flex: 1,
      renderCell: (cell: any) => {
        return <CalculateWaitingTime arrival_time={cell.row.arrival_time} />;
      },
    },
    { field: "last_encounter_creator", headerName: "Triaged By", flex: 1 },
    {
      field: "patient_care_area",
      flex: 1,
      headerName: "Patient Care Area",
    },

    {
      field: "action",
      headerName: "Action",
      flex: 1.5,
      renderCell: (cell: any) => {
        return (
          <Box display="flex" gap={1}>
            <Tooltip title="Start assessment" arrow>
              <IconButton
                onClick={() => navigateTo(`/patient/${cell.id}/profile`)}
                aria-label="start assessment"
                color="primary"
              >
                <FaPlay />
              </IconButton>
            </Tooltip>

            <Tooltip title="Mark as absconded" arrow>
              <AbscondButton
                onDelete={() => handleDelete(cell.id)}
                visitId={cell.row.visit_uuid}
                patientId={cell.id}
              />
            </Tooltip>

            <Tooltip title="Print options" arrow>
              <BasicMenu patient={cell.row} />
            </Tooltip>

            {cell.row.triage_result == "red" && (
              <Tooltip title="Initiate CPR" arrow>
                <IconButton
                  onClick={() => {
                    setPatientId(cell.id);
                    setCpr(true);
                    setVisitUUID(cell.row.visit_uuid);
                  }}
                  aria-label="initiate CPR"
                  color="error"
                >
                  <FaHeartbeat />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  const formatForMobileView = patientsData?.map((row: any) => {
    return {
      id: row.id,
      visitNumber: row.aetc_visit_number,
      firstName: row.given_name,
      lastName: row.family_name,
      gender: row.gender,
      arrivalTime: row.patient_arrival_time,
      arrivalDateTime: row.arrival_time,
      actor: (
        <DisplayEncounterCreator
          encounterType={encounters.VITALS}
          patientId={row.id}
        />
      ),
      aggregate: <CalculateWaitingTime arrival_time={row.arrival_time} />,
      waitingTime: (
        <CalculateWaitingTime arrival_time={row?.latest_encounter_time} />
      ),
      actionName: "Triaged By",
      action: (
        <CardAction
          patient={row}
          setDeleted={(id: any) => handleDelete(id)}
          triage={row.triage_result}
          visitId={row.visit_uuid}
          id={row.uuid}
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
          patientsData?.length
            ? {
                data: patientsData,
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
        onSwitchChange={setOnSwitch}
        onRowClick={(row: any) => navigateTo(`/patient/${row.id}/profile`)}
      />
      <CPRDialogForm
        patientuuid={patientId}
        visituuid={visitUUID}
        open={cpr}
        onClose={() => setCpr(false)}
      />
    </>
  );
};

const CardAction = ({
  id,
  visitId,
  triage,
  setDeleted,
  patient,
}: {
  id: string;
  visitId: string;
  triage: string;
  setDeleted: (id: any) => void;
  patient: any;
}) => {
  const { navigateTo } = useNavigation();

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
      <Box sx={{ flex: "1" }}>
        <Tooltip title="Start assessment" arrow>
          <MainButton
            sx={{ fontSize: "12px", width: "30%", mr: "2px", mb: "1px" }}
            title={"Start"}
            onClick={() => navigateTo(`/patient/${id}/profile`)}
          />
        </Tooltip>

        <Tooltip title="Mark as absconded" arrow>
          <AbscondButton
            sx={{ width: "30%" }}
            onDelete={() => setDeleted(id)}
            visitId={visitId}
            patientId={id}
          />
        </Tooltip>

        <Tooltip title="Print barcode" arrow>
          <PrinterBarcodeButton sx={{ width: "30%" }} uuid={patient?.uuid} />
        </Tooltip>
      </Box>
    </Box>
  );
};

export function BasicMenu({ patient }: { patient: any }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Print" arrow>
        <IconButton
          onClick={handleClick}
          aria-label="Print"
          sx={{ color: "#015E85" }}
        >
          <HiPrinter />
        </IconButton>
      </Tooltip>
      {/* <Button
        size="small"
        variant="text"
        onClick={handleClick}
      >
        Print
      </Button> */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem sx={{ justifyContent: "flex-start" }}>
          <PrinterBarcodeButton
            title="Demographics"
            sx={{ color: "ButtonText" }}
            variant="text"
            onClose={handleClose}
            uuid={patient?.uuid}
          />
        </MenuItem>
        <MenuItem sx={{ justifyContent: "flex-start" }}>
          <FetchAndDisplayTriageBarcode
            arrivalDateTime={patient.arrival_time}
            patientId={patient.id}
            activeVisitId={patient?.visit_uuid}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
