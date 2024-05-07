import { getCATTime, getTime } from "@/helpers/dateTime";
import { useNavigation } from "@/hooks";
import { getPatientsEncounters } from "@/hooks/encounter";
import { getPatientsWaitingForPrescreening } from "@/hooks/patientReg";
import { getVisitNum } from "@/hooks/visitNumber";
import { useEffect, useState } from "react";
import { BaseTable, MainButton, MainTypography } from "shared-ui/src";
import Image from "next/image";
import { AbscondButton } from "@/components/abscondButton";

export const InitialRegistrationList = () => {
  const { navigateTo } = useNavigation();
  const { data } = getVisitNum();
  const [deleted, setDeleted] = useState('')
  const {
    data: patients,
    isLoading,
    isRefetching
  } = getPatientsWaitingForPrescreening();



  const rows = patients?.sort((p1, p2) => {
    //@ts-ignore
    return new Date(p1.arrival_time) - new Date(p2.arrival_time);
  }).map((p) => ({ id: p?.uuid, ...p, patient_arrival_time: getTime(p.arrival_time) })).filter(p => p.id != deleted)



  const columns = [
    { field: "aetc_visit_number", headerName: "Visit Number", },
    { field: "given_name", headerName: "First Name", flex: 1 },
    { field: "family_name", headerName: "Last Name", flex: 1 },
    { field: "patient_arrival_time", headerName: "Arrival Time", flex: 1 },
    {
      field: "waiting", headerName: "WaitingTime", flex: 1, renderCell: (cell: any) => {
        return <CalculateWaitingTime arrival_time={cell.row.arrival_time} patientId={cell.row.id} />
      }
    },

    {
      field: "action",
      flex: 1,
      headerName: "Action",
      renderCell: (cell: any) => {
        return (
          <>
            <MainButton
              sx={{ fontSize: "12px" }}
              title={"screen"}
              onClick={() => navigateTo(`/prescreening/${cell.id}`)}
            />
            <AbscondButton onDelete={() => setDeleted(cell.id)} visitId={cell.row.visit_uuid} patientId={cell.id} />
          </>
        );
      },
    },
  ];

  return (
    <BaseTable loading={isLoading || isRefetching} columns={columns} rows={rows ? rows : []} />
  );
};

function CalculateWaitingTime({ patientId, arrival_time }: { patientId: string, arrival_time: any }) {
  // const { data, isLoading } = getPatientsEncounters(patientId);


  // const encounter = data?.find(encounter => encounter.encounter_type.name === 'Initial Registration');


  // if (isLoading) {
  //   return <Image src={"/loader.svg"} width={20} height={20} alt="loader" />
  // }

  // if (!encounter) {
  //   return "No encounter data available";
  // }

  // const encounterDatetime = encounter.encounter_datetime;

  const currentTime: any = getCATTime()

  const differenceInMilliseconds = currentTime - Date.parse(arrival_time);

  let waitingTime;

  const seconds = Math.floor(differenceInMilliseconds / 1000);
  if (seconds < 60) {
    waitingTime = `${seconds} seconds`;
  } else {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      waitingTime = `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      waitingTime = `${hours} hours`;
    }
  }

  return (
    <MainTypography>{waitingTime}</MainTypography>
  )
}