'use client'
import { calculateAge, getTime } from "@/helpers/dateTime";
import { useState } from "react";
import { checkScreenSize, useNavigation } from "@/hooks";
import { getPatientsWaitingForAssessment } from "@/hooks/patientReg";
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import {
  BaseTable,
  CalculateWaitingTime,
  MainButton,
  PatientTableList,
  WrapperBox,
} from "../../../components";


import { AbscondButton } from "@/components/abscondButton";
import { DisplayEncounterCreator } from "@/components";
import { encounters, triageResult } from "@/constants";
import { Box } from "@mui/material";
import { FetchAndDisplayTriageBarcode, PrinterBarcodeButton } from "@/components/barcodePrinterDialogs";


export const ClientWaitingForAssessment = () => {
  const [deleted, setDeleted] = useState("");
  const { navigateTo } = useNavigation();
  const {
    data: patients,
    isLoading,
    isRefetching,
  } = getPatientsWaitingForAssessment();


  const rows = patients
    ?.sort((p1, p2) => {
      const triagePriority: any = { red: 1, yellow: 2, green: 3 };
      if (triagePriority[p1.triage_result] < triagePriority[p2.triage_result]) {
        return -1;
      }
      if (triagePriority[p1.triage_result] > triagePriority[p2.triage_result]) {
        return 1;
      }

      // If triage results are the same, then sort by arrival time (earliest first)
      //@ts-ignore
      return new Date(p1.arrival_time) - new Date(p2.arrival_time);
    })
    .map((p) => ({
      id: p?.uuid,
      ...p,
      patient_arrival_time: getTime(p.arrival_time),
    })).filter(p => p.id != deleted);

  const columns = [
    { field: "aetc_visit_number", headerName: "Visit" },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    // { field: "patient_arrival_time", headerName: "Arrival Time" },
    { field: "birthdate", headerName: "Date Of Birth", },
    { field: "gender", headerName: "Gender" },
    {
      field: "waiting",
      headerName: "WaitingTime",
      flex: 1,
      renderCell: (cell: any) => {
        return (
          <CalculateWaitingTime
            arrival_time={cell.row.latest_encounter_time}
          />
        );
      },
    },
    {
      field: "aggreg",
      headerName: "Aggregate",
      flex: 1,
      renderCell: (cell: any) => {
        return (
          <CalculateWaitingTime
            arrival_time={cell.row.arrival_time}
          />
        );
      },
    },
    { field: "last_encounter_creator", headerName: "Triaged By", flex: 1 },
    {
      field: "triage_result",
      headerName: "Triage Category",

      renderCell: (cell: any) => {
        return (
          <WrapperBox
            sx={{
              borderRadius: "2px",
              width: "100%",
              height: "80%",
              backgroundColor:
                cell.value == "red"
                  ? "#B42318"
                  : cell.value == "yellow"
                    ? "#ede207"
                    : // : "#B54708",
                    cell.value == "green"
                      ? "#016302"
                      : "",
              marginY: 1,
            }}
          ></WrapperBox>
        );
      },
    },
    // { field: "patientWaitingTime", headerName: "Waiting Time", flex: 1 },
    // {
    //   field: "aggreWaitingTime",
    //   headerName: "Aggre Waiting Time since arrival",
    //   flex: 1,
    // },
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
              onDelete={() => setDeleted(cell.id)}
              visitId={cell.row.visit_uuid}
              patientId={cell.id}
            />
            <BasicMenu patient={cell.row} />
          </>
        );
      },
    },
  ];





  const formatForMobileView = rows?.map((row) => {
    return {
      id: row.id,
      visitNumber: row.aetc_visit_number,
      firstName: row.given_name,
      lastName: row.family_name,
      gender: row.gender,
      arrivalTime: row.patient_arrival_time,
      actor: (
        <DisplayEncounterCreator
          encounterType={encounters.VITALS}
          patientId={row.id}
        />
      ),
      aggregate: (
        <CalculateWaitingTime
          arrival_time={row.arrival_time}

        />
      ),
      waitingTime: (
        <CalculateWaitingTime
          arrival_time={row?.latest_encounter_time}
        />
      ),
      actionName: "Triaged By",
      action: (
        <CardAction
          patient={row}
          setDeleted={(id: any) => setDeleted(id)}
          triage={row.triage_result}
          visitId={row.visit_uuid}
          id={row.id}
        />
      ),
      age: `${calculateAge(row.birthdate)}yrs`,
      triageResult: row.triage_result,
    };
  });

  return <PatientTableList rows={rows} formatForMobileView={formatForMobileView} isLoading={isLoading || isRefetching} columns={columns} />

};

const CardAction = ({
  id,
  visitId,
  triage,
  setDeleted,
  patient
}: {
  id: string;
  visitId: string;
  triage: string;
  setDeleted: (id: any) => void,
  patient: any
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
                : // : "#B54708",
                triage == "green"
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
          onDelete={() => setDeleted(id)}
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
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Print
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}

        open={open}
        onClose={handleClose}

      >
        <MenuItem><PrinterBarcodeButton title="Demographics" sx={{ color: "ButtonText" }} variant="text" onClose={handleClose} patient={patient} /> </MenuItem>
        <MenuItem><FetchAndDisplayTriageBarcode arrivalDateTime={patient.arrival_time} patientId={patient.id} activeVisitId={patient?.active_visit?.visit_id} /></MenuItem>
      </Menu>
    </div>
  );
}
