import { calculateAge, getCATTime, getTime } from "@/helpers/dateTime";
import { useNavigation } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getPatientsWaitingForPrescreening } from "@/hooks/patientReg";
import { getVisitNum } from "@/hooks/visitNumber";
import { useEffect, useState } from "react";
import {
  BaseTable,
  CalculateWaitingTime,
  MainButton,
  MainTypography,
  PatientTableList,
} from "@/components";
import Image from "next/image";
import { AbscondButton } from "@/components/abscondButton";
import { DisplayEncounterCreator } from "@/components";
import { encounters } from "@/constants";

export const InitialRegistrationList = () => {
  const { navigateTo } = useNavigation();
  const [deleted, setDeleted] = useState("");
  const {
    data: patients,
    isLoading,
    isRefetching,
  } = getPatientsWaitingForPrescreening();

  const rows = patients
    ?.sort((p1, p2) => {
      //@ts-ignore
      return new Date(p1.arrival_time) - new Date(p2.arrival_time);
    })
    .map((p) => ({
      id: p?.uuid,
      ...p,
      patient_arrival_time: getTime(p.arrival_time),
    }))
    .filter((p) => p.id != deleted);

  const columns = [
    { field: "aetc_visit_number", headerName: "Visit Number" },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "patient_arrival_time", headerName: "Arrival Time", flex: 1 },
    {
      field: "waiting",
      headerName: "WaitingTime",
      flex: 1,
      renderCell: (cell: any) => {
        return <CalculateWaitingTime arrival_time={cell.row.arrival_time} />;
      },
    },
    { field: "last_encounter_creator", headerName: "Registered By", flex: 1 },
    {
      field: "action",
      flex: 1,
      headerName: "Action",
      renderCell: (cell: any) => {
        return (
          <>
            <MainButton
              size="small"
              sx={{ fontSize: "12px", mr:"1px" }}
              title={"screen"}
              onClick={() => navigateTo(`/prescreening/${cell.id}`)}
            />
            <AbscondButton
              onDelete={() => setDeleted(cell.id)}
              visitId={cell.row.visit_uuid}
              patientId={cell.id}
            />
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
          encounterType={encounters.INITIAL_REGISTRATION}
          patientId={row.id}
        />
      ),
      aggregate: <CalculateWaitingTime arrival_time={row.arrival_time} />,
      waitingTime: (
        <CalculateWaitingTime arrival_time={row?.latest_encounter_time} />
      ),
      actionName: "registered by",
      action: (
        <>
          {" "}
          <MainButton
            sx={{ fontSize: "12px",width:"49%", mr:"1px" }}
            title={"screen"}
            onClick={() => navigateTo(`/prescreening/${row.id}`)}
          />
          <AbscondButton
          sx={{width:"49%"}}
            onDelete={() => setDeleted(row.id)}
            visitId={row.visit_uuid}
            patientId={row.id}
          />
        </>
      ),
      age: "N/A",
      triageResult: row.triage_result,
    };
  });

  return (
    <PatientTableList formatForMobileView={formatForMobileView}  isLoading={isLoading || isRefetching}
    columns={columns}
    rows={rows ? rows : []} />
  );
};

