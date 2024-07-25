import { calculateAge, getCATTime, getTime } from "@/helpers/dateTime";
import { useState } from "react";
import { useNavigation } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getPatientsWaitingForTriage } from "@/hooks/patientReg";
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
import { PrinterBarcodeButton } from "@/components/patientBarcodePrinter";

export const ClientWaitingForTriage = () => {
  const [deleted, setDeleted] = useState("");
  const {
    data: patients,
    isLoading,
    isRefetching,
  } = getPatientsWaitingForTriage();
  const { navigateTo } = useNavigation();

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
    { field: "patient_arrival_time", headerName: "Arrival Time" },
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
    {
      field: "registered",
      headerName: "Registered By",
      flex: 1,
      renderCell: (cell: any) => {
        return (
          <DisplayEncounterCreator
            encounterType={encounters.SOCIAL_HISTORY}
            patientId={cell.row.id}
          />
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
              onClick={() => navigateTo(`/triage/${cell.id}/start`)}
            />
            <AbscondButton
              onDelete={() => setDeleted(cell.id)}
              visitId={cell.row.visit_uuid}
              patientId={cell.id}
            />
            <PrinterBarcodeButton patient={cell.row} />
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
          encounterType={encounters.SOCIAL_HISTORY}
          patientId={row.id}
        />
      ),
      aggregate: <CalculateWaitingTime arrival_time={row.arrival_time} />,
      waitingTime: (
        <CalculateWaitingTime arrival_time={row?.latest_encounter_time} />
      ),
      actionName: "Registered by",
      action: (
        <>
          <MainButton
            size="small"
            sx={{ fontSize: "12px", width: "30%", mr: "1px", mb:"1px" }}
            title={"start"}
            onClick={() => navigateTo(`/triage/${row.id}/start`)}
          />
          <AbscondButton
            sx={{ width: "30%" }}
            onDelete={() => setDeleted(row.id)}
            visitId={row.visit_uuid}
            patientId={row.id}
          />
          <PrinterBarcodeButton sx={{ width: "30%" }} patient={row} />
        </>
      ),
      age: calculateAge(row.birthdate),
      triageResult: row.triage_result,
    };
  });

  return (
    <PatientTableList
      formatForMobileView={formatForMobileView}
      isLoading={isLoading || isRefetching}
      columns={columns}
      rows={rows ? rows : []}
    />
  );
};
