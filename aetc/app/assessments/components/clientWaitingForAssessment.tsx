"use client";
import { calculateAge } from "@/helpers/dateTime";
import { useEffect, useState } from "react";
import { useNavigation } from "@/hooks";
import { getPatientsWaitingForAssessmentPaginated } from "@/hooks/patientReg";
import * as React from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import {
  CalculateWaitingTime,
  MainButton,
  PatientTableListServer,
  WrapperBox,
} from "../../../components";

import { AbscondButton } from "@/components/abscondButton";
import { DisplayEncounterCreator } from "@/components";
import { encounters } from "@/constants";
import { Box, Button, Typography } from "@mui/material";
import {
  FetchAndDisplayTriageBarcode,
  PrinterBarcodeButton,
} from "@/components/barcodePrinterDialogs";
import { CPRDialogForm } from "@/app/patient/[id]/primary-assessment/components";

export const ClientWaitingForAssessment = () => {
  const [cpr, setCpr] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [visitUUID, setVisitUUID] = useState("");
  const [deleted, setDeleted] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const { navigateTo } = useNavigation();

  const [searchText, setSearchText] = useState("");
  const { data, refetch, isPending } = getPatientsWaitingForAssessmentPaginated(
    paginationModel,
    searchText
  );

  const [patientsData, setPatientsData] = useState<any>([]);

  useEffect(() => {
    refetch();
  }, [paginationModel]);

  useEffect(() => {
    if (data?.data) {
      setPatientsData(data.data);
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
    { field: "aetc_visit_number", headerName: "Visit" },
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
      field: "triage_result",
      headerName: "Triage Category",
      renderCell: (cell: any) => {
        return (
          <Box sx={{display:"flex", flexDirection:"column",}}>
          <Box
            sx={{
              borderRadius: "2px",
              width: "100%",
              height: "80%",
              backgroundColor:
                cell.value == "red"
                  ? "#B42318"
                  : cell.value == "yellow"
                  ? "#ede207"
                  : cell.value == "green"
                  ? "#016302"
                  : "",
              marginY: 1,
            }}
          ></Box>
          {/* <Typography>{cell.row?.patient_referred_to}</Typography> */}
          </Box>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      flex: 1.2,
      renderCell: (cell: any) => {
        return (
          <>
            <MainButton
              size="small"
              sx={{ fontSize: "12px", mr: "1px" }}
              title={"start"}
              onClick={() => navigateTo(`/patient/${cell.id}/profile`)}
            />
            <AbscondButton
              onDelete={() => handleDelete(cell.id)} // Updated to handle deletion
              visitId={cell.row.visit_uuid}
              patientId={cell.id}
            />

            {cell.row.triage_result == "red" && (
              <Button
                variant="text"
                onClick={() => {
                  setPatientId(cell.id);
                  setCpr(true);
                  setVisitUUID(cell.row.visit_uuid);
                }}
              >
                Start CPR
              </Button>
            )}
            <BasicMenu patient={cell.row} />
          </>
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
          setDeleted={(id: any) => handleDelete(id)} // Updated to handle deletion
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
            ? { data: patientsData, page: 1, per_page: 10, total_pages: 0 }
            : { data: [], page: 1, per_page: 10, total_pages: 0 }
        }
        searchText={searchText}
        setSearchString={setSearchText}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
        loading={isPending}
        formatForMobileView={formatForMobileView ? formatForMobileView : []}
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
        <MainButton
          sx={{ fontSize: "12px", width: "30%", mr: "2px", mb: "1px" }}
          title={"start"}
          onClick={() => navigateTo(`/patient/${id}/profile`)}
        />
        <AbscondButton
          sx={{ width: "30%" }}
          onDelete={() => setDeleted(id)} // Call the updated handleDelete function
          visitId={visitId}
          patientId={id}
        />
        <PrinterBarcodeButton sx={{ width: "30%" }} patient={patient} />
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
    <div>
      <MainButton
        size="small"
        sx={{ fontSize: "12px", ml: "1px" }}
        variant="secondary"
        title={"Print"}
        onClick={handleClick}
      />

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
            patient={patient}
          />
        </MenuItem>
        <MenuItem sx={{ justifyContent: "flex-start" }}>
          <FetchAndDisplayTriageBarcode
            arrivalDateTime={patient.arrival_time}
            patientId={patient.id}
            activeVisitId={patient?.active_visit?.visit_id}
          />
        </MenuItem>
      </Menu>
    </div>
  );
}
